const express = require('express');

const {UserController}=require('../../controllers');
const { AuthRequestMiddleWares } = require('../../middlewares');

const router = express.Router();

          router.post('/signup',
                          AuthRequestMiddleWares.ValidateAuthRequest,
                          UserController.signup)
          router.post('/signin',
                          AuthRequestMiddleWares.ValidateAuthRequest,
                          UserController.signin)

           
          router.post('/role',
                          AuthRequestMiddleWares.checkAuth, 
                          AuthRequestMiddleWares.isAdmin, 
                          UserController.addRoleToUser);   

          router.get('/',UserController.getUsers);

          router.get('/:id',UserController.getUser);

          router.delete('/:id',UserController.destroyUser);

          router.put('/:id',UserController.updateUser)

module.exports =router; 