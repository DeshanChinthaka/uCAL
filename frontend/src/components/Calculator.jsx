import React, { useState, useEffect } from "react";
import axios from "axios";

const Calculator = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("+");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const calculate = async () => {
    setError("");
    setResult(null);

    if (num1 === "" || num2 === "") {
      setError("Please enter both numbers");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/calculate", {
        num1: Number(num1),
        num2: Number(num2),
        operation,
      });

      setResult(res.data.result);
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || "Calculation failed");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/calculate/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const toggleHistory = () => {
    if (!showHistory) {
      fetchHistory(); // Fetch fresh data when showing
    }
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center", fontFamily: "Arial" }}>
      <h1>uCAL</h1>

      <div style={{ margin: "30px 0" }}>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
          style={{ padding: "10px", width: "150px", margin: "0 10px" }}
        />

        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          style={{ padding: "10px", margin: "0 10px" }}
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>

        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter second number"
          style={{ padding: "10px", width: "150px", margin: "0 10px" }}
        />

        <button
          onClick={calculate}
          style={{ padding: "10px 20px", fontSize: "16px", marginLeft: "20px", cursor: "pointer", borderRadius: "15px", backgroundColor: "#4CAF50", color: "white" }}
        >
          Calculate
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result !== null && <h2>Result: {result}</h2>}

      {/* Toggle History Button */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={toggleHistory}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* History Section - Only shown when showHistory is true */}
      {showHistory && (
        <div style={{ marginTop: "30px" }}>
          <h3>Calculation History</h3>
          {history.length === 0 ? (
            <p>No calculations yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {history.map((item) => (
                <li
                  key={item._id}
                  style={{
                    width: "100%",
                    maxWidth: "450px",
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                >
                  {item.num1} {item.operation} {item.num2} = <strong>{item.result}</strong>
                  <br />
                  <small style={{ color: "#666" }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;