import { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    pH: "",
    crop: "wheat"
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/analyze", {
      ...form,
      N: Number(form.N),
      P: Number(form.P),
      K: Number(form.K),
      pH: Number(form.pH)
    });

    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mitti Scan</h1>

      <input name="N" placeholder="Nitrogen" onChange={handleChange} /><br />
      <input name="P" placeholder="Phosphorus" onChange={handleChange} /><br />
      <input name="K" placeholder="Potassium" onChange={handleChange} /><br />
      <input name="pH" placeholder="pH" onChange={handleChange} /><br />

      <select name="crop" onChange={handleChange}>
        <option value="wheat">Wheat</option>
        <option value="rice">Rice</option>
        <option value="cotton">Cotton</option>
        <option value="maize">Maize</option>
      </select><br /><br />

      <button onClick={handleSubmit}>Analyze Soil</button>

      {result && (
        <div>
          <h2>Analysis</h2>
          {result.analysis.map((item, i) => (
            <p key={i}>
              {item.nutrient}: {item.status} ({item.deficiency})
            </p>
          ))}

          <h2>Recommendations</h2>
          {result.recommendations.map((rec, i) => (
            <div key={i}>
              <h4>{rec.nutrient}</h4>
              {rec.suggestions?.map((s, j) => (
                <p key={j}>
                  {s.name} - {s.estimated_bags || ""} bags - ₹{s.estimated_cost || ""}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;