
const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = require('./todo');

const app = express();

app.use(bodyParser.json());

app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
