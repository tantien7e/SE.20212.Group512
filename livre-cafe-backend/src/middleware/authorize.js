const isManager = (req, res, next) => {
    if (req.user.isManager) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "Only manager can have access to this route."
        });
    }
}

module.exports = isManager;