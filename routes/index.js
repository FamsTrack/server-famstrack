const router = require('express').Router();
const authRouter = require('./auth')
const groupRouter = require('./group')

router.use(authRouter)
router.use('/groups', groupRouter)

module.exports = router