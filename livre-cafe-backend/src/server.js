const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const mongoUri = 'mongodb://127.0.0.1:27017/MyDB';

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        server.listen(PORT, () => {
            console.log("Server is listening...");
        })
    } catch (err) {
        console.log(err);
        console.log("Database connection failed!");
    }
}

startServer();