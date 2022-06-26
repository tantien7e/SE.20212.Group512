const Orders = require('../../models/orders/orders.model');
const Customers = require('../../models/customers/customers.model');

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find({status: "processing"})
                            .populate('itemsOrdered.product')
                            .populate('customer');

        console.log(orders.length);                    
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const createOrder = async (req, res, next) => {
    try {
        const order = await Orders.create({
            ...req.body
        });

        if (order.customer) {
            const customer = await Customers.findById(order.customer);
            customer.order = order._id;
            await customer.save();
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Orders.findByIdAndDelete(req.params.orderId).populate('itemsOrdered.product').populate('customer');
        if (order) {
            if (order.customer) {
                const customer = await Customers.findById(order.customer);
                customer.order = null;
                await customer.save();
            }
            res.status(200).json(order);
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
        })
        .populate('itemsOrdered.product')
        .populate('customer');

        if (order) {
            if (order.customer && order.status === 'completed') {
                const customer = await Customers.findById(order.customer);
                customer.order = null;
                customer.ordersHistory.push(order);
                await customer.save();
            }

            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        next(err);
    }
}

const getOrder = async (req, res, next) => {
    try {
        const order = await Orders.findById(req.params.orderId).populate('itemsOrdered.product').populate('customer');
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found"});
        }   
    } catch (err) {
        next(err);
    }
}

const getOrdersHistory = async (req, res, next) => {
    try {
        const ordersHistory = await Orders.find({ status: "completed" })
                                        .populate('itemsOrdered.product')
                                        .populate('customer');

        res.status(200).json(ordersHistory);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllOrders,
    editOrder,
    deleteOrder,
    createOrder,
    getOrder,
    getOrdersHistory
}