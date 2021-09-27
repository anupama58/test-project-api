const express = require('express');
const userController = require('../controllers/user.controller');
//const checkAuthMiddleWare = require('../middleware/authentication');
const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
// router.get('/',checkAuthMiddleWare.checkAuth,userController.index);
// router.get('/:id/edit',checkAuthMiddleWare.checkAuth,userController.edit);
// router.patch('/:id/update',checkAuthMiddleWare.checkAuth,userController.update);
router.get('/',userController.index);
router.get('/:id/edit',userController.edit);
router.patch('/:id/update',userController.update);
module.exports = router;