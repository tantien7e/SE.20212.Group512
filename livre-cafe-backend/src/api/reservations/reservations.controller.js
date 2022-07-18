const Reservations = require('../../models/reservations/reservations.model');
const Areas = require('../../models/areas/areas.model');
const { checkTimeConflict, hoursToMilliseconds } = require('../../lib/utils');

const getAllReservations = async (req, res, next) => {
    const reservations = await Reservations.find({}).populate('area')
        .populate({
            path: 'order',
            populate: [{
                path: 'itemsOrdered.product'
            },
            {
                path: 'customer'
            }]
        });

    res.status(200).json(reservations);
}

const editReservation = async (req, res, next) => {
    const reservation = await Reservations.findById(req.params.reservationId);
    const area = await Areas.findById(reservation.area).populate('reservations');

    switch (req.body.status) {
        case 'seated':
            area.status = 'occupied';
            break;
        case 'completed':
            area.status = 'free';
            await Areas.findByIdAndUpdate(reservation.area, { $pull: { reservations: reservation._id } });
            break;
        case 'cancelled':
            await Areas.findByIdAndUpdate(reservation.area, { $pull: { reservations: reservation._id } });
            break;
    }

    await area.save();
    for (let reservation of area.reservations) {
        if (checkTimeConflict(reservation.startTime.getTime(), reservation.startTime.getTime() + hoursToMilliseconds(reservation.duration, reservation.startTime.getTime(), reservation.startTime.getTime() + hoursToMilliseconds(reservation.duration)))) {
            return res.status(403).json({ message: "Time conflict." });
        }
    }

    const newReservation = await Reservations.findByIdAndUpdate(req.params.reservationId, {
        $set: req.body
    }, {
        new: true
    });

    if (newReservation !== null) {
        res.status(200).json(newReservation);
    } else {
        res.status(404).json({ message: "Reservation not found." });
    }
}

const getReservation = async (req, res, next) => {
    const reservation = await Reservations.findById(req.params.reservationId).populate({
        path: 'order',
        populate: [{
            path: 'itemsOrdered.product'
        },
        {
            path: 'customer'
        }]
    });

    console.log(reservation.startTime.getHours());

    if (reservation === null) {
        res.status(404).json({ message: "Reservation not found." });
    } else {
        res.status(200).json(reservation);
    }
}

const deleteReservation = async (req, res, next) => {
    await Reservations.findByIdAndDelete(req.params.reservationId);

    res.status(200).json({ message: "Delete successfully" });
}

module.exports = {
    getAllReservations,
    editReservation,
    deleteReservation,
    getReservation
}