const JwtVerification = require('express').Router();
const passport = require('passport');

JwtVerification.get('/verify', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({
        message: "valid token"
    });
});

module.exports = JwtVerification;