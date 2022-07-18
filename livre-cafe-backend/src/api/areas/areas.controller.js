const Areas = require('../../models/areas/areas.model');
const { checkEqualDays } = require('../../lib/utils');

const getAllAreas = async (req, res, next) => {
    const areas = await Areas.find({}).populate('reservations');
    if (req.query !== {}) {
        areas.forEach(area => {
            area.reservations = area.reservations.filter(reservation => checkEqualDays(reservation.startTime, new Date(req.query.date)));
        });
        
    }
    res.status(200).json(areas);
}

const getArea = async (req, res, next) => {
    const area = await Areas.findById(req.params.areaId).populate('reservations');
    if (area !== null) {
        if (req.query !== {}) {
            area.reservations = area.reservations.filter(reservation => checkEqualDays(reservation.startTime, new Date(req.query.date)));
        }

        res.status(200).json(area);
    } else {
        res.status(404).json({ message: "Area not found." });
    }
}

const deleteArea = async (req, res, next) => {
    const area = await Areas.findByIdAndDelete(req.params.areaId);

    if (area) {
        res.status(200).json({ message: "Delete successfully" });
    } else {
        res.status(404).json({ message: "Area not found." });
    }
}

const addArea = async (req, res, next) => {
    const area = await Areas.create(req.body);

    res.status(200).json(area);
}

const editArea = async (req, res, next) => {
    const area = await Areas.findByIdAndUpdate(req.params.areaId, {
        $set: req.body
    }, {
        new: true
    });

    res.status(200).json(area);
}

module.exports = {
    getAllAreas,
    editArea,
    addArea,
    deleteArea,
    getArea
}