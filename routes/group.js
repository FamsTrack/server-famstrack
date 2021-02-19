const router = require('express').Router();
const groupController = require('../controllers/groupController');
const isLoginAdmin = require('../middlewares/isLoginAdmin')
const isAdmin = require('../middlewares/isAdmin')

router.post('/', isAdmin, groupController.add)
router.get('/', isAdmin, groupController.getAll)
router.put('/:id', isAdmin, groupController.update)
router.delete('/:id', isAdmin, groupController.delete)

module.exports = router