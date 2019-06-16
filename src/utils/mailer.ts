import nodemailer from 'nodemailer';
import transporter from "../../config/email";
import sgTransport from 'nodemailer-sendgrid-transport';
import sgMail from '@sendgrid/mail';

let sender = transporter;
sgMail.setApiKey(process.env.SENDGRID_KEY);

function sendEmail(options, callback) {
    sender.sendMail(options, function (info) {
        if(callback) callback(info);
    });
    /*.then(() => {
        'Success! Your password has been changed.';
    })
        .catch((err) => {
            console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
            req.flash('warning', {msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.'});
            return err;
        })
*/

}

export default sendEmail;

var options = {
    service: 'SendGrid',
    auth: {
        api_user: process.env.SENDGRID_USER,
        api_key: process.env.SENDGRID_KEY,
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
    }
};

export const mail = function (mail) {
    const client = nodemailer.createTransport(sgTransport(options));
    client.sendMail(mail, function(err, info){
        if (err ){
            console.log(err);
        }
        else {
            console.log(info);
            console.log('Message sent: ' + info.response);
        }
    });
};
