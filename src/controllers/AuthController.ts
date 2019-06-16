import {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {User} from "../models";

class AuthController {
    static async signup(req: Request, res: Response) {
        const { userName, email, fullName, firstName, lastName } = req.body;
        const userNameTaken = await User.findAndCountAll({where: { userName}});
        const emailExists = await User.findAndCountAll({where: { email}});
        const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isValidEmail = regexp.test(email);

        if(userNameTaken.count > 0) {
            return res.json({
                success: false,
                message: "Username taken"
            });
        }

        if(emailExists.count > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        if(!isValidEmail) {
            return res.json({
                success: false,
                message: "Provide a valid email"
            });
        }
        if(!fullName){
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
        if (! await bcrypt.compare(password, userPassword)) {
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
        const user = await User.find({
            where: {
                email
            }
        });

        return res.status(402).json({
            success: false,
            field: "password",
            message: "Incorrect credentials"
        });
    }
}

export default AuthController;
