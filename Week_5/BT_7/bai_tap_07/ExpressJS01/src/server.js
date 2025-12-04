require('dotenv').config();

const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const {connection} = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createApolloServer, getGraphQLMiddleware } = require('./graphql');

const app = express(); //Tao ra ung dung express
//Cau hinh port, neu tim thay trong file .env thi dung no, ko thi mac dinh la 8080
const PORT = process.env.PORT || 8080;

// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser middleware (để đọc JWT từ cookie)
app.use(cookieParser());

app.use(express.json()) // config req.body cho json data
app.use(express.urlencoded({extended: true})); // for form data

configViewEngine(app); //Cau hinh view engine

// Khai bao route cho API
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        // Ket noi database
        await connection();
        
        // Khởi tạo Apollo Server
        const apolloServer = createApolloServer();
        await apolloServer.start();
        
        // Thêm GraphQL endpoint
        app.use('/graphql', getGraphQLMiddleware(apolloServer));
        
        // Lang nghe port
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
            console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    } catch (error) {
        console.log('Error when starting the server: ', error);
    }
}) ();



