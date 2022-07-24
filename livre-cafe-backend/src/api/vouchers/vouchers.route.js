const express = require('express');
const isManager = require('../../middleware/authorize');
const VouchersController = require('./vouchers.controller');
const VouchersRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Voucher:
 *          type: object
 *          required:
 *              - correspondingRank
 *              - pointCost
 *              - name
 *              - percentageDiscount
 *              - maxAmount
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              name:
 *                  type: string
 *                  description: the voucher name
 *              correspondingRank:
 *                  type: string
 *                  enum: [silver, gold, platinum, diamond]
 *                  description: corresponding rank of the voucher
 *              pointCost:
 *                  type: number
 *                  description: the point cost for the voucher
 *              percentageDiscount:
 *                  type: number
 *                  description: the percentage discount when apply the voucher
 *              maxAmount:
 *                  type: number
 *                  description: maximum amount discount
 *              available:
 *                  type: boolean
 */

/**
 * @swagger
 * tags:
 *  name: Vouchers
 *  description: Vouchers API
 */

 /**
  * @swagger
  * /vouchers:
  *  get:
  *      summary: Returns the list of all vouchers
  *      tags: [Vouchers]
  *  post:
  *      summary: Add new voucher
  *      tags: [Vouchers]
  */
 
 
 /**
  * @swagger
  * /vouchers/{id}:
  *  get:
  *      summary: Get the voucher by id
  *      tags: [Vouchers]
  *  put:
  *      summary: Update the voucher
  *      tags: [Vouchers]
  *  delete:
  *      summary: Remove the voucher
  *      tags: [Vouchers]
  */

VouchersRouter.route('/')
.get(VouchersController.getVouchers)
.post(isManager, VouchersController.addVoucher);

VouchersRouter.route('/:voucherId')
.get(VouchersController.getVoucher)
.put(isManager, VouchersController.editVoucher)
.delete(isManager, VouchersController.deleteVoucher);

module.exports = VouchersRouter;