const express = require('express');
const ReservationsRouter = express.Router();
const ReservationsController = require('./reservations.controller');

ReservationsRouter.route('/')
.get(ReservationsController.getAllReservations)

ReservationsRouter.route('/:reservationId')
.get(ReservationsController.getReservation)
.put(ReservationsController.editReservation)
.delete(ReservationsController.deleteReservation);

module.exports = ReservationsRouter;
