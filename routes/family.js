const router = require('express').Router();
const familyController = require('../controllers/familyController');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', familyController.getAll);
router.get('/:id', familyController.get);
router.post('/', isAdmin, familyController.store);
router.put('/:id', isAdmin, familyController.update);
router.delete('/:id', isAdmin, familyController.destroy);

module.exports = router