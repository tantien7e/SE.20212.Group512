const express = require('express');

const SnacksController = require('./snacks.controller');
const isManager = require('../../middleware/authorize');

/**
 * @swagger
 * components:
 *  schemas:
 *      Snack:
 *          type: object
 *          required:
 *              - name
 *              - imageUrl
 *              - stock
 *              - price
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              name:
 *                  type: string
 *                  description: the snack name
 *              imageUrl:
 *                  type: string
 *                  description: the url link to snack image
 *              stock:
 *                  type: number
 *                  description: the number of snacks in stock
 *              price:
 *                  type: number
 *                  description: the snack price
 */

/**
 * @swagger
 * tags:
 *  name: Snacks
 *  description: Snacks API
 */

const SnacksRouter = express.Router();

/**
 * @swagger
 * /snacks:
 *  get:
 *      summary: Returns the list of all snacks
 *      tags: [Snacks]
 *  post:
 *      summary: Add new snack
 *      tags: [Snacks]
 */

SnacksRouter.route('/')
.get(SnacksController.getAllSnacks)
.post(isManager, SnacksController.addSnack);

/**
 * @swagger
 * /snacks/{id}:
 *  get:
 *      summary: Get the snack by id
 *      tags: [Snacks]
 *  put:
 *      summary: Update the snack
 *      tags: [Snacks]
 *  delete:
 *      summary: Remove the snack
 *      tags: [Snacks]
 */

SnacksRouter.route('/:snackId')
.get(SnacksController.getSnack)
.put(isManager, SnacksController.editSnack)
.delete(isManager, SnacksController.deleteSnack);

module.exports = SnacksRouter;