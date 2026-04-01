const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const { extractText, extractValues } = require("../ai/ocr");
const { getRecommendations } = require("../ai/recommendationEngine");

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const text = await extractText(req.file.path);

        const values = extractValues(text);

        // 🔥 handle OCR failure
        if (!values.detected) {
            
            return res.json({
                text,
                values,
                warning: "Could not detect soil values clearly. Please enter manually."
            });
        }

        const result = getRecommendations(values);

        res.json({ text, values, result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;