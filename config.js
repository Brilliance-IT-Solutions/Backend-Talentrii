const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const router = require('./server/router')
const dotenv = require('dotenv')
const constants = require('./server/utility/constants')
dotenv.config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

const whitelist = [
    // 'http://localhost:4200',
    // 'http://localhost:8000'
];

const corsOptions = {
    origin: function (origin, callback) {
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use('/router', router);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.listen(port, () => console.log(`Express server listening on port ${port}`));

module.exports = app