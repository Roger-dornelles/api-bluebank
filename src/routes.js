const express = require('express');
const router = express.Router();

const UserController = require('./controllers/UserController');

//validator
const AuthValidator = require('./validator/AuthValidator');
// middleware
const Auth = require('./middlewares/Auth');

// usuarios
//login usuario
router.post('/signin', UserController.signin);
//cadastro usuario
router.post('/signup',AuthValidator.signup,UserController.signup);
// atualizar dados usuarios
router.put('/user/:id',Auth.private,UserController.updateUser);
// exibir dados do usuarios
router.get('/user/info/:id',Auth.private,UserController.infoUser);
// excluir usuario
router.delete('/user/delete/:id',Auth.private,UserController.deleteUser);

module.exports = router;