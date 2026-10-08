export const farmerOnly = (req, res, next) => {
    if (req.user?.role !== "farmer") {
        return res.status(403).json({
            success: false,
            message: "Farmer access required"
        });
    }

    next();
};

export const consumerOnly = (req, res, next) => {
    if (req.user?.role !== "consumer") {
        return res.status(403).json({
            success: false,
            message: "Consumer access required"
        });
    }

    next();
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    next();
};