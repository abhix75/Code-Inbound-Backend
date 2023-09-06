const {StatusCodes}=require("http-status-codes")
const { UserRepository,RoleRepository} = require('../repositories');
const AppError = require('../utils/error/app-error');
const {Auth,Enums}=require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();


async function create(data)
{
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLE_ENUMS.CUSTOMER);
        console.log(user);
        console.log(role);
        user.addRole(role);
        return user;

    } catch (error) {
          console.log(error);
        if(error.name == 'SequelizeValidationError'|| error.name == 'SequelizeUniqueConstraintError')
        {
            let explanation =[];
            console.log(error);
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        
        throw new AppError("cannot create new user object",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No User Found For This EMAIL',StatusCodes.NOT_FOUND);
        }
        const passwordMatch=Auth.checkPassword(data.password,user.password);
        console.log("Password Match",passwordMatch);
        if(!passwordMatch){
            throw new AppError("INVALID PASSWORD",StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({id:user.id,email:user.email});
        return jwt;
    } catch (error) {
          if(error instanceof AppError) throw error;
          console.log(error);
          throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);

    }
}
async function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError('Missing GWT token',StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError('No user Found',StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name=='JsonWebTokenError'){
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function addRoletoUser(data) {
    try {
        const user = await userRepository.get(data.id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getRoleByName(data.role);
        if(!role) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepository.getRoleByName(Enums.USER_ROLE_ENUMS.ADMIN);
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log("Enum",error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUsers()
{
    try {
        const user = await userRepository.getAll();
        return user;
    } catch (error) {
       throw new AppError("Not Able to get All the Airplane objects",StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}

async function getUser(id)
{
    try {
        const user = await userRepository.get(id);
        return user;
    } catch (error) {
        if(error.statusCodes==StatusCodes.NOT_FOUND)
        {
            throw new AppError("THE AEROPLANE YTHAT YOU HAVE REQUESTED IS NOT PRESENT",error.statusCodes)
        }
       throw new AppError("Not Able to get  the Airplane objects",StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}
async function destroyUser(id)
{
    try {
        const response = await userRepository.destroy(id);
        return response;
    } catch (error) {
        console.log("destroy",error)
        if(error.statusCodes==StatusCodes.NOT_FOUND)
        {
            throw new AppError("THE user THAT YOU HAVE REQUESTED To DElete IS NOT PRESENT",error.statusCodes)
        }
       throw new AppError("Not Able to get  the delete objects",StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}
async function getUpdate(id, data) {
    try {
        console.log("service data -- ",id, data);
      const user = await userRepository.update(id, data);
       console.log("user Service ",user)
      if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }
  
      return user;
    } catch (error) {
      console.log("service error",error);
      throw new AppError(
        "Error retrieving user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }



module.exports={
    create,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin,
    getUsers,
    getUser,
    destroyUser,
    getUpdate
}