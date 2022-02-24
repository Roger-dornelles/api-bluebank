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

                    if(account.length === 9){
                        data.account = mask(account,['99999999-9']);
                    }else{
                        res.status(200);
                        res.json({error:'Conta Invalida.'});
                    };

                    if(bank){
                        data.bank = bank;
                    };

                    if(agency.length === 5){
                        data.agency = mask(agency, ['9999-9']);
                    }else if(agency.length === 4){
                        data.agency = mask(agency,['0999-9']);
                    }else if(agency.length === 3){
                        data.agency = mask(agency,['0099-9']);
                    }else if(agency.length === 2){
                        data.agency = mask(agency,['0009-9']);
                    }else if(agency.length === 1){
                        data.agency = mask(agency,['0000-9']);
                    }else{
                        res.status(200);
                        res.json({error:'Agencia Invalida.'});
                    };

                    if(favored_name){
                        data.favored_name = favored_name;
                    };

                    if(document.length === 11){
                        data.document = mask(document,['999.999.999-99']);
                    }else if(document.length === 14){
                        data.document = mask(document,['99.999.999/9999-99']);
                    }else{
                        res.status(200);res.json({error:'Digitos Invalidos'});
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
            res.json({error:"Ocorreu um erro tente novamente mais tarde..."});
        };
    }
}