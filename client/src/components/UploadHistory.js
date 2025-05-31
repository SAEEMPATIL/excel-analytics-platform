import React, { useEffect, useState } from "react";

const UploadHistory = ({ onSelect }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  const handleLoad = (item) => {
    if (onSelect) onSelect(item.data);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("uploadHistory");
    setHistory([]);
  };

  return (
    <div>
      <h2>Upload History</h2>
      {history.length === 0 ? (
        <p>No upload history found.</p>
      ) : (
        <>
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fileName}</td>
                  <td>{new Date(item.uploadedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: '10px' }} onClick={handleClearHistory}>
            Clear History
          </button>
        </>
      )}
    </div>
  );
};

export default UploadHistory;
