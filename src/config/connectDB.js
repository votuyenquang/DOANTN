const { Sequelize } = require('sequelize');
const process = require('process');

  const sequelize = new Sequelize('mysql://psiyt6380wj4qsozvd90:pscale_pw_vCCiHXCCxk2IjKsQ8fTJDWfG5siqMctC9PNv84CUc6m@ap-southeast.connect.psdb.cloud/doantn', {
    host: 'aws.connect.psdb.cloud',
    dialect: 'mysql',
    logging: false,
    timezone: "+07:00",
    dialectOptions:{
      "ssl":{
        "require":true,
        "rejectUnauthorized": true
      }
    },
  // dialectModule: require('mysql2'),
  // sync: { force: false },
  /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});




let connectDB =async ()=>{
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB