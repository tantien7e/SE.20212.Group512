const Snacks = require('../../models/snacks/snacks.model');

const getAllSnacks = async (req, res) => {
    const snacks = await Snacks.find({});
    res.status(200).json(snacks);
}

const getSnack = async (req, res) => {
    const snack = await Snacks.findById(req.params.snackId);
    if (snack) {
        res.status(200).json(snack);
    } else {
        res.status(404).json({ message: "Snack not found" });
    }
}

const deleteSnack = async (req, res) => {
    const snack = await Snacks.findByIdAndDelete(req.params.snackId);
    if (snack) {
        res.status(200).json({ message: "Delete successfully" });
    } else {
        res.status(404).json({ message: "Snack not found"});
    }
}

const editSnack = async (req, res) => {
    const snack = await Snacks.findByIdAndUpdate(req.params.snackId, {
        $set: req.body
    }, {
        new: true
    });
    if (snack) {
        res.status(200).json({ message: "Update successfully"});
    } else {
        res.status(404).json({ message: "Snack not found"});
    }
}

const addSnack = async (req, res) => {
    const snack = await Snacks.create(req.body);
    res.status(200).json(snack);
}

module.exports = {
    getAllSnacks,
    getSnack,
    deleteSnack,
    editSnack,
    addSnack
}