require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { CLIENT_GOOGLE_ID, GOOGLE_SECRET } = process.env;

const client = new OAuth2Client(CLIENT_GOOGLE_ID, GOOGLE_SECRET);


const googleVerify = async (req, res,next) => {
    try {
        const idToken = req.body.credential;
        console.log('body credential', req.body.credential)

        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_GOOGLE_ID,
        });

        const payload = ticket.getPayload();

        console.log('cookie token',req.cookies.g_csrf_token)
        console.log('body token', req.body.g_csrf_token)

        if (req.cookies.g_csrf_token !== req.body.g_csrf_token) {
            return res.status(400).send('Invalid CSRF token');
        }
        if (!payload) {
            return res.status(400).send('Invalid ID token');
        }
        userrData = { name: payload.given_name, lastName: payload.family_name, email:payload.email }
        next();

    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    googleVerify
}
