const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  private: async(req,res,next) => {
    let success= false;

    if(req.headers.authorization){
      const [ authType, token ] = req.headers.authorization.split(' ');
      if(authType === 'Bearer'){
        try{
          JWT.verify(
            token,
            process.env.JWT_SECRET_KEY
          );
          success = true;
        }catch(error){
          res.status(401);
          res.json({error:'Não Autorizado'});
        }
      }
    }

    if(success){
      next()
    }else{
      res.status(401);
      res.json({error:'Não Autorizado'});
    }
  }
}