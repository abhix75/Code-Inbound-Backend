const {StatusCodes}=require("http-status-codes")
const { UserRepository} = require('../repositories');
const AppError = require('../utils/error/app-error');

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

module.exports={
    create
}