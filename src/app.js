import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add GET endpoint handler
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  });
})
app.route('/api/v1/todos')
  .get((req, res) => {
    res.status(200).send({
      success: 'true',
      message: 'todos retrieved successfully',
      todos: db
    });
  })
  .post((req, res) => {
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required'
      });
    } else if (!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required'
      });
    }
    const todo = {
      id: db.length + 1,
      title: req.body.title,
      description: req.body.description
    }
    db.push(todo);
    return res.status(201).send({
      success: 'true',
      message: 'todo added successfully',
      todo
    })
  });


app.route('/api/v1/todos/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id, 10);
    const [todo] = db.filter(todoItem => todoItem.id === id);

    return todo ?
      res.status(200).send({
        success: 'true',
        message: 'todo retrieved successfully',
        todo
      }) :
      res.status(404).send({
        success: 'false',
        message: 'todo does not exist'
      });
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id, 10);
    let removed;
    db.map((todo, index) => {
      if (todo.id === id) {
        removed = db.splice(index, 1);
      }
    });
    return removed ?
      res.status(200).send({
        success: 'true',
        message: 'Todo deleted successfully',
      }) :
      res.status(404).send({
        success: 'false',
        message: 'todo not found',
      });
  })
  .put((req, res) => {
    const id = parseInt(req.params.id, 10);
    let todoFound;
    let itemIndex;
    db.map((todo, index) => {
      if (todo.id === id) {
        todoFound = todo;
        itemIndex = index;
      }
    });

    if (!todoFound) {
      return res.status(404).send({
        success: 'false',
        message: 'todo not found',
      });
    }

    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    } else if (!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required',
      });
    }

    const updatedTodo = {
      id: todoFound.id,
      title: req.body.title || todoFound.title,
      description: req.body.description || todoFound.description,
    };

    db.splice(itemIndex, 1, updatedTodo);

    return res.status(201).send({
      success: 'true',
      message: 'todo added successfully',
      updatedTodo,
    });
  });

// Start the server
const server = app.listen(5000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});