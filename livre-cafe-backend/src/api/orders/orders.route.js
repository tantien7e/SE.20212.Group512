const express = require('express');
const OrdersController = require('./orders.controller');

const OrdersRouter = express.Router();

OrdersRouter.route('/')
.get(OrdersController.getAllOrders)
.post(OrdersController.createOrder);

OrdersRouter.route('/:orderId')
.get(OrdersController.getOrder)
.put(OrdersController.editOrder)
.delete(OrdersController.deleteOrder);

module.exports = OrdersRouter;
