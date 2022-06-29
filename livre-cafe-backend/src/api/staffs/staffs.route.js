const Router = require('express').Router;
const StaffsRouter = Router();
const isManager = require('../../auth/authorize');
const StaffsController = require('./staffs.controller');
const passport = require('passport');


/**
 * @swagger
 * components:
 *  schemas:
 *      Staff:
 *          type: object
 *          required:
 *              - username
 *              - hash
 *              - salt
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              username:
 *                  type: string
 *                  description: the unique username
 *              hash:
 *                  type: string
 *                  description: the hashed password
 *              salt:
 *                  type: string
 *                  description: the random string created for password hashing
 *              isManager:
 *                  type: boolean
 *                  default: false
 *                  description: true if this account is manager's account
 */

/**
 * @swagger
 * tags:
 *  name: Staffs
 *  description: Staffs API
 */

/**
 * @swagger
 * /staffs:
 *  post:
 *      summary: Manager create new staff account
 *      tags: [Staffs]
 */

StaffsRouter.route('/')
.post(passport.authenticate('jwt', { session: false }), isManager, StaffsController.createNewStaff);

/**
 * @swagger
 * /staffs/login:
 *  post:
 *      summary: Login in with username and password
 *      tags: [Staffs]
 */

StaffsRouter.post('/login', StaffsController.login);

/**
 * @swagger
 * /staffs/{id}:
 *  delete:
 *      summary: Manager delete staff account
 *      tags: [Staffs]
 */


StaffsRouter.route('/:staffId')
.delete(passport.authenticate('jwt', { session: false }), isManager, StaffsController.deleteStaff);

module.exports = StaffsRouter;