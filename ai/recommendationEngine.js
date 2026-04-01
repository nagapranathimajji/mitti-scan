function getRecommendations(data) {
    const { N, P, K, pH, crop = "wheat" } = data;

    let analysis = [];
    let recommendations = [];

    // Crop standards (expandable)
    const cropStandards = {
        rice: { N: 150, P: 50, K: 120 },
        wheat: { N: 120, P: 40, K: 100 },
        cotton: { N: 100, P: 50, K: 50 },
        maize: { N: 140, P: 60, K: 40 }
    };

    const ideal = cropStandards[crop] || cropStandards["wheat"];

    function getDeficiency(actual, ideal) {
        if (actual >= ideal) return 0;
        return Math.round(((ideal - actual) / ideal) * 100);
    }

    // 🔹 Helper to generate recommendation block
    function buildRecommendation(nutrient, deficiency, options) {
        let bags = Math.ceil(deficiency / 10);

        return {
            nutrient,
            deficiency: deficiency + "%",
            suggestions: options.map(opt => ({
                name: opt.name,
                type: opt.type,
                estimated_bags: bags,
                estimated_cost: bags * opt.price_per_bag
            }))
        };
    }

    // 🔸 Nitrogen
    let nDef = getDeficiency(N, ideal.N);
    analysis.push({
        nutrient: "Nitrogen",
        status: N < ideal.N ? "Low" : "Normal",
        deficiency: nDef + "%"
    });
    if (N === null) {
        analysis.push({
            nutrient: "Nitrogen",
            status: "Not Detected"
        });
    } else if (N < ideal.N) {
        recommendations.push(
            buildRecommendation("Nitrogen", nDef, [
                { name: "Neem Coated Urea", type: "chemical", price_per_bag: 300 },
                { name: "Ammonium Sulphate", type: "chemical", price_per_bag: 350 },
                { name: "Compost", type: "organic", price_per_bag: 200 }
            ])
        );
    }

    // 🔸 Phosphorus
    let pDef = getDeficiency(P, ideal.P);
    analysis.push({
        nutrient: "Phosphorus",
        status: P < ideal.P ? "Low" : "Normal",
        deficiency: pDef + "%"
    });
    if (P === null) {
        analysis.push({
            nutrient: "Phosphorus",
            status: "Not Detected"
        });
    } else
        if (P < ideal.P) {
            recommendations.push(
                buildRecommendation("Phosphorus", pDef, [
                    { name: "SSP", type: "chemical", price_per_bag: 400 },
                    { name: "DAP", type: "chemical", price_per_bag: 1200 },
                    { name: "Bone Meal", type: "organic", price_per_bag: 500 }
                ])
            );
        }

    // 🔸 Potassium
    let kDef = getDeficiency(K, ideal.K);
    analysis.push({
        nutrient: "Potassium",
        status: K < ideal.K ? "Low" : "Normal",
        deficiency: kDef + "%"
    });

    if (K === null) {
        analysis.push({
            nutrient: "Potassium",
            status: "Not Detected"
        });
    } else if (K < ideal.K) {
        recommendations.push(
            buildRecommendation("Potassium", kDef, [
                { name: "MOP", type: "chemical", price_per_bag: 350 },
                { name: "SOP", type: "chemical", price_per_bag: 500 },
                { name: "Wood Ash", type: "organic", price_per_bag: 150 }
            ])
        );
    }

    // 🔸 pH
    if (pH === null) {
        analysis.push({
            nutrient: "pH",
            status: "Not Detected"
        });
    } else
        if (pH < 6) {
            analysis.push({ nutrient: "pH", status: "Acidic" });
            recommendations.push({
                nutrient: "pH Correction",
                suggestions: [
                    { name: "Lime", type: "chemical", purpose: "Increase soil pH" },
                    { name: "Dolomite", type: "natural", purpose: "Neutralize acidity" }
                ]
            });
        } else if (pH > 7.5) {
            analysis.push({ nutrient: "pH", status: "Alkaline" });
            recommendations.push({
                nutrient: "pH Correction",
                suggestions: [
                    { name: "Gypsum", type: "chemical", purpose: "Reduce alkalinity" }
                ]
            });
        } else {
            analysis.push({ nutrient: "pH", status: "Normal" });
        }

    return {
        input: data,
        crop_used: crop,
        analysis,
        recommendations,
        summary: "Soil deficiencies detected. Apply suitable fertilizers based on recommendations.",
        note: "Recommendations are indicative. Consult local agricultural expert before application."
    };
}

module.exports = { getRecommendations };