import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
    }
});

export const config = {
    from: '"Fred Foo 👻" <foo@example.com>',
};

export default transporter;
