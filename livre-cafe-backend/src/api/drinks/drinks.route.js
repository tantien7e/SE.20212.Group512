const express = require('express');

const DrinksController = require('./drinks.controller');

const DrinksRouter = express.Router();

DrinksRouter.route('/')
.get(DrinksController.getAllDrinks)
.post(DrinksController.addDrink);

DrinksRouter.route('/:drinkId')
.get(DrinksController.getDrink)
.put(DrinksController.editDrink)
.delete(DrinksController.deleteDrink);

module.exports = DrinksRouter;