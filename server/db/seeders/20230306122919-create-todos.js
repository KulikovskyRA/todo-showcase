const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { data } = await axios('https://jsonplaceholder.typicode.com/todos');

    await queryInterface.bulkInsert(
      'Todos',
      data.map((el) => ({ title: el.title, status: el.completed })),
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
  },
};
