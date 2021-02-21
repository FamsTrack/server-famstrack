const router = require('express').Router();
const isAdmin = require('../middlewares/isAdmin');
const ScheduleController = require('../controllers/scheduleController');

router.get('/:id/schedule', ScheduleController.getAll)

router.post('/:id/schedule', isAdmin, ScheduleController.add)
router.put('/:id/schedule/:schId', isAdmin, ScheduleController.update)
router.delete('/:id/schedule/:schId', isAdmin, ScheduleController.delete)

module.exports = router