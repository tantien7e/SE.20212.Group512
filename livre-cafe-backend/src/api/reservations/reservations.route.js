const express = require('express');
const ReservationsRouter = express.Router();
const ReservationsController = require('./reservations.controller');

/**
 * @swagger
 * components:
 *  schemas:
 *      Reservation:
 *          type: object
 *          required:
 *              - startTime
 *              - duration
 *              - reservation
 *              - numberOfPeople
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              startTime:
 *                  type: date
 *                  description: the reservation's start time (iso8601)
 *              duration:
 *                  type: number
 *                  description: the reservation's duration
 *              area:
 *                  type: string
 *                  description: id of the area reserved
 *              status:
 *                  type: string
 *                  enum: [pending, confirmed, seated, completeted, cancelled]
 *                  default: pending
 *                  description: the reservation's status
 *              numberOfPeople:
 *                  type: number
 *                  description: number of people
 *              order:
 *                  type: string
 *                  description: the corresponding order's id
 */

/**
 * @swagger
 * tags:
 *  name: Reservations
 *  description: Reservations API
 */

/**
 * @swagger
 * /reservations:
 *  get:
 *      summary: Returns the list of all reservations
 *      tags: [Reservations]
 */

/**
 * @swagger
 * /reservations/{id}:
 *  get:
 *      summary: Get the reservation by id
 *      tags: [Reservations]
 *  put:
 *      summary: Update the reservation
 *      tags: [Reservations]
 *  delete:
 *      summary: Remove the reservation
 *      tags: [Reservations]
 */

ReservationsRouter.route('/')
.get(ReservationsController.getAllReservations)

ReservationsRouter.route('/:reservationId')
.get(ReservationsController.getReservation)
.put(ReservationsController.editReservation)
.delete(ReservationsController.deleteReservation);

module.exports = ReservationsRouter;
