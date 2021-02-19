const router = require('express').Router();
const authRouter = require('./auth')
const clientRouter = require('./client')
const isLoginAdmin = require('../middlewares/isLoginAdmin')


router.use(authRouter)
router.use(isLoginAdmin)
router.use('/clients', clientRouter)


module.exports = router