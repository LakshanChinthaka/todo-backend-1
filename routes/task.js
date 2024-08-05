const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/jwtTokenValidation');

//add new task
router.post('/',auth,taskController.addTask);

//get all tasks
router.get('/', auth, taskController.getAllTasks);

//Filter a task
router.get('/filter', auth, taskController.filterTask);


// delete a task
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;