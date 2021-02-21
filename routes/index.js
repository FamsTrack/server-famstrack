const router = require('express').Router();
const isLogin = require('../middlewares/isLogin')
const authRouter = require('./auth')
const clientRouter = require('./client')
const familyRouter = require('./family')
const groupRouter = require('./group')
const newsRouter = require('./news')
const scheduleRouter = require('./schedule')
const deviceRouter = require('./device')

router.use(authRouter)
router.use(isLogin)
router.use('/devices', deviceRouter)
router.use('/news', newsRouter)
router.use('/clients', clientRouter)
router.use('/families', familyRouter)
router.use('/groups', groupRouter)
router.use('/groups', scheduleRouter)

module.exports = router