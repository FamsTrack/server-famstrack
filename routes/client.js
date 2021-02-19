const router = require('express').Router();
const clientController = require('../controllers/clientController');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', clientController.getAll);
router.get('/:id', clientController.get);
router.post('/', isAdmin, clientController.store);
router.put('/:id', isAdmin, clientController.update);
router.delete('/:id', isAdmin, clientController.destroy);

module.exports = router