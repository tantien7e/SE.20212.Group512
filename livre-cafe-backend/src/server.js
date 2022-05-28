const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const mongoUri = 'mongodb+srv://Halley:0913127854Hai@mydb.0us8q.mongodb.net/LivreCoffeeDB?retryWrites=true&w=majority';

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        server.listen(PORT, () => {
            console.log("Server is listening...");
        });
    } catch (err) {
        console.log(err);
        console.log("Database connection failed!");
    }
}

startServer();