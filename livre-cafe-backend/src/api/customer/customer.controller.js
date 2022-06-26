const Customer = require('../../models/Customer/Customer.model');

const getAllCustomers = async (req, res, next) => {
    try {
        const Customer = await Customer.find({})
                            .populate('items.product');
        res.status(200).json(Customer);
    } catch (err) {
        next(err);
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find({})
                            .populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const createCustomer = async (req, res, next) => {
    try {
        await Customer.create(req.body);
        res.status(200).json({ message: "Successfully added" });
    } catch (err) {
        next(err);
    }
}

const deleteCustomer = async (req, res, next) => {
    try {
        const Customer = await Customer.findByIdAndDelete(req.params.CustomerId);
        if (Customer) {
            res.status(200).json({ message: "Successsfully removed" });
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        next(err);
    }
}

const editCustomer = async (req, res, next) => {
    try {
        const Customer = await Customer.findByIdAndUpdate(req.params.CustomerId, {
            $set: req.body
        }, {
            new: true
        });

        if (Customer) {
            res.status(200).json({ message: "Successfully updated "});
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        next(err);
    }
}

const getCustomer = async (req, res, next) => {
    try {
        const Customer = await Customer.findById(req.params.CustomerId).populate('items.product');
        if (Customer) {
            res.status(200).json(Customer);
        } else {
            res.status(404).json({ message: "Customer not found "});
        }   
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllCustomers,
	getAllOrders,
    editCustomer,
    deleteCustomer,
    createCustomer,
    getCustomer
}