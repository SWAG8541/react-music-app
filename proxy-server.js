import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors()); // ✅ Allow CORS

app.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const deezerResponse = await axios.get(`https://api.deezer.com/search?q=${q}`);
    res.json(deezerResponse.data); // ✅ Forward Deezer response
  } catch (error) {
    console.error("Deezer API Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
