const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");
const{UserService}= require('../services')
function ValidateAuthRequest(req,res,next)
{
    if(!req.body.email)
    {
        ErrorResponse.message = 'Something went wrong while Authenticating user';
        ErrorResponse.error = new AppError('email  Not Found In the incomin request',StatusCodes.NOT_FOUND)
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    if(!req.body.password)
    {
        ErrorResponse.message = 'Something went wrong while Authenticating user';
        ErrorResponse.error = new AppError('password  Not Found In the incomin request',StatusCodes.NOT_FOUND)
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req,res,next){
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){
            req.user=response;
            next();
        }
    } catch (error) {
        return res
                .status(error.statusCodes)
                .json(error);
    }
}




module.exports={
    ValidateAuthRequest,
    checkAuth
}