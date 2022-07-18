const express = require('express');
const AreasRouter = express.Router();
const AreasController = require('./areas.controller');
const isManager = require('../../middleware/authorize');


AreasRouter.route('/')
.get(AreasController.getAllAreas)
.post(isManager, AreasController.addArea);


AreasRouter.route('/:areaId')
.get(AreasController.getArea)
.put(isManager, AreasController.editArea)
.delete(isManager, AreasController.deleteArea);

module.exports = AreasRouter;