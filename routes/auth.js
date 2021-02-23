const router = require('express').Router();
const authController = require('../controllers/authController');
const isLogin = require('../middlewares/isLogin')
const isAdmin = require('../middlewares/isAdmin')

router.post('/login', authController.login);
router.post('/weblogin', authController.loginWeb)
router.post('/register', authController.register);

router.use(isLogin)
router.get('/user', isAdmin, authController.getAll)
router.delete('/user/:id', isAdmin, authController.delete)

module.exports = router