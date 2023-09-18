const { Todo } = require('../../db/models');

module.exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({ raw: true, order: [['id', 'DESC']] });
    res.json(todos);
  } catch (err) {
    res.sendStatus(404);
  }
};

module.exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.json(todo);
  } catch (err) {
    res.sendStatus(404);
  }
};

module.exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    await todo.update(req.body);
    res.json(todo);
  } catch (err) {
    res.sendStatus(404);
  }
};

module.exports.deleteTodo = async (req, res) => {
  try {
    await Todo.destroy({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
};
