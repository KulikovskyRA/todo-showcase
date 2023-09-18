const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate() {}
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );
  return Todo;
};
