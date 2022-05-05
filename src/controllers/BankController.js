const Bank = require('../models/Bank');

module.exports = {
    // exibir bancos
    banks: async (req,res) => {

        try{
            let bank = await Bank.find();
            if(bank) {
                res.status(201);
                res.json({ bank });
            }else{
                res.status(201);
                res.json({ error:'Não há bancos cadastrados' });
            };
        }catch(error) {
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde.'});
        }
    }
}