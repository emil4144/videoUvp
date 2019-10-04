const nodemailer = require('nodemailer');

module.exports = (res, token, email, RadnomDigigts)  => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'denbes.787@gmail.com',
            pass: '@admin10'
        }
    });

    var mailOptions = {
        from: 'denbes.787@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'UVP send you secure code!',
        html: `<h1>Welcome</h1><p>UVP send you secure code!</p><span>you are code</span><h3>${RadnomDigigts}</h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(401).json({err: true, msg: 'email does not send' })
        } else {
            res.json({err: false, token: token, msg: 'we send your email addres code'})
        }
    });
}