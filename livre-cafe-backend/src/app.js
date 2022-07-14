const express = require('express');
const cors = require('cors');
const passport = require('passport');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const BooksRouter = require('./api/books/books.route');
const DrinksRouter = require('./api/drinks/drinks.route');
const OrdersRouter = require('./api/orders/orders.route');
const CustomerRouter = require('./api/customers/customers.route');
const StaffsRouter = require('./api/staffs/staffs.route');
const AuthRouter = require('./api/auth/auth.route');
const isManager = require('./middleware/authorize');

const app = express();

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "LivreCoffee API",
            version: "1.0.0",
            description: "LivreCoffee API swagger documentation"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: [`${__dirname}/api/*/*.route.js`]
}

const specs = swaggerJsDoc(options);

require('./config/passport')(passport);

app.use(passport.initialize());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors({
    origin: "*"
}));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use('/auth', AuthRouter);
app.use(passport.authenticate('jwt', { session: false }));
app.use('/books', BooksRouter);
app.use('/drinks', DrinksRouter);
app.use('/orders', OrdersRouter);
app.use('/customers', CustomerRouter);
app.use('/staffs', isManager, StaffsRouter);


app.use('/*', (err, req, res, next) => {
    console.log(err);
    res.json(err);
});

module.exports = app;