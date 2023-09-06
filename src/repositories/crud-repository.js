const { StatusCodes } = require("http-status-codes");
const { Logger } = require('../config');
const AppError = require('../utils/error/app-error');
class CrudRepository{
    constructor(model)
    {
        this.model=model;
    }
async create(data)
{
        const response= await this.model.create(data);
        return response;
}
async destroy(data)
{ console.log(data);
        const response= await this.model.destroy({
           
            where:{
                id:data
            }
            
        }
        );
        if(!response){
            throw new AppError("Not able to find the Resourse",StatusCodes.NOT_FOUND)
        }
        return response;
}
async get(data)
{
        const response= await this.model.findByPk(data);

        if(!response){
            throw new AppError("Not able to find the Resourse",StatusCodes.NOT_FOUND)
        }
        return response;
}
async getAll(data)
{
        const response= await this.model.findAll();
        return response;
}
async update(data)
{
        const response= await this.model.update(data,{
            where:{
                id:id
            }
        });
        return response;
}
}
module.exports=CrudRepository;