
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'firststeptovalidation@gmail.com',
        pass: 'high5@idk',
    },
});

const mailData = {
    from: 'firststeptovalidation@gmail.com',
    to: 'chotupurwar@gmail.com',
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