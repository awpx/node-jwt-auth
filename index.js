const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

const app = express();

//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  },
  () => console.log('db connected')
)

//middleware
app.use(express.json())
app.use(cors());

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//route middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => { console.log('server running...') })