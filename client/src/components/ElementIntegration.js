import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const ElementIntegration = ({ data }) => {
  const [factor, setFactor] = useState('');
  const [chartType, setChartType] = useState('bar');

  // Group data by factor, count occurrences and calculate percentages
  const groupData = () => {
    if (!factor || data.length === 0) return { labels: [], counts: {}, percentages: {}, total: 0 };

    const counts = {};
    data.forEach((row) => {
      const val = row[factor] || 'N/A';
      counts[val] = (counts[val] || 0) + 1;
    });

    const total = data.length;
    const percentages = {};
    Object.keys(counts).forEach((key) => {
      percentages[key] = ((counts[key] / total) * 100).toFixed(2);
    });

    return { labels: Object.keys(counts), counts, percentages, total };
  };

  const renderChart = () => {
    if (!factor) return null;

    const { labels, counts } = groupData();

    if (labels.length === 0) return <p>No valid data for chart.</p>;

    const dataValues = labels.map((label) => counts[label]);

    const chartData = {
      labels,
      datasets: [
        {
          label: `Count of ${factor}`,
          data: dataValues,
          backgroundColor:
            chartType === 'pie'
              ? [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ]
              : 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };

    const ChartComponent =
      chartType === 'bar' ? Bar : chartType === 'line' ? Line : Pie;

    return (
      <div style={{ maxWidth: 700, margin: '20px auto' }}>
        <ChartComponent data={chartData} options={options} id="chart" />
      </div>
    );
  };

  const { labels, counts, percentages, total } = groupData();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <label>
          Select factor:
          <select
            value={factor}
            onChange={(e) => setFactor(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Select column</option>
            {Object.keys(data[0] || {}).map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </label>

        <label>
          Chart Type:
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </label>
      </div>

      {renderChart()}

      {factor && labels.length > 0 && (
        <div style={{ maxWidth: 700, margin: '20px auto' }}>
          <h3>Statistics for "{factor}"</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Count</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{label}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{counts[label]}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{percentages[label]}%</td>
                </tr>
              ))}
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                  Total
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                  {total}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ElementIntegrationUploader = () => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      setExcelData(data);

      toast.success('Excel file uploaded successfully!');
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
      <h1>Upload Excel File & Visualize Data</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ marginBottom: '1rem' }}
      />

      {excelData.length > 0 ? (
        <ElementIntegration data={excelData} />
      ) : (
        <p>Please upload an Excel file to see data visualization.</p>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default ElementIntegrationUploader;
