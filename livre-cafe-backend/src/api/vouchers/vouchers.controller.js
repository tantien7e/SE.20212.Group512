const Vouchers = require('../../models/vouchers/vouchers.model');

const getVouchers = async (req, res, next) => {
    const vouchers = await Vouchers.find({});

    res.status(200).json(vouchers);
}

const addVoucher = async (req, res, next) => {
    try {
        const voucher = await Vouchers.findOne({ name: req.body.name});

        if (voucher) {
            res.status(403).json({ message: "Duplicate name." });
        } else {
            const newVoucher = await Vouchers.create(req.body);
            res.status(200).json(newVoucher);
        }
    } catch (err) {
        next(err);
    }
}

const editVoucher = async (req, res, next) => {
    try {
        const voucher = await Vouchers.findByIdAndUpdate(req.params.voucherId, {
            $set: req.body
        }, {
            new: true
        });

        if (voucher) {
            res.status(200).json(voucher);
        } else {
            res.status(404).json({ message: "Voucher not found." });
        }
    } catch (err) {
        next(err);
    }
}

const deleteVoucher = async (req, res, next) => {
    const voucher = await Vouchers.findByIdAndDelete(req.params.voucherId);
    if (voucher) {
        res.status(200).json({ message: "Delete successfully "});
    } else {
        res.status(404).json({ message: "Voucher not found" });
    }
}

const getVoucher = async (req, res, next) => {
    const voucher = await Vouchers.findById(req.params.voucherId);

    if (voucher) {
        res.status(200).json(voucher);
    } else {
        res.status(404).json({ message: "Voucher not found" });
    }
}

module.exports = {
    getVoucher,
    getVouchers,
    addVoucher,
    deleteVoucher,
    editVoucher
}