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
 * /auth/signup:
 *  post:
 *      summary: Sign up with username and password
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  _id:
 *                      type: string
 *                      description: the id of staff's profile document created by the Manager
 *      tags: [Auth]
 */

AuthRouter.post('/signup', async (req, res, next) => {
    try {
        const staff = await Staffs.findOne({ username: req.body.username });

        if (staff) {
            res.status(401).json({
                success: false,
                message: "Username already exists."
            });
        } else {
            const { hash, salt } = utils.genHashAndSalt(req.body.password);
            const newStaff = await Staffs.findByIdAndUpdate(req.body._id, {
                username: req.body.username,
                hash: hash,
                salt: salt,
                phone: req.body.phone,
                accountActivated: true                
            });

            res.status(200).json({
                success: true,
                staff: newStaff
            });
        }

    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/verify-token:
 *  get:
 *      summary: Verify the JWT
 *      tags: [Auth]
 */

AuthRouter.get('/verify-token', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    res.status(200).json({
        message: "valid token"
    });
}); 

/**
 * @swagger
 * /auth/verify-phone-number:
 *  post:
 *      summary: Verify the staff's phone number
 *      tags: [Auth]
 */

AuthRouter.post('/verify-phone-number', async (req, res, next) => {
    try {
        const staff = await Staffs.findOne({phone: req.body.phone});
        if (staff) {
            if (staff.accountActivated) {
                res.status(401).json({
                    message: "Account associated with this phone number already exists."
                });
            } else {
                res.status(200).json(staff);
            }
        } else {
            res.status(404).json({
                message: "Wrong phone number or your profile have not been registered by the manager yet."
            });
        }        
    } catch (err) {
        next(err);
    }
});

module.exports = AuthRouter;