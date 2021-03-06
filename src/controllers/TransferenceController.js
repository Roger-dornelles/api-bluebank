// models
const Transference = require('../models/Transference');
const User = require('../models/User');
const CurrentAccount = require('../models/CurrentAccount');

// Helpers
// formatação de valores
const ValueFormated = require('../helpers/ValueFormated');


// Remask ( formatação )
const { mask } = require('remask');
const res = require('express/lib/response');

module.exports = {
    // fazer transferencia
    transferValue: async (req,res)=>{
        let { id } = req.params;
        let { value, account, bank, type_destiny_account, agency, favored_name, document } = req.body;

        try {
            let user = await User.findOne({where:{id}});
            if(user){

                let data = {};
                if(value && account && bank && type_destiny_account && agency && favored_name && document){

                    if(account){
                        let newFormatAccount = account.replace('-','');

                        if( newFormatAccount.length === 5){
                            data.account = mask(newFormatAccount,['9999-9']);

                        }else if( newFormatAccount.length === 7){
                            data.account = mask(newFormatAccount,['999999-9']);

                        }else if( newFormatAccount.length === 8){
                            data.account = mask(newFormatAccount,['999999-9']);

                        }else if( newFormatAccount.length === 9){
                            data.account = mask(newFormatAccount,['99999999-9']);

                        }else if(newFormatAccount.length === 12){
                            data.account = mask(newFormatAccount,['99999999999-9']);
                        };

                    }else{
                        res.status(200);
                        res.json({error:'Conta Invalida.'});
                    };

                    if(bank){
                        data.bank = bank;
                    };

                    if(agency){
                        let newFomatAgency = agency.replace('-','');

                        if(newFomatAgency.length === 3){
                            data.agency = mask(newFomatAgency, ['999']);

                        }else if(newFomatAgency.length === 4){
                            data.agency = mask(newFomatAgency,['9999']);

                        }else if(newFomatAgency.length === 5){
                            data.agency = mask(newFomatAgency, ['9999-9']);
                        };
                        
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

                    if(value){
                        let newValue = value.replace('.','').replace(',','');
                        let formatValue = ValueFormated(newValue.toString());
                        data.value = formatValue;
                    };

                    // verificar se existe conta corrente / remover caracteres dos valores
                    let userAccount = await CurrentAccount.findOne({where:{iduser:user.id}});
                    let valueAccount = parseInt(userAccount.initialvalue.replace('.','').replace(',',''));
                    let newValueFormated = parseInt(data.value.replace('.','').replace(',',''));

                    //verificar se saldo em conta é maior que valor de transferencia/ salvar transferencia
                    if(newValueFormated <= valueAccount){
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
                        let newAccountValue = (valueAccount - newValueFormated ).toString();
                        userAccount.initialvalue = ValueFormated(newAccountValue.toString());
                        await userAccount.save();
                        res.status(201);
                        res.json('Tranferencia realizada...');
                    }else{
                        res.status(200);
                        res.json({error: 'Saldo Insuficiente.'});
                    }

                }else{
                    res.status(200);
                    res.json({error:'Preencha todos os campos.'});
                };

            }else{
                res.status(200);
                res.json({error:'Usuario não encontrado...'});
            }
        }catch(error) {
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde.'});
        };
    },
    // exibir tranferencias
    viewTransfers: async (req,res)=>{

        let { id } = req.params;
        try{
            let user = await User.findOne({where: {id}});

            if(user){
                let transfers = await Transference.findAll({where:{iduser:user.id}});
                if(transfers){
                    res.status(201);
                    res.json({transfers});
                }else{
                    res.status(201);
                    res.json({error:'Não há transferencias.'});
                }

            }else{
                res.status(200);
                res.json({error:'Usuario não encontrado...'});
            }

        }catch(error){
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde.'});
        }
    }
}