const Task = require('../model/Task')
const auth = require('../middleware/jwtTokenValidation')

//add task
exports.addTask = async (req, res) => {
    const { title, description, dueDate, taskId, completed } = req.body;

    //save new task
    if (!taskId) {
        console.log("Start.........Create")
        try {
            let addNewTask = new Task({
                description,
                dueDate,
                userId: req.user.id, //get user id from url
            });
            await addNewTask.save();
            res.status(201).json(addNewTask);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Something went to wrong..!');
        }
    } else {
        //update task
        try {
            let task = await Task.findById(taskId);
            console.log(taskId);
            console.log("Start.........update")
            if (!task)
                return res.status(404)
                    .json({ msg: 'Task Id not found' });

            // Ensure user owns task
            console.log("Start.........2")
            console.log(task.userId.toString())
            console.log(req.user.id)
            if (task.userId.toString() !== req.user.id) {
                console.log("Start.........3")
                return res.status(401)
                    .json({ msg: 'Not authorized' });
            }

            task = await Task.findByIdAndUpdate(taskId, { description, dueDate, completed }, { new: true });
            console.log("end.........2")
            res.status(200).json(task);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Something went to wrong..!');
        }

    }
}

// Filter tasks
exports.filterTask = async (req, res) => {
    console.log("Start.........2")
    // const {status}  = req.body;
    const status  = req.query.status;
    // 0 = false, 1 = true
    console.log(status)
    try {
        console.log("Start.........2")
        let tasks;
        if (status == 'Complete') {
            console.log("Start.........2")
            tasks = await Task.find({userId: req.user.id, completed: false });
        } else if (status == 'Incomplete') {
            tasks = await Task.find({ userId: req.user.id,completed: true });
        } else if (status == 'All') {
            getAllTasks();
        } else {
            return res.status(400).send('Invalid status value');
        }

        console.log(tasks);
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Something went wrong...!');
    }
};


//get all task
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id ,completed: false  }).sort({ dueDate: -1 });

        const currentDate = new Date().toISOString().split('T')[0];

        // Group tasks into overdue and upcoming
        const groupedTasks = tasks.reduce((grouped, task) => {
            const dueDate = task.dueDate.toISOString().split('T')[0];

            if (dueDate < currentDate) {
                if (!grouped.overdue) {
                    grouped.overdue = [];
                }
                grouped.overdue.push(task);
            } else {
                if (!grouped.upcoming) {
                    grouped.upcoming = [];
                }
                grouped.upcoming.push(task);
            }

            return grouped;
        }, { overdue: [], upcoming: [] });

        res.json(groupedTasks);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


//delete  task
exports.deleteTask = async (req, res) => {
    console.log(auth.userId)
    console.log("Start.....")
    try {
        console.log("Start....1.")
        const task = await Task.findById(req.params.id);
        console.log("Start....2.")
        if (!task)
            return res.status(404)
                .json({ msg: 'Task not found' });

        // Ensure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401)
                .json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200)
            .json({ msg: 'Task successfully removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Something went to wrong..!');
    }
};