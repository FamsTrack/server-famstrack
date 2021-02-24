const router = require('express').Router();
const deviceController = require('../controllers/deviceController');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', deviceController.getAll);
router.get('/:id', deviceController.get);
router.post('/', isAdmin, deviceController.store);
router.put('/:id', isAdmin, deviceController.update);
router.delete('/:id', isAdmin, deviceController.destroy);

module.exports = router