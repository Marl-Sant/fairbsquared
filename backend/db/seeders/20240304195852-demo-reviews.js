'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          spotId: 1,
          review: 'THIS IS A REVIEW ON SPOT 1 FROM USER 1',
          stars: 2,
          cleanliness: 1,
          accuracy: 5,
          checkIn: 4,
          communication: 3,
          location: 3,
          value: 4,
        },
        {
          userId: 1,
          spotId: 2,
          review: 'THIS IS A REVIEW ON SPOT 2 FROM USER 1',
          stars: 3,
          cleanliness: 3,
          accuracy: 1,
          checkIn: 4,
          communication: 3,
          location: 1,
          value: 1,
        },
        {
          userId: 1,
          spotId: 3,
          review: 'THIS IS A REVIEW ON SPOT 3 FROM USER 1',
          stars: 1,
          cleanliness: 3,
          accuracy: 5,
          checkIn: 2,
          communication: 3,
          location: 2,
          value: 4,
        },
        {
          userId: 2,
          spotId: 1,
          review: 'THIS IS A REVIEW ON SPOT 1 FROM USER 2',
          stars: 2,
          cleanliness: 3,
          accuracy: 5,
          checkIn: 2,
          communication: 3,
          location: 2,
          value: 4,
        },
        {
          userId: 2,
          spotId: 2,
          review: 'THIS IS A REVIEW ON SPOT 2 FROM USER 2',
          stars: 5,
          cleanliness: 5,
          accuracy: 5,
          checkIn: 5,
          communication: 5,
          location: 5,
          value: 5,
        },
        {
          userId: 2,
          spotId: 3,
          review: 'THIS IS A REVIEW ON SPOT 3 FROM USER 2',
          stars: 2,
          cleanliness: 3,
          accuracy: 2,
          checkIn: 4,
          communication: 1,
          location: 5,
          value: 4,
        },
        {
          userId: 3,
          spotId: 1,
          review: 'THIS IS A REVIEW ON SPOT 1 FROM USER 3',
          stars: 1,
          cleanliness: 2,
          accuracy: 1,
          checkIn: 4,
          communication: 5,
          location: 3,
          value: 2,
        },
        {
          userId: 3,
          spotId: 2,
          review: 'THIS IS A REVIEW ON SPOT 2 FROM USER 3',
          stars: 4,
          cleanliness: 3,
          accuracy: 1,
          checkIn: 2,
          communication: 3,
          location: 4,
          value: 5,
        },
        {
          userId: 3,
          spotId: 3,
          review: 'THIS IS A REVIEW ON SPOT 3 FROM USER 3',
          stars: 2,
          cleanliness: 3,
          accuracy: 5,
          checkIn: 2,
          communication: 3,
          location: 2,
          value: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
