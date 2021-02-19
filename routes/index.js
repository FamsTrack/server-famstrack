const router = require('express').Router();
const authRouter = require('./auth')

router.use(authRouter)

module.exports = router