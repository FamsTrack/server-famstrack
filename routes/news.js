const router = require('express').Router();
const isLoginAdmin = require('../middlewares/isLoginAdmin')
const isLoginFamily = require('../middlewares/isLoginFamily')
const isAdmin = require('../middlewares/isAdmin');
const NewsController = require('../controllers/newsController');

router.get('/', NewsController.getAll)
router.get('/:id', NewsController.getId)

router.post('/', isLoginAdmin, isAdmin, NewsController.add)
router.put('/:id', isLoginAdmin, isAdmin, NewsController.update)
router.delete('/:id', isLoginAdmin, isAdmin, NewsController.delete)

module.exports = router