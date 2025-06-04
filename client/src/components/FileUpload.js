import React, { useState } from 'react';
import './FileUpload.css';
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

const FileUpload = () => {
  const [excelData, setExcelData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(json);

      try {
        const existingHistory = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
        const newEntry = {
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          data: json,
        };
        const updatedHistory = [newEntry, ...existingHistory];
        localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Error saving upload history:", error);
      }

      toast.success('Excel file uploaded and previewed successfully!');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'exported_excel.xlsx');
    toast.success('Excel downloaded successfully!');
  };

  const handleDownloadChart = () => {
    const canvas = document.getElementById('chart');
    if (!canvas) {
      toast.error('No chart available to download.');
      return;
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.png';
    a.click();
    toast.success('Chart downloaded successfully!');
  };

  const groupData = () => {
    if (!xAxis || !yAxis || excelData.length === 0) return { labels: [], dataValues: [] };

    const grouped = {};

    excelData.forEach((row) => {
      const xVal = row[xAxis];
      let yVal = parseFloat(row[yAxis]);
      if (isNaN(yVal)) yVal = 0;

      if (grouped[xVal]) {
        grouped[xVal] += yVal;
      } else {
        grouped[xVal] = yVal;
      }
    });

    const labels = Object.keys(grouped);
    const dataValues = labels.map((label) => grouped[label]);

    return { labels, dataValues };
  };

  const renderChart = () => {
    if (!xAxis || !yAxis) return null;

    const { labels, dataValues } = groupData();

    if (labels.length === 0) return <p>No valid data for chart.</p>;

    const data = {
      labels,
      datasets: [
        {
          label: `${yAxis} summed by ${xAxis}`,
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
      <div className="chart-container">
        <ChartComponent data={data} options={options} id="chart" />
      </div>
    );
  };

  return (
    <div className="file-upload-container">
      <h2>📊 Upload Excel File and Visualize</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {excelData.length > 0 && (
        <>
          <div className="dropdowns">
            <label>
              X-Axis:
              <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                <option value="">Select column</option>
                {Object.keys(excelData[0] || {}).map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Y-Axis:
              <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                <option value="">Select column</option>
                {Object.keys(excelData[0] || {}).map((col) => (
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
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>
            </label>
          </div>

          {renderChart()}

          <div className="buttons">
            <button onClick={handleDownloadExcel}>📥 Download Excel</button>
            <button onClick={handleDownloadChart}>📈 Download Chart</button>
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default FileUpload;
