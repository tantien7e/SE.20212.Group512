const Staffs = require('../../models/staffs/staffs.model');
const utils = require('../../lib/utils');

const createNewStaff = async (req, res, next) => {
    try {
        const staff = await Staffs.findOne({ username: req.body.username });

        if (staff) {
            res.status(401).json({
                success: false,
                message: "Username already exists"
            });
        } else {
            const { hash, salt } = utils.genHashAndSalt(req.body.password);
            const newStaff = await Staffs.create({
                username: req.body.username,
                hash: hash,
                salt: salt,
                isManager: req.body.isManager ? req.body.isManager : false
            });

            res.status(200).json({
                success: true,
                staff: newStaff
            });
        }

    } catch (err) {
        next(err);
    }
}

const deleteStaff = async (req, res, next) => {
    const staff = await Staffs.findByIdAndDelete(req.params.staffId);
    if (staff) {
        res.status(200).json({ message: "Successfully deleted" }); 
    } else {
        res.status(404).json({ message: "Staff not found" });
    }
}

const editStaff = async (req, res, next) => {

}

module.exports = {
    createNewStaff,
    deleteStaff,
    editStaff
}