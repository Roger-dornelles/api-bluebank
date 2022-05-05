const Bank = require('../models/Bank');

module.exports = {
    // exibir bancos
    banks: async (req,res) => {

        try{
            let bank = await Bank.findAll();
            if(bank) {
                for(let i in bank) {

                    res.status(201);
                    res.json( bank[i] );
                }
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