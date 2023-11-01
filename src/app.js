const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/connectDB');
const route = require('./routes')
const app = express()
const port = 3000
const cors = require('cors');

app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // const allowedOrigins = ['http://localhost:3000','https://trungtamquanlytremocoi.onrender.com'];
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

connectDB()

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
