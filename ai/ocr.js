const Tesseract = require("tesseract.js");

async function extractText(imagePath) {
    const result = await Tesseract.recognize(imagePath, "eng");
    return result.data.text;
}

// parse npk and pH values from text
function extractValues(text) {
    const N = text.match(/(Nitrogen.*?(\d+))|(N[\s:]+(\d+))/i);
    const P = text.match(/(Phosphorus.*?(\d+))|(P[\s:]+(\d+))/i);
    const K = text.match(/(Potassium.*?(\d+))|(K[\s:]+(\d+))/i);
    const pH = text.match(/pH[:\s]*([0-9]+\.?[0-9]*)/i);

    return {
        N: N ? Number(N[2] || N[4]) : null,
        P: P ? Number(P[2] || P[4]) : null,
        K: K ? Number(K[2] || K[4]) : null,
        pH: pH ? Number(pH[2]) : null,
        detected: !!(N || P || K || pH) // 🔥 important flag
    };
}

module.exports = { extractText, extractValues };