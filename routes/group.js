const router = require('express').Router();
const groupController = require('../controllers/groupController');
const isLoginAdmin = require('../middlewares/isLogin')
const isAdmin = require('../middlewares/isAdmin')

router.get('/', isAdmin, groupController.getAll)
router.post('/', isAdmin, groupController.add)
router.get('/:id', isAdmin, groupController.getId)
router.put('/:id', isAdmin, groupController.update)
router.delete('/:id', isAdmin, groupController.delete)

module.exports = router