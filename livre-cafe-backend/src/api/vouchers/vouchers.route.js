const express = require('express');
const isManager = require('../../middleware/authorize');
const VouchersController = require('./vouchers.controller');
const VouchersRouter = express.Router();

VouchersRouter.route('/')
.get(VouchersController.getVouchers)
.post(isManager, VouchersController.addVoucher);

VouchersRouter.route('/:voucherId')
.get(VouchersController.getVoucher)
.put(isManager, VouchersController.editVoucher)
.delete(isManager, VouchersController.deleteVoucher);

module.exports = VouchersRouter;