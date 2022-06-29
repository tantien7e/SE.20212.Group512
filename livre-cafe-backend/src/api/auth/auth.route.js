const passport = require('passport');
const AuthRouter = require('express').Router();
const Staffs = require('../../models/staffs/staffs.model');
const utils = require('../../lib/utils');

/**
 * @swagger
 * tags:
 *  name: Auth
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login in with username and password
 *      tags: [Auth]
 */

AuthRouter.post('/login', async (req, res, next) => {
    try {
        const staff = await Staffs.findOne({ username: req.body.username });
        if (staff) {
            const validPassword = utils.validatePassword(req.body.password, staff.hash, staff.salt);
            if (validPassword) {
                const tokenObject = utils.issueJWT(staff);

                res.status(200).json({
                    success: true,
                    token: tokenObject.token,
                    expiresIn: tokenObject.expires,
                    staff: staff
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Wrong password!"
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/verify:
 *  get:
 *      summary: Verify the JWT
 *      tags: [Auth]
 */

AuthRouter.get('/verify', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    res.status(200).json({
        message: "valid token"
    });
}); 

module.exports = AuthRouter;