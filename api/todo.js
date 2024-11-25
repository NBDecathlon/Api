const express = require('express');
const { isAdmin } = require('./middlewares/roleCheck');
const authJwt = require('./middlewares/authJwt');
const Todo = require('./models/todo');
const router = express.Router();

router.use(authJwt);

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching todos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching todo' });
    }
});

router.post('/', isAdmin, async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(500).send({ message: 'Error creating todo' });
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send({ message: 'Error updating todo' });
    }
});

module.exports = router;