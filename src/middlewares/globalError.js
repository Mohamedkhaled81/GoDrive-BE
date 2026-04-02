const devErr = (error, res) => {
    res.status(error.statusCode).json(
        {
            error: {
                message: error.message,
                status: error.statusCode,
                stackTrace: error.stack,
                error: error
            }
        }
    );
}

const prodErr = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json(
            {
                error: {
                    message: error.message,
                    status: error.statusCode
                }
            }
        );
    } else {
        res.status(500).json(
            {
                error: {
                    message: 'Something Went Wrong!',
                    status: 500
                }
            }
        );
    }
}


export default function (error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    if (process.env.Node_ENV === 'development') {
        devErr(error, res);
    } else {
        prodErr(error, res);
    }
}