const database = require('../database/connect');

class UserController{
    
    getUsers(request, response){
        database.select("*").table("USUARIO").then(Users=>{
            console.log(Users);
            response.json(Users);                    
        }).catch(error=>{
            console.log(error);
            response.send(error)
        })
    }
}

module.exports = new UserController()