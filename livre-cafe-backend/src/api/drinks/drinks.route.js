const express = require('express');

const DrinksController = require('./drinks.controller');
const isManager = require('../../middleware/authorize');

/**
 * @swagger
 * components:
 *  schemas:
 *      Drink:
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
 *                  description: the drink name
 *              imageUrl:
 *                  type: string
 *                  description: the url link to drink image
 *              stock:
 *                  type: number
 *                  description: the number of drinks in stock
 *              price:
 *                  type: number
 *                  description: the drink price
 */

/**
 * @swagger
 * tags:
 *  name: Drinks
 *  description: Drinks API
 */

const DrinksRouter = express.Router();

/**
 * @swagger
 * /drinks:
 *  get:
 *      summary: Returns the list of all drinks
 *      tags: [Drinks]
 *  post:
 *      summary: Add new drink
 *      tags: [Drinks]
 */

DrinksRouter.route('/')
.get(DrinksController.getAllDrinks)
.post(isManager, DrinksController.addDrink);

/**
 * @swagger
 * /drinks/{id}:
 *  get:
 *      summary: Get the drink by id
 *      tags: [Drinks]
 *  put:
 *      summary: Update the drink
 *      tags: [Drinks]
 *  delete:
 *      summary: Remove the drink
 *      tags: [Drinks]
 */

DrinksRouter.route('/:drinkId')
.get(DrinksController.getDrink)
.put(isManager, DrinksController.editDrink)
.delete(isManager, DrinksController.deleteDrink);

module.exports = DrinksRouter;