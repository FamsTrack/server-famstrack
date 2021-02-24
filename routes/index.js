const router = require('express').Router();
const isLogin = require('../middlewares/isLogin')
const authRouter = require('./auth')
const clientRouter = require('./client')
const familyRouter = require('./family')
const groupRouter = require('./group')
const newsRouter = require('./news')
const scheduleRouter = require('./schedule')
const deviceRouter = require('./device')
const deviceController = require('../controllers/deviceController');

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'happy code, welcome to famtrack api!'
  })
})
router.get('/devices/:arduinoUniqueKey/key', deviceController.patchDevice);
router.use(authRouter)
router.use(isLogin)
router.use('/devices', deviceRouter)
router.use('/news', newsRouter)
router.use('/clients', clientRouter)
router.use('/families', familyRouter)
router.use('/groups', groupRouter)
router.use('/groups', scheduleRouter)

module.exports = router