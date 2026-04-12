const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
    const { url, platform } = req.body;

    try {
        if (platform === "Instagram") {

            // 🔹 Step 1: Get video data from API
            const response = await axios.post(
                "https://save-insta.com/api/ajaxSearch/",
                new URLSearchParams({ url: url }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "Mozilla/5.0"
                    }
                }
            );

            const data = response.data;

            if (data && data.status === "success") {

                const videoUrl = data.data.media_url || data.data.video_url;

                // ❌ If no video URL
                if (!videoUrl) {
                    return res.json({
                        success: false,
                        message: "No video URL found"
                    });
                }

                console.log("Video URL:", videoUrl);

                // 🔹 Step 2: Fetch video stream
                const videoResponse = await axios({
                    url: videoUrl,
                    method: "GET",
                    responseType: "stream",
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "*/*"
                    }
                });

                // 🔹 Step 3: Send video as download
                res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
                res.setHeader("Content-Type", "video/mp4");

                videoResponse.data.pipe(res);

            } else {
                return res.json({
                    success: false,
                    message: "Failed to fetch video from API"
                });
            }

        } else {
            return res.json({
                success: false,
                message: "Platform not supported yet"
            });
        }

    } catch (error) {
        console.error("ERROR:", error.message);

        res.json({
            success: false,
            message: "Error fetching video"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});