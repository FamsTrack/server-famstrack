const router = require('express').Router();
const authRouter = require('./auth')
const clientRouter = require('./client')
const familyRouter = require('./family')
const groupRouter = require('./group')
const isLoginAdmin = require('../middlewares/isLoginAdmin')


router.use(authRouter)
router.use(isLoginAdmin)
router.use('/clients', clientRouter)
router.use('/families', familyRouter)
router.use('/groups', groupRouter)

module.exports = router