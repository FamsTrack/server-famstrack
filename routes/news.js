const router = require('express').Router();
const isAdmin = require('../middlewares/isAdmin');
const NewsController = require('../controllers/newsController');

router.get('/', NewsController.getAll)
router.get('/:id', NewsController.getId)
router.post('/', isAdmin, NewsController.add)
router.put('/:id', isAdmin, NewsController.update)
router.delete('/:id', isAdmin, NewsController.delete)

module.exports = router