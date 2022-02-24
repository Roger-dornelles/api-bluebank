// models
const Donation = require('../models/Donation');
const CurrentAccount = require('../models/CurrentAccount');
const User = require('../models/User');

// helpers
// formatação de valores
const PriceFormated = require('../helpers/PriceFormated');
const ValueFormated = require('../helpers/ValueFormated');

module.exports = {
    donation: async(req,res) => {
        let { id } = req.params;

        try {
            let { value, destination } = req.body;
            let user = await User.findOne({where:{id}});
            if(user){
                if(value && destination){
                    
                    let currentAccount = await CurrentAccount.findOne({where:{iduser:user.id}});
                    if(currentAccount){
                        
                        if(value){
                            value = value.replace('.','').replace(',','');
                            value = ValueFormated(value.toString());
                        };

                        // criar doação
                        let newValueAccount = parseInt(currentAccount.initialvalue.replace('.','').replace(',',''));
                        let newValue = parseInt(value.replace('.','').replace(',',''));
                        if(newValueAccount >= newValue){
                            
                            await Donation.create({
                                iduser: user.id,
                                value,
                                destination
                            });

                            // descontar do saldo em conta corrente valor da doação
                            let newAccountValue = (newValueAccount - newValue);
                            newAccountValue = ValueFormated(newAccountValue.toString());
                            currentAccount.initialvalue = newAccountValue;
                            await currentAccount.save();

                            res.status(201);
                            res.json('Doação realizada...');
                        }else{
                            res.status(200);
                            res.json({error:'Saldo Insuficiente.'});
                        }
                    }

                    res.json('ok');
                }else{
                    res.status(200);
                    res.json({error:'Preencha todos os campos'});
                }
            }else{
                res.status(200);
                res.json({error:"Usuario não encontrado"});
            }
        }catch(error){
            console.log('ERROR => ',error)
            res.status(404);
            res.json({ error:'Ocorreu um erro tente mais tarde...'})

        }
    }
}