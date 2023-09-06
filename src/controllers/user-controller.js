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

 async function signin(req,res)
 {
      try {
         const user = await UserService.signin({
             email: req.body.email,
             password: req.body.password
         });
         SuccessResponse.data = user;
         return res
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)
     } catch (error)
      {  console.log(error);
         ErrorResponse.error=error;
         return res
                  .status(error.statusCodes)
                  .json(ErrorResponse)
      }
  }
  async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getUsers(req,res)
{
    try {
        const airplane = await UserService.getUsers();
        SuccessResponse.data=airplane;
        return res 
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
                 
    } catch (error) {
        ErrorResponse.error=error;
        return res 
                 .status(error.statusCodes)
                 .json(ErrorResponse)
    }
}

async function getUser(req,res)
{
    try {
        const airplane = await UserService.getUser(req.params.id);
        SuccessResponse.data=airplane;
        return res 
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
                 
    } catch (error) {
        ErrorResponse.error=error;
        return res 
                 .status(error.statusCodes)
                 .json(ErrorResponse)
    }
}

async function destroyUser(req,res)
{
    try {
        const response = await UserService.destroyUser(req.params.id);
        SuccessResponse.data=response;
        return res 
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
                 
    } catch (error) {
        ErrorResponse.error=error;
        return res 
                 .status(error.statusCodes)
                 .json(ErrorResponse)
    }
}





 module.exports={
    signup,
    signin,
    addRoleToUser,
    getUsers,
    getUser,
    destroyUser
 }