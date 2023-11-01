'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   
      this.hasOne(models.Account,{foreignKey:'profile_id',as:'account'})
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    
    gender:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    } ,
    phoneNumber:{
      type: DataTypes.INTEGER,
      allowNull: true,
    } ,
    birthday:{
      type: DataTypes.DATE,
      allowNull: true,
    } , 
   
    
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};