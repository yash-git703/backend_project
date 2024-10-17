const mongoose = require('mongoose');



// Connect to MongoDB

const db=mongoose.connect('mongodb+srv://root:root@cluster0.qk7u9.mongodb.net/libraries?retryWrites=true&w=majority&appName=Cluster0',
  {
  useNewUrlParser:true, useUnifiedTopology:true})
  .then(() => console.log('MongoDb Connected!'));

  module.exports=db