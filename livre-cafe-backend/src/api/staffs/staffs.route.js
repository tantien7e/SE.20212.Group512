const Router = require('express').Router;
const StaffsRouter = Router();
const StaffsController = require('./staffs.controller');


/**
 * @swagger
 * components:
 *  schemas:
 *      Staff:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - phone
 *              - imageUrl
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              username:
 *                  type: string
 *                  description: the unique username
 *              firstName:
 *                  type: string
 *                  description: the staff's first name
 *              lastName:
 *                  type: string
 *                  description: the staff's last name
 *              phone:
 *                  type: string
 *                  description: the staff's phone number
 *              imageUrl:
 *                  type: string
 *                  description: the staff's photo
 *              ordersHandled: 
 *                  type: map
 *                  description: the list of orders grouped by date have been handled by the staff 
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
 *              accountActivated:
 *                  type: boolean
 *                  default: false
 *                  description: true if the staff has signed up with username and password
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
 *  get:
 *      summary: Return the list of all staffs
 *      tags: [Staffs]
 *  post:
 *      summary: Manager create new staff's profile
 *      tags: [Staffs]
 */

StaffsRouter.route('/')
.get(StaffsController.getAllStaffs)
.post(StaffsController.createNewStaff);

/**
 * @swagger
 * /staffs/{id}:
 *  get:
 *      summary: Get the staff's profile by id
 *      tags: [Staffs]
 *  put: 
 *      summary: Manager updates staff's profile
 *      tags: [Staffs]
 *  delete:
 *      summary: Manager deletes staff's profile
 *      tags: [Staffs]
 */


StaffsRouter.route('/:staffId')
.get(StaffsController.getStaff)
.put(StaffsController.editStaff)
.delete(StaffsController.deleteStaff);

module.exports = StaffsRouter;