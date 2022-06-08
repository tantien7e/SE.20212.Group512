const Orders = require('../../models/orders/orders.model');

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find({})
                            .populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const createOrder = async (req, res, next) => {
    try {
        await Orders.create(req.body);
        res.status(200).json({ message: "Successfully added" });
    } catch (err) {
        next(err);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Orders.findByIdAndDelete(req.params.orderId);
        if (order) {
            res.status(200).json({ message: "Successsfully removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        next(err);
    }
}

const editOrder = async (req, res, next) => {
    try {
        const order = await Orders.findByIdAndUpdate(req.params.orderId, {
            $set: req.body
        }, {
            new: true
        });

        if (order) {
            res.status(200).json({ message: "Successfully updated "});
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        next(err);
    }
}

const getOrder = async (req, res, next) => {
    try {
        const order = await Orders.findById(req.params.orderId).populate('items.product');
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found "});
        }   
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllOrders,
    editOrder,
    deleteOrder,
    createOrder,
    getOrder
}