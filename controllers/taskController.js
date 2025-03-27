const Task = require('../models/task');

const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
};

const createTask = async (req, res) => {
    const { title, description, category, deadline } = req.body;
    const task = await Task.create({ user: req.user.id, title, description, category, deadline });
    res.status(201).json(task);
};

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.category = req.body.category || task.category;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });

    await task.remove();
    res.json({ message: 'Task removed' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
