module.exports = {
    port: process.env.PORT || 3600,
    //host: process.env.HOST || 'localhost',
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://adminkiosk:emil094641864@kiosk-usxqr.mongodb.net/uvp',
    // mongoURI: process.env.MONGO_URI || 'mongodb://adminuvp:7s[[rD.G$tLY4{w@127.0.0.1:27017/UVP',
    secretOrKey: process.env.SECRET_OR_KEY || 'key'
}