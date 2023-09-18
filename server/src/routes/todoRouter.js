const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

router
  .get('/', getTodos)
  .post('/', createTodo)
  .put('/:id', updateTodo)
  .delete('/:id', deleteTodo);

module.exports = router;
