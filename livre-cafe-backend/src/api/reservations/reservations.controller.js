const Reservations = require('../../models/reservations/reservations.model');
const Areas = require('../../models/areas/areas.model');
const Customers = require('../../models/customers/customers.model');
const Staffs = require('../../models/staffs/staffs.model');
const { checkTimeConflict } = require('../../lib/utils');

const getReservations = async (req, res, next) => {
    const reservations = await Reservations.find({}).populate('area').populate('customer')
        .populate('itemsOrdered.product');

    res.status(200).json(reservations);
}

const makeReservation = async (req, res, next) => {
    try {
        const area = await Areas.findById(req.body.area).populate('reservations');

        for (let reservation of area.reservations) {
            if (checkTimeConflict(reservation.start, reservation.end, req.body.start, req.body.end)) {
                return res.status(403).json({ message: "Time conflict." });
            }
        }

        const reservation = await Reservations.create(req.body);
        area.reservations.push(reservation._id);
        await area.save();
        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
}

const editReservation = async (req, res, next) => {
    try {
        const area = await Areas.findById(req.body.area).populate('reservations');

        //test
        for (let reservation of area.reservations) {
            if (checkTimeConflict(reservation.start, reservation.end, req.body.start, req.body.end)) {
                return res.status(403).json({ message: "Time conflict." });
            }
        }

        //test: old area and new area
        const oldReservation = Reservations.findById(req.params.reservationId);
        if (oldReservation.area.toString() !== req.body.area) {
            console.log(1);
            const oldArea = Areas.findById(oldReservation.area);
            oldArea.reservations = oldArea.reservations.filter(element => element.toString() !== req.params.reservationId);
            area.reservations.push(req.params.reservationId);
            await oldArea.save();
            await area.save();
        }

        const reservation = Reservations.findByIdAndUpdate(req.params.reservationId, {
            $set: req.body
        }, {
            new: true
        });

        if (reservation) {
            //test: area, staff, customer
            if (reservation.status === 'checked out') {
                area.reservations = area.reservations.filter(element => element.toString() !== req.params.reservationId);
                area.status = 'free';
                const staff = Staffs.findById(req.user._id);
                staff.reservationsHandled.push(req.body._id);
                await Promise.all(area.save(), staff.save());

                const customer = Customers.findById(req.body.customer);
                if (customer) {
                    customer.reservationsHistory.push(req.body._id);
                    await customer.save();
                }
            }

            //test: area
            if (reservation.status === 'checked in') {
                area.status = 'occupied';
                await area.save();
            }
            
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: "Reservation not found." });
        }

    } catch (err) {
        next(err);
    }
}

const deleteReservation = async (req, res, next) => {
    const reservation = await Reservations.findByIdAndDelete(req.params.reservationId);

    if (reservation) {
        res.status(200).json({ message: "Delete successfully." });
    } else {
        res.status(404).json({ message: "Reservation not found." });
    }
}

const getReservation = async (req, res, next) => {
    const reservation = await Reservations.findById(req.params.reservationId);

    if (reservation) {
        res.status(200).json(reservation);
    } else {
        res.status(404).json({ message: "Reservation not found." });
    }
}

module.exports = {
    getReservation,
    getReservations,
    editReservation,
    deleteReservation,
    makeReservation
}