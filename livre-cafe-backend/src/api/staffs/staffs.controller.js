const Staffs = require('../../models/staffs/staffs.model');

const createNewStaff = async (req, res, next) => {
    try {
        const staff = await Staffs.findOne({ phone: req.body.phone });

        if (staff) {
            res.status(401).json({
                success: false,
                message: "Staff's profile with this phone number already exists"
            });
        } else {           
            const newStaff = await Staffs.create({
                phone: req.body.phone,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isManager: req.body.isManager ? req.body.isManager : false,
                imageUrl: req.body.imageUrl
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

const getAllStaffs = async (req, res, next) => {
    try {
        const staffs = await Staffs.find({}).populate({
            path: 'ordersHandled',
            populate: {
                path: 'itemsOrdered.product',
                path: 'customer'
            }
        });
        res.status(200).json(staffs);
    } catch (err) {
        next(err);
    }
    
}

const getStaff = async (req, res, next) => {
    try {
        const staff = await Staffs.findById(req.params.staffId).populate({
            path: 'ordersHandled',
            populate: {
                path: 'itemsOrdered.product'
            }
        });
        if (staff) {
            res.status(200).json(staff);
        } else {
            res.staff(404).json({
                message: "Staff not found."
            });
        }
    } catch (err) {
        next(err);
    }
}

const editStaff = async (req, res, next) => {
    try {
        const staff = await Staffs.findByIdAndUpdate(req.params.staffId, {
            $set: req.body
        },
        {
            new: true
        });

        if (staff) {
            res.status(200).json(staff);
        } else {
            res.status(404).json({
                message: "Staff not found."
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

module.exports = {
    createNewStaff,
    deleteStaff,
    editStaff,
    getAllStaffs,
    getStaff
}