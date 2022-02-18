// models
const Transference = require('../models/Transference');
const User = require('../models/User');

// Remask
const { mask } = require('remask');
const pattern = ['999.999.999-99','99.999.999/9999-99'];

module.exports = {
    // fazer transferencia
    transferValue: async (req,res)=>{
        let { id } = req.params;

        try {
            let user = await User.findOne({where:{id}});
            if(user){
                let { value, account, bank, type_destiny_account, agency, favored_name, document} = req.body;

                if(value && account && bank && type_destiny_account && agency && favored_name && document){

                }else{
                    res.status(200);
                    res.json({error:'Preencha todos os campos...'})
                }

            }else{
                res.status(200);
                res.json({error:'Usuario não encontrado...'})
            }
        }catch(error) {
            console.error(error);
            res.status(404);
            res.json({error:"Ocorreu um erro tente novamente mais tarde..."});
        }
    }
}