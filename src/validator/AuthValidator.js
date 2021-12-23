const { checkSchema } = require('express-validator');

// validação de dados de cadastro.
module.exports = {
  signup:checkSchema({
    name:{
      trim:true,
      isLength:{
        options:{min:2}
      },
      errorMessage:'Nome precisa ter 2 caracteres ou mais'
    },
    email:{
      isEmail:true,
      normalizeEmail:true,
      errorMessage:'E-mail invalido...'
    },
    password:{
      isLength:{
        options:{min:6}
      },
      errorMessage:'Senha precisa ter 6 caracteres ou mais....'
    },
    cpf:{
      isLength:{
        options:{min:11,max:15}
      },
      errorMessage:'Cpf invalido....'
    }
  })
}