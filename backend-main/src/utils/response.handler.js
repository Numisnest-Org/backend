//200 201 ...
export const successResponse = (res, statusCode, data, message) => {
    retur
export const invalidRequest = (res, statusCode, data, message) => {
    return res.status(statusCode).json({
        status: statusCode,
        message: `Invalid Request: ${message}`,
        data: data,
    });
};

//500 502 504 ...
export const serverError = (res, statusCode, data, message) => {
    return res.status(statusCode).json({
        status: statusCode,
        message: `Server Error: ${message}`,
        data: data,
    });
};
