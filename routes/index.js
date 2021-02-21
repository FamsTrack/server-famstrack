const router = require('express').Router();
const authRouter = require('./auth')
const clientRouter = require('./client')
const familyRouter = require('./family')
const groupRouter = require('./group')
const isLogin = require('../middlewares/isLogin')
const newsRouter = require('./news')
const scheduleRouter = require('./schedule')

router.use(authRouter)
router.use(isLogin)
router.use('/news', newsRouter)
router.use('/groups', scheduleRouter)

router.use('/clients', clientRouter)
router.use('/families', familyRouter)
router.use('/groups', groupRouter)

module.exports = router