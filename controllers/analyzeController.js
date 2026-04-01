const { getRecommendations } = require("../ai/recommendationEngine");

exports.analyzeSoil = (req, res) => {
  const soilData = req.body;

  const result = getRecommendations(soilData);

  res.json(result);
};