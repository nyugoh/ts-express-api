import {Request, Response} from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import moment from "moment";
import jwt from 'jsonwebtoken';
import {User} from "../models";
import sendEmail, {mail} from "../utils/mailer";

class AuthController {
    static async signup(req: Request, res: Response) {
        const {userName, email, fullName, firstName, lastName} = req.body;
        const userNameTaken = await User.findAndCountAll({where: {userName}});
        const emailExists = await User.findAndCountAll({where: {email}});
        const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isValidEmail = regexp.test(email);

        if (userNameTaken.count > 0) {
            return res.json({
                success: false,
                message: "Username taken"
            });
        }

        if (emailExists.count > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        if (!isValidEmail) {
            return res.json({
                success: false,
                message: "Provide a valid email"
            });
        }
        if (!fullName) {
            req.body.fullName = `${firstName} ${lastName}`;
        }
        const user = await User.create(req.body);
        delete user.password;
        res.json({
            success: true,
            user,
            message: "Welcome, signup successful"
        });
    }

    static async login(req: Request, res: Response) {
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(402).json({
                success: false,
                message: "Incorrect credentials"
            });
        }

        let userPassword = user.password.replace("$2y$", "$2a$");
        if (!await bcrypt.compare(password, userPassword)) {
            return res.status(402).json({
                success: false,
                message: "Incorrect credentials"
            });
        } else {
            const token = jwt.sign({
                id: user.id
            }, process.env.APP_KEY);
            delete user.password;
            return res.json({
                success: true,
                message: "Login successful",
                payload: {
                    token,
                    user
                }
            });
        }
    }

    static async recoverPassword(req: Request, res: Response) {
        const {email} = req.body;
        let user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(402).json({
                success: false,
                message: "User doesnt exist"
            });
        }
        // Generate a token and expiry date
        const buffer = await crypto.randomBytes(50);
        const token = buffer.toString('hex');
        const expiryDate = moment().add(12, 'hours').format();

        // Insert into DB
        await User.update({
            passwordToken: token,
            tokenExpiry: expiryDate
        }, {where: {email}});

        // send email with token
        const callBackUrl = `http://${process.env.HOST}:${process.env.PORT}/api/auth/reset-password?reset_token=${token}`;
        const html = `
        <div>
        <h4>You have received this email because you requested password change.</h4>
        <p>Click this <a href="${callBackUrl}">link </a> to reset your password</p>
        <br>
        <br>
        <p>Thanks.</p>
        </div>
        `;
        const mailOptions = {
            from: "nyugoh@gmail.com",
            to: user.email,
            subject: 'Password reset',
            html
        };


        mail(mailOptions);
        /*, function (info) {
            console.log(info);
            if(info.error){
                res.json({
                    success: false
                })
            }
        });*/
        return res.json({
            success: true,
            message: "Email sent, token expires in 12 hours",
            url: callBackUrl
        });
    }

    static async resetPassword(req: Request, res: Response) {
        const token = req.query.reset_token;
        const user = await User.findOne({where: {passwordToken: token}});
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid link"
            });
        }
        if (moment().isBefore(moment(user.tokenExpiry))) {
            if (req.method == 'GET') {
                /*
                 const buffer = await crypto.randomBytes(50); // check if token match when updating password
                const token = buffer.toString('hex');
                // Insert into DB
                await User.update({
                    passwordToken: token,
                }, { where: { email: user.email }});
               */
                // Redirect to reset password form
                return res.json({
                    success: true,
                    message: 'Redirect user to reset form'
                });
            } else {
                const {password} = req.body;
                if (!password)
                    return res.json({
                        success: false,
                        message: "Password is required"
                    });
                user.password = password;
                await User.hashPassword(user);
                await User.update({
                    password: user.password,
                    passwordToken: null,
                    tokenExpiry: null
                }, {where: {id: user.id, passwordToken: token}});
                return res.json({
                    success: true,
                    message: "Reset successful, redirect to login"
                });
            }
        } else {
            res.json({
                success: false,
                message: "Token is expired"
            });
        }
    }
}

export default AuthController;
