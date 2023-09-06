const {StatusCodes}=require("http-status-codes")
const { UserRepository} = require('../repositories');
const AppError = require('../utils/error/app-error');
const {Auth}=require('../utils/common');

const userRepository = new UserRepository();



async function create(data)
{
    try {
        const user = await userRepository.create(data);
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
module.exports={
    create,
    signin
}