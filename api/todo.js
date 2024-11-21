
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isUser } = require('./middlewares/authJwt');

let todos = [
    { id: 1, title: 'First todo', description: 'This is the first todo' },
    { id: 2, title: 'Second todo', description: 'This is the second todo' },
];

router.get('/', verifyToken, (req, res) => {
    res.json(todos);
});

router.get('/:id', verifyToken, (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send({ message: 'Todo not found' });
    res.json(todo);
});

router.post('/', [verifyToken, isAdmin], (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    todos.push(newTodo);
    res.status(201).send(newTodo);
});

router.put('/:id', [verifyToken, isAdmin], (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send({ message: 'Todo not found' });

    todo.title = req.body.title || todo.title;
    todo.description = req.body.description || todo.description;

    res.send(todo);
});

module.exports = router;
