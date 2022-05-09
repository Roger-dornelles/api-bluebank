// models
const Transference = require('../models/Transference');
const User = require('../models/User');
const CurrentAccount = require('../models/CurrentAccount');

// Helpers
// formatação de valores
const ValueFormated = require('../helpers/ValueFormated');


// Remask ( formatação )
const { mask } = require('remask');

module.exports = {
    // fazer transferencia
    transferValue: async (req,res)=>{
        let { id } = req.params;

        try {
            let user = await User.findOne({where:{id}});
            if(user){
                let { value, account, bank, type_destiny_account, agency, favored_name, document} = req.body;

                if(value && account && bank && type_destiny_account && agency && favored_name && document){
                    let data = {};

                    if(value !== ''){
                        value = value.replace('.','').replace(',','');
                        value = ValueFormated(value.toString());
                        data.value = value;
                    };

                    if(account){
                        switch(account){
                            case account.length === 6:
                                return data.account = mask(account,['9999-9']);
                            break;
                            case account.length === 8:
                                return data.account = mask(account,['999999-9']);
                            break;
                            case account.length === 9:
                                return data.account = mask(account,['9999999-9']);
                            break;
                            case account.length === 10:
                                return data.account = mask(account,['99999999-9']);
                            break;
                            case account.length === 13:
                                return data.account = mask(account,['99999999999-9']);
                            break;
                        }

                    }else{
                        res.status(200);
                        res.json({error:'Conta Invalida.'});
                    };

                    if(bank){
                        data.bank = bank;
                    };

                    if(agency){

                        switch(agency){
                            case agency.length === 3:
                                return data.agency = mask(agency, ['999']);
                            break;
                            case agency.length === 4:
                                return data.agency = mask(agency,['9999']);
                            break;
                            case account.length === 6:
                                return data.agency = mask(agency, ['9999-9']);
                            break;
                        }
                        
                    }else{
                        res.status(200);
                        res.json({error:'Agencia Invalida.'});
                    };

                    if(favored_name){
                        data.favored_name = favored_name;
                    };

                    if(document){
                        document = document.replace('.','').replace('-','');
                        data.document = mask(document,['999.999.999-99']);
                    }else{
                        res.status(200);
                        res.json({error:'Digitos Invalidos'});
                    };

                    if(type_destiny_account === 'poupança'){
                        data.type_destiny_account = type_destiny_account;
                    }else if(type_destiny_account === 'corrente'){
                        data.type_destiny_account = type_destiny_account;
                    }else{
                        res.status(200);
                        res.json({error:'Tipo de conta invalido...'});
                    };
                    // verificar se existe conta corrente / remover caracteres dos valores
                    let userAccount = await CurrentAccount.findOne({where:{iduser:user.id}});
                    let valueAccount = parseInt(userAccount.initialvalue.replace('.','').replace(',',''));
                    value = parseInt(value.replace('.','').replace(',',''));
                    //verificar se saldo em conta é maior que valor de transferencia/ salvar transferencia
                    if(value <= valueAccount){
                        await Transference.create({
                            iduser:user.id,
                            value: data.value, 
                            account: data.account, 
                            bank: data.bank, 
                            type_destiny_account: data.type_destiny_account, 
                            agency: data.agency, 
                            favored_name:data.favored_name, 
                            document: data.document
                        });
                        // salvar novo valor em conta corrente
                        let newAccountValue = (valueAccount - value).toString();
                        userAccount.initialvalue = ValueFormated(newAccountValue.toString());
                        await userAccount.save();
                        res.status(201);
                        res.json('Tranferencia realizada...');
                    }else{
                        res.status(200);
                        res.json({error:'Saldo Insuficiente...'});
                    }

                }else{
                    res.status(200);
                    res.json({error:'Preencha todos os campos...'});
                };

            }else{
                res.status(200);
                res.json({error:'Usuario não encontrado...'});
            }
        }catch(error) {
            res.status(404);
            res.json({error});
        };
    }
}