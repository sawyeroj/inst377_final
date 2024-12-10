import fetch from "node-fetch";
import express from "express";

const app = express();
const port = 3000;

app.get("/weather", async (req, res) => {
    const apiKey = "2badbca06718754f234e31f576c7fde9";
    const query = req.query.query; // 
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); 
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
