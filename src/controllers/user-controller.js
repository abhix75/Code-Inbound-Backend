const { StatusCodes }= require('http-status-codes');

const { UserService} = require('../services/index');

const { SuccessResponse, ErrorResponse } = require('../utils/common');




async function signup(req,res)
{
     try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse)
    } catch (error)
     {
        ErrorResponse.error=error;
        return res
                 .status(error.statusCodes)
                 .json(ErrorResponse)
     }
 }



 module.exports={
    signup,
  
 }