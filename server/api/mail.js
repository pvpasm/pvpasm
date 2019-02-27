const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URL;
const refreshToken = process.env.REFRESH_TOKEN;

async function sendResetEmail(recipient, new_pass, cb) {
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "weesoong.lim@gmail.com",
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: "weesoong.lim@gmail.com",
        to: recipient.email,
        subject: "[pvpasm] Password reset",
        text: `Hi ${recipient.username},\n\nYou have requested a password reset for pvpasm. Your new password is ${new_pass}.`
    };

    smtpTransport.sendMail(mailOptions, (err, res) => {
        cb(err);
        smtpTransport.close();
    });
}

module.exports = { sendResetEmail };
