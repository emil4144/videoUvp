const user = require('../controller/User');
const cors = require('cors');


module.exports = (app) => {
    app.use(cors())
    app.post('/signup', user.signUp);

    app.post('/login', user.logIn);

    app.post('/forgot', user.forgotPassword);

    app.post('/confirm', user.confirmCode);

    app.post('/reset', user.resetPassword);

    

    app.use('*', (req, res) => {
        res.status(404).send({msg: 'route does not found'});
    })
}