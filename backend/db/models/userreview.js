'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserReview.belongsTo(models.User, {
        foreignKey: 'ownerId'
      })
    }
  }
  UserReview.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    renterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserReview',
  });
  return UserReview;
};
