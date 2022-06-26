const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.VALIDATION_EMAIL,
        pass: process.env.VALIDATION_EMAIL_PASSWORD,
    },
});

const mailData = {
    from: process.env.VALIDATION_EMAIL,
    to: process.env.TO_EMAIL,
    subject: 'Account Verification'
}

module.exports.sendEmailVerificationLink = function (user, verificationToken, req, callback) {
    console.log(user,"mail")
    let bodycontent = `Hi ${user.username}, Please verify your Seekers Account <br> <br>`;
    bodycontent += `Verification URL <br>  ${req.headers.host}/verify?user=${user._id}&token=${verificationToken}`;

    mailData.to = user.email;
    mailData.html = bodycontent;

    transporter.sendMail(mailData, function (error, info) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log('Email sent: ' + info.response);
            callback(200);
        }
    });
}