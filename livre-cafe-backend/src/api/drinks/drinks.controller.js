const Drinks = require('../../models/drinks/drinks.model');

const getAllDrinks = async (req, res) => {
    const drinks = await Drinks.find({});
    res.status(200).json(drinks);
}

const getDrink = async (req, res) => {
    const drink = await Drinks.findById(req.params.drinkId);
    if (drink) {
        res.status(200).json(drink);
    } else {
        res.status(404).json({ message: "Drink not found" });
    }
}

const deleteDrink = async (req, res) => {
    const drink = await Drinks.findByIdAndDelete(req.params.drinkId);
    if (drink) {
        res.status(200).json({ message: "Delete successfully" });
    } else {
        res.status(404).json({ message: "Drink not found"});
    }
}

const editDrink = async (req, res) => {
    const drink = await Drinks.findByIdAndUpdate(req.params.drinkId, {
        $set: req.body
    }, {
        new: true
    });
    if (drink) {
        res.status(200).json({ message: "Update successfully"});
    } else {
        res.status(404).json({ message: "Drink not found"});
    }
}

const addDrink = async (req, res) => {
    const drink = await Drinks.create(req.body);
    res.status(200).json(drink);
}

module.exports = {
    getAllDrinks,
    getDrink,
    deleteDrink,
    editDrink,
    addDrink
}