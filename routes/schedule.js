const router = require('express').Router();
const isLoginAdmin = require('../middlewares/isLoginAdmin')
const isLoginFamily = require('../middlewares/isLoginFamily')
const isAdmin = require('../middlewares/isAdmin');
const ScheduleController = require('../controllers/scheduleController');

router.get('/:id/schedule/', ScheduleController.getAll)

router.post('/:id/schedule/', isLoginAdmin, isAdmin, ScheduleController.add)
router.put('/:id/schedule/:schId', isLoginAdmin, isAdmin, ScheduleController.update)
router.delete('/:id/schedule/:schId', isLoginAdmin, isAdmin, ScheduleController.delete)

module.exports = router