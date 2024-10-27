// server.js
const express = require('express');
const bot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware to parse incoming requests
app.use(express.json());

// Endpoint to receive updates from Telegram
app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body); // Pass the update to the bot
    res.sendStatus(200); // Respond with 200 OK
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});