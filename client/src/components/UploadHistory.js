import React, { useEffect, useState } from "react";
import './UploadHistory.css';

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
          <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                <th style={{ cursor: 'default' }}>File Name</th>
                <th style={{ cursor: 'default' }}>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => handleLoad(item)} 
                  style={{ cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                >
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
