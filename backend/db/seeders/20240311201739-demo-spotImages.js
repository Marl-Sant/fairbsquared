'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        defaultImage: true,
        imageUrl: "THIS IS THE DEFAULT PIC'S URL FOR SPOT 1",
      },
      {
        spotId: 2,
        defaultImage: true,
        imageUrl: "THIS IS THE DEFAULT PIC'S URL FOR SPOT 2",
      },
      {
        spotId: 3,
        defaultImage: true,
        imageUrl: "THIS IS THE DEFAULT PIC'S URL FOR SPOT 1",
      },
      {
        spotId: 1,
        defaultImage: false,
        imageUrl: "THIS IS A PIC'S URL FOR SPOT 1",
      },
      {
        spotId: 2,
        defaultImage: false,
        imageUrl: "THIS IS A PIC'S URL FOR SPOT 2",
      },
      {
        spotId: 3,
        defaultImage: false,
        imageUrl: "THIS IS A PIC'S URL FOR SPOT 3",
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
