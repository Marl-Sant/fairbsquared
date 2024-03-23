'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'UserReviews';
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          renterId:2,
          review: "THIS IS A REVIEW OF USER 2 FROM USER 1"
        },
        {
          ownerId: 1,
          renterId:3,
          review: "THIS IS A REVIEW OF USER 3 FROM USER 1"
        },
        {
          ownerId: 2,
          renterId:1,
          review: "THIS IS A REVIEW OF USER 1 FROM USER 2"
        },
        {
          ownerId: 2,
          renterId:3,
          review: "THIS IS A REVIEW OF USER 3 FROM USER 2"
        },
        {
          ownerId: 3,
          renterId:1,
          review: "THIS IS A REVIEW OF USER 1 FROM USER 3"
        },
        {
          ownerId: 3,
          renterId: 2,
          review: "THIS IS A REVIEW OF USER 2 FROM USER 3"
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'UserReviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
