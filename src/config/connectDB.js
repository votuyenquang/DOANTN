const { Sequelize } = require('sequelize');
const process = require('process');

// Option 3: Passing parameters separately (other dialects)

  // const sequelize = new Sequelize('doantn',process.env.username, process.env.PASS, {
    const sequelize = new Sequelize('doantn', 'saagwbzpy48s447wpazu', 'pscale_pw_8xNXjEF5r9vUwMXRKFnTO6sUBPs2rCBecwxkLscbqhv', {
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
  dialectModule: require('mysql2'),
  sync: { force: false },
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