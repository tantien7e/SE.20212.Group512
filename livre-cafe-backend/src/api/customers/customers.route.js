const express = require('express');

const CustomerController = require('./customers.controller');

/**
 * @swagger
 * components:
 *  schemas:
 *      Customer:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - phone
 *              - point
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              name:
 *                  type: string
 *                  description: the customer's name
 *              email:
 *                  type: string
 *                  description: the customer's email
 *              phone:
 *                  type: number
 *                  description: the customer's phone number
 *              point:
 *                  type: number
 *                  description: the bonus point
 *              order:
 *                  type: string
 *                  description: the id of the processing order placed by the customer
 *              ordersHistory:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: the id of completed orders placed by the customer
 */

/**
 * @swagger
 * tags:
 *  name: Customer
 *  description: Customer API
 */


const CustomerRouter = express.Router();

/**
 * @swagger
 * /Customer:
 *  get:
 *      summary: Returns the list of all Customers
 *      tags: [Customer]
 *  post:
 *      summary: Add new customer
 *      tags: [Customer]
 */

CustomerRouter.route('/')
.get(CustomerController.getAllCustomers)
.post(CustomerController.createCustomer);

/**
 * @swagger
 * /Customer/{id}:
 *  get:
 *      summary: Get the customer by id
 *      tags: [Customer]
 *  put:
 *      summary: Update the customer
 *      tags: [Customer]
 *  delete:
 *      summary: Remove the customer
 *      tags: [Customer]
 */


CustomerRouter.route('/:customerId')
.get(CustomerController.getCustomer)
.put(CustomerController.editCustomer)
.delete(CustomerController.deleteCustomer);

module.exports = CustomerRouter;
