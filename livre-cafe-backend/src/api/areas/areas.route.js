const express = require('express');
const AreasRouter = express.Router();
const AreasController = require('./areas.controller');
const isManager = require('../../middleware/authorize');


/**
 * @swagger
 * components:
 *  schemas:
 *      Area:
 *          type: object
 *          required:
 *              - x
 *              - y
 *              - costPerHour
 *              - status
 *              - capacity
 *              - available
 *              - reservations
 *              - name
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              name:
 *                  type: string
 *                  description: the area's name
 *              x:
 *                  type: number                  
 *              y:
 *                  type: string
 *              costPerHour:
 *                  type: number
 *                  description: cost per hour
 *              status:
 *                  type: string
 *                  enum: [free, occupied]
 *                  default: free
 *                  description: the area's status
 *              available:
 *                  type: boolean
 *                  description: true if area is available for reservation
 *              reservations: 
 *                  type: array
 *                  items:
 *                       type: string
 *                       description: id of the reservation
 *              capacity:
 *                  type: number
 *                  description: capacity
 */

/**
 * @swagger
 * tags:
 *  name: Areas
 *  description: Areas API
 */

/**
 * @swagger
 * /areas:
 *  get:
 *      summary: Returns the list of all areas
 *      tags: [Areas]
 *  post:
 *      summary: Add new area
 *      tags: [Areas]
 */

/**
 * @swagger
 * /areas/{id}:
 *  get:
 *      summary: Get the area by id
 *      tags: [Areas]
 *  put:
 *      summary: Update the area
 *      tags: [Areas]
 *  delete:
 *      summary: Remove the area
 *      tags: [Areas]
 */


AreasRouter.route('/')
.get(AreasController.getAllAreas)
.post(isManager, AreasController.addArea);


AreasRouter.route('/:areaId')
.get(AreasController.getArea)
.put(isManager, AreasController.editArea)
.delete(isManager, AreasController.deleteArea);

module.exports = AreasRouter;