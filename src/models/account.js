'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
      this.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profile' });
      this.hasOne(models.Adropt_detail, { foreignKey: 'account_id', as: 'adropt_detail' });
      this.hasOne(models.Center,{foreignKey:'account_id',as:'center'})
      this.hasMany(models.Like, { foreignKey: 'acount_id', as: 'like' });;
      this.hasMany(models.Comment, { foreignKey: 'account_id', as: 'comment' })
      this.hasMany(models.Donor, { foreignKey: 'account_id', as: 'donor' });
      this.hasMany(models.Notification, { foreignKey: 'account_id', as: 'notification' });

    }
  }
  Account.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    Token: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};