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

  // Smart result formatter (keeps exact if ≤4 decimals, else rounds to 4)
  const formatResult = (value) => {
    if (value === null || value === undefined) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (Number.isInteger(num)) return num.toString();

    const fixed = num.toFixed(10);
    const trimmed = parseFloat(fixed);

    if (Number.isInteger(trimmed * 10000)) {
      return trimmed.toString();
    }
    return num.toFixed(4);
  };

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

      <div style={{ 
        display: "grid",
        gridTemplateColumns: "1fr 180px",
        gap: "40px",
        alignItems: "start" 
      }}>
        {/* Left: Input Fields (Vertical) */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
          style={{ 
             padding: "20px",
              fontSize: "20px",
              borderRadius: "12px",
              border: "2px solid #333",
              textAlign: "left",
              outline: "none" 
          }}
        />

        <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Enter second number"
            style={{
              padding: "20px",
              fontSize: "20px",
              borderRadius: "12px",
              border: "2px solid #333",
              textAlign: "left",
              outline: "none"
            }}
          />
        </div>
        {/* 
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          style={{ padding: "10px", margin: "0 10px" }}
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select> */}

        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px", 
          //margin: "0 10px" 
        }}>
          {/* <button
            onClick={() => setOperation('+')}
            style={{
              padding: "10px 15px",
              fontSize: "18px",
              backgroundColor: operation === '+' ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            +
          </button> */}

          {["+","-","*","/"].map((op) => (
          <button
            key={op}
            onClick={() => setOperation(op)}
            style={{
              height: "70px",
              fontSize: "26px",
              borderRadius: "16px",
              border: "2px solid #000",
              backgroundColor: operation === op ? "#0d6efd" : "#e0e0e0",
              color: operation === op ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {op === "*" ? "×" : op === "/" ? "÷" : op}
          </button>
          ))}

          {/* Equal button (spans full width of grid) */}
          <button
            onClick={calculate}
            style={{
              width: "100%",
              height: "160px",
              padding: "20px",
              fontSize: "32px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #ff8c00, #ff2d00)",
              color: "white",
              border: "2px solid #000",
              borderRadius: "20px",
              marginTop: "30px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            =
          </button>
        </div>

        
      </div>

      <div style= {{textAlign: "center", marginTop: "30px"}}>
        {error && <p style={{color: "red", fontSize: "18px" }}>{error}</p>}
        {result !== null && <h2 style={{ fontSize: "36px", color: "#333" }}>Result: {result}</h2>}
      </div>      

      {/* Toggle History Button */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={toggleHistory}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#3300ffff",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* History Section - Only shown when showHistory is true */}
      {showHistory && (
        <div style={{ marginTop: "40px" }}>
          <h3>Calculation History</h3>
          {history.length === 0 ? (
            <p style={{ textAlign: "center" }}>No calculations yet.</p>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center"
            }}>
              {history.map((item) => (
                <div
                  key={item._id}
                  style={{
                    width: "100%",
                    maxWidth: "250px",
                    padding: "14px 20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    fontSize: "16px"
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {item.num1} {item.operation.replace('*', '×').replace('/', '÷')} {item.num2} ={" "}
                    <span style={{ color: "#0b69cdff" }}>{formatResult(item.result)}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;