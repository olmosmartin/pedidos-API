const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const fs = require('fs');

const sendEmail = async (email, subject, data, template) => {
    try{
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const source = fs.readFileSync(__dirname + '/../' + template, "utf8");
        const compiledTemplate = hbs.compile(source);
        const options = {
            from: 'pediloyasrl@gmail.com',
            to: email,
            subject: subject,
            html: compiledTemplate(data)
        };

        const info = await transporter.sendMail(options);
        console.log(info.response);
        return true;
    } catch(err){
        console.error(err);
        return false;
    }
}

module.exports = sendEmail;