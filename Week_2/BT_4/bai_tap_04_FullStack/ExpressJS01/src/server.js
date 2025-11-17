require('dotenv').config();

const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const {connection} = require('./config/database');
const {getHomepage} = require('./controllers/homeController');
const cors = require('cors');

const app = express(); //Tao ra ung dung express
//Cau hinh port, neu tim thay trong file .env thi dung no, ko thi mac dinh la 8888
const PORT = process.env.PORT || 8888;
app.use(cors()); //Cau hinh cors
app.use(express.json()) // config req.body cho json data
app.use(express.urlencoded({extended: true})); // for form data

configViewEngine(app); //Cau hinh view engine

//config route cho view ejs
const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);

// Khai bao route cho API
app.use('/v1/api/', apiRoutes);
(async () => {
    try {
        // Ket noi database
        await connection();
        // Lang nghe port
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.log('Error when starting the server: ', error);
    }
}) ();



