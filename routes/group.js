const router = require('express').Router();
const groupController = require('../controllers/groupController');
const isLoginAdmin = require('../middlewares/isLoginAdmin')

router.post('/', groupController.add)
router.get('/', groupController.getAll)

module.exports = router