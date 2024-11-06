export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Error del servidor";
    if (err.name === "SequelizeUniqueConstraintError") {
        statusCode = 400;
        message = `El valor del campo ${err.errors[0].path} ya existe.`;
    }
    if (err.name === "SequelizeValidationError") {
        statusCode = 400;
        message = err.errors.map(error => error.message).join(", ");
    }
    res.status(statusCode).json({
        status: "error",
        message: message,
        statusCode: statusCode,
        success: false
    });
};
