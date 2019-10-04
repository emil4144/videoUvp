const mongoose = require('mongoose');
const Config = require('./config')
mongoose.Promise = global.Promise;

mongoose.connect(Config.mongoURI, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!')
});
