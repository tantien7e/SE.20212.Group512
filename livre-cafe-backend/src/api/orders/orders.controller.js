const Orders = require('../../models/orders/orders.model');
const Customers = require('../../models/customers/customers.model');
const Books = require('../../models/books/books.model');
const Drinks = require('../../models/drinks/drinks.model');
const Staffs = require('../../models/staffs/staffs.model');
const { genDate } = require('../../lib/utils');

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find({})
            .populate('itemsOrdered.product')
            .populate('customer');

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const createOrder = async (req, res, next) => {
    try {
        if (req.body.status !== 'processing') {
            return res.status(403).json({ message: "Order status must be processing" });
        }

        //let totalCost = 0;
        const insufficientItems = [];
        const pendingProducts = [];
        for (let item of req.body.itemsOrdered) {
            let model = null;
            switch (item.productType) {
                case 'books':
                    model = Books;
                    break;

                case 'drinks':
                    model = Drinks;
                    break;
            }

            const product = await model.findById(item.product);
            if (product.stock < item.quantity) {
                insufficientItems.push(product);
            } else {
                //totalCost += product.price * item.quantity;
                product.stock -= item.quantity;
                pendingProducts.push(product);
            }
        }

        if (insufficientItems.length > 0) {
            let message = 'Out of stock:';

            for (let item of insufficientItems) {
                message += ` ${item.name ? item.name : item.title} - ${item.stock} left,`;
            }

            message = message.substring(0, message.length - 1) + '.';
            return res.status(400).json({
                message: message
            });
        } else {
            const promiseToAwait = [];
            for (let product of pendingProducts) {
                promiseToAwait.push(product.save());
            }

            await Promise.all(promiseToAwait);
        }

        const order = await Orders.create({
            ...req.body,
            //totalCost: totalCost
        });

        const staff = Staffs.findById(req.user._id);
        console.log(staff);

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
        const oldOrder = await Orders.findById(req.params.orderId);

        if (!oldOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (oldOrder.status === 'completed' || oldOrder.status === 'cancelled') {
            return res.status(403).json({ message: "Can not make changes to completed or cancelled order" });
        }


        if (req.body.status === 'processing') {
            const insufficientItems = [];
            const pendingProducts = [];
            //let totalCost = 0;
            if (req.body.itemsOrdered) {
                for (let item of req.body.itemsOrdered) {
                    let model = null;
                    switch (item.productType) {
                        case 'books':
                            model = Books;
                            break;

                        case 'drinks':
                            model = Drinks;
                            break;
                    }

                    const product = await model.findById(item.product);
                    const oldItemIndex = oldOrder.itemsOrdered.map(oldItem => oldItem.product.toString()).indexOf(item.product);
                    if (oldItemIndex === -1) {
                        if (product.stock < item.quantity) {
                            insufficientItems.push(product);
                        } else {
                            //totalCost += product.price * item.quantity;
                            product.stock -= item.quantity;
                            pendingProducts.push(product);
                        }
                    } else {
                        if (product.stock + oldOrder.itemsOrdered[oldItemIndex].quantity < item.quantity) {
                            insufficientItems.push(product);
                        } else {
                            product.stock -= item.quantity - oldOrder.itemsOrdered[oldItemIndex].quantity;
                            //totalCost += item.quantity * product.price;
                            pendingProducts.push(product);
                        }
                    }
                }

                if (insufficientItems.length > 0) {
                    let message = 'Out of stock:';

                    for (let item of insufficientItems) {
                        message += ` ${item.name ? item.name : item.title} - ${item.stock} left,`;
                    }

                    message = message.substring(0, message.length - 1) + '.';
                    return res.status(400).json({
                        message: message
                    });
                } else {
                    const promiseToAwait = [];

                    for (let product of pendingProducts) {
                        promiseToAwait.push(product.save());
                    }

                    await Promise.all(promiseToAwait);
                }
            }
        }



        const order = await Orders.findByIdAndUpdate(req.params.orderId, {
            $set: req.body,
            //totalCost: totalCost
        }, {
            new: true
        })
            .populate('itemsOrdered.product')
            .populate('customer');

        order.itemsOrdered = order.itemsOrdered.filter(item => item.quantity > 0);
        await order.save();

        if (order) {
            if (order.status === 'cancelled') {
                const promiseToAwait2 = [];
                for (let item of order.itemsOrdered) {
                    let model = null;
                    switch (item.productType) {
                        case 'books':
                            model = Books;
                            break;

                        case 'drinks':
                            model = Drinks;
                            break;
                    }

                    const product = await model.findById(item.product);
                    product.stock += item.quantity;
                    promiseToAwait2.push(product.save());
                }

                await Promise.all(promiseToAwait2);
            }

            if (order.customer && (order.status === 'completed' || order.status === 'cancelled')) {
                const customer = await Customers.findById(order.customer);
                customer.order = null;

                if (order.status === 'completed') {
                    customer.exchangeablePoints += Math.floor(order.totalCost);
                    customer.rankingPoints += Math.floor(order.totalCost);
                    if (customer.rankingPoints < 100) {
                        customer.ranking = 'silver';
                    } else if (customer.rankingPoints < 500) {
                        customer.ranking = 'gold';
                    } else if (customer.rankingPoints < 1000) {
                        customer.ranking = 'platinum';
                    } else {
                        customer.ranking = 'diamond';
                    }
                }
                customer.ordersHistory.push(order);
                await customer.save();

                const staff = await Staffs.findById(req.user._id);
                const todayDate = genDate();
                const todayOrdersHandled = staff.ordersHandled.get(todayDate);
                if (todayOrdersHandled) {
                    todayOrdersHandled.push(order._id);
                } else {
                    staff.ordersHandled.set(todayDate, [order._id]);
                }
                await staff.save();
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
        const order = await Orders.findById(req.params.orderId).populate('customer').populate('itemsOrdered.product');
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        next(err);
    }
}

const getOrdersHistory = async (req, res, next) => {
    try {
        const ordersHistory = await Orders.find({ status: { $in: ['cancelled', 'completed'] } })
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