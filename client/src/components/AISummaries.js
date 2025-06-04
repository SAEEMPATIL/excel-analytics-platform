import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const AISummaries = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState('');
  const [insights, setInsights] = useState('');
  const [error, setError] = useState('');

  // Utility: detect data type of column values
  const detectColumnType = (values) => {
    const isNumber = values.every(v => v === '' || !isNaN(parseFloat(v)));
    if (isNumber) return 'Number';
    const isDate = values.every(v => {
      if (v === '') return true;
      return !isNaN(Date.parse(v));
    });
    if (isDate) return 'Date';
    return 'String';
  };

  // Utility: basic numeric stats
  const numericStats = (values) => {
    const nums = values
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));
    if (nums.length === 0) return null;

    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { count: nums.length, average: avg, min, max };
  };

  // Parse Excel file
  const handleFileUpload = (e) => {
    setError('');
    setSummary('');
    setInsights('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setData(jsonData);
      } catch (err) {
        setError('Failed to parse Excel file.');
        setData([]);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Generate summary and insights without AI
  const generateSummaryAndInsights = () => {
    if (data.length === 0) {
      setError('Please upload and parse Excel data first.');
      return;
    }

    // Summary: rows and columns count
    const rowCount = data.length;
    const columns = Object.keys(data[0] || {});
    const colCount = columns.length;

    let summaryText = `This dataset has ${rowCount} rows and ${colCount} columns.\n\nColumns:\n`;
    
    // Detect column types
    const colTypes = {};
    columns.forEach(col => {
      const values = data.map(row => row[col]);
      colTypes[col] = detectColumnType(values);
    });

    for (const col of columns) {
      summaryText += `- ${col}: ${colTypes[col]}\n`;
    }

    setSummary(summaryText);

    // Insights: numeric stats for number columns
    let insightsText = 'Numeric column statistics:\n';
    let foundNumeric = false;

    columns.forEach(col => {
      if (colTypes[col] === 'Number') {
        foundNumeric = true;
        const values = data.map(row => row[col]);
        const stats = numericStats(values);
        if (stats) {
          insightsText += `\n${col}:\n  Count: ${stats.count}\n  Average: ${stats.average.toFixed(2)}\n  Min: ${stats.min}\n  Max: ${stats.max}\n`;
        }
      }
    });

    if (!foundNumeric) {
      insightsText = 'No numeric columns found for statistical insights.';
    }

    setInsights(insightsText);
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Generate Summary & Insights</h2>

      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 && (
        <>
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: "#002366" }}>
  Preview (first 5 rows):
</h3>

            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                color:'#002366',
                marginBottom: 20,
              }}
            >
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      style={{
                        border: '1px solid #ccc',
                        padding: '6px 10px',
                        backgroundColor: '#f9f9f9 ',
                        textAlign: 'left',
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#b0c4de ' : '#4682b4',
                    }}
                  >
                    {Object.keys(row).map((key) => (
                      <td key={key} style={{ border: '1px solid #ccc', padding: '6px 10px' }}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={generateSummaryAndInsights}
            style={{
              padding: '10px 25px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Generate Summary & Insights
          </button>
        </>
      )}

      {(summary || insights) && (
        <div
          style={{
            marginTop: 25,
            padding: 15,
            backgroundColor: '#add8e6',
            borderRadius: 6,
            whiteSpace: 'pre-wrap',
            fontSize: 16,
          }}
        >
          {summary && (
            <>
              <h3>Summary:</h3>
              <p>{summary}</p>
            </>
          )}

          {insights && (
            <>
              <h3>Insights:</h3>
              <pre>{insights}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISummaries;
