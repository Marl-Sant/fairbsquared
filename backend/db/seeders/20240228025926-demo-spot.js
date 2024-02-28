'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [{
      ownerId: 1,
      address: "3230 SW 1st Ave",
      city: "Deerfield Beach",
      state: "Fl",
      country: "USA",
      lat: 49.18254,
      lng: 15.34587,
      name: "Single Family Home -- Great for Families",
      description: "Lorem ipsum dolor sit amet",
      price: 143
    },
    {
      ownerId: 2,
      address: "18320 Colorado Circle",
      city: "Boca Raton",
      state: "Fl",
      country: "USA",
      lat: 42.465782,
      lng: 17.465874,
      name: "Small Condo for Retirees",
      description: "Lorem ipsum dolor sit amet",
      price: 165
    },
    {
      ownerId: 3,
      address: "115 Deer Creek Blvd",
      city: "Fort Lauderdale",
      state: "Fl",
      country: "USA",
      lat: 41.466282,
      lng: 11.95874,
      name: "Studio Apartment in Downtown",
      description: "Lorem ipsum dolor sit amet",
      price: 122
    },
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Studio Apartment in Downtown", "Small Condo for Retirees", "Single Family Home -- Great for Families"] }
    }, {});
  }
};
