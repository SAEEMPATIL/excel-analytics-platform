import React, { useState, useRef } from 'react';
import './FileUpload.css';
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

const FileUpload = ({ setExcelData }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('Bar');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const chartRef = useRef(null);

  // We'll keep local excelData state only for display convenience
  const [localExcelData, setLocalExcelData] = useState([]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    try {
      setMessage('Uploading file...');
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('http://localhost:5000/api/excel/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json();
        setMessage(`Upload failed: ${err.message}`);
        return;
      }

      const uploadData = await uploadResponse.json();
      const fileId = uploadData.fileId;
      const filename = uploadData.filename || file.name;
      setUploadedFilename(filename);
      setMessage('File uploaded successfully. Fetching data...');

      const dataResponse = await fetch(`http://localhost:5000/api/excel/data/${fileId}`);
      if (!dataResponse.ok) {
        setMessage('Failed to fetch parsed data');
        return;
      }

      const dataJson = await dataResponse.json();
      setLocalExcelData(dataJson.data);   // local display
      setExcelData(dataJson.data);        // update parent App state

      setXAxis('');
      setYAxis('');
      setChartType('Bar');
      setMessage('File data loaded successfully');

      // Save to localStorage history
      const historyItem = {
        fileName: filename,
        uploadedAt: new Date().toISOString(),
        data: dataJson.data,
      };

      const existingHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      localStorage.setItem('uploadHistory', JSON.stringify([historyItem, ...existingHistory]));
    } catch (error) {
      console.error(error);
      setMessage('Error uploading or fetching file data');
    }
  };

  const prepareChartData = () => {
    if (!xAxis || !yAxis || localExcelData.length === 0) return null;

    const labels = localExcelData.map((row) => String(row[xAxis]));
    const dataValues = localExcelData.map((row) => Number(row[yAxis]) || 0);

    return {
      labels,
      datasets: [
        {
          label: yAxis,
          data: dataValues,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: chartType === 'Line' ? false : true,
        },
      ],
    };
  };

  const renderChart = () => {
    const data = prepareChartData();
    if (!data) return <p>Please select X and Y axis to display chart</p>;

    const options = {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
      },
      scales: { y: { beginAtZero: true } },
    };

    switch (chartType) {
      case 'Bar':
        return <Bar ref={chartRef} data={data} options={options} />;
      case 'Line':
        return <Line ref={chartRef} data={data} options={options} />;
      case 'Pie': {
        const pieData = {
          labels: data.labels,
          datasets: [
            {
              label: yAxis,
              data: data.datasets[0].data,
              backgroundColor: data.labels.map(
                () =>
                  `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                  )},${Math.floor(Math.random() * 255)}, 0.6)`
              ),
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        };
        return (
          <Pie
            ref={chartRef}
            data={pieData}
            options={{ responsive: true, plugins: { legend: { position: 'right' } } }}
          />
        );
      }
      default:
        return null;
    }
  };

  const downloadExcelFile = () => {
    if (!uploadedFilename) {
      alert('No file available to download');
      return;
    }

    fetch(`http://localhost:5000/api/excel/download/${uploadedFilename}`)
      .then((response) => {
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', uploadedFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Download error:', error);
        alert('Download failed');
      });
  };

  const downloadChartImage = () => {
    if (!chartRef.current) {
      alert('No chart to download');
      return;
    }
    const base64Image = chartRef.current.toBase64Image();
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = 'chart.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="upload-container">
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx,.xls" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <p className="message">{message}</p>

      {localExcelData.length > 0 && (
        <>
          <div className="chart-controls">
            <label>
              X-Axis:
              <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                <option value="">Select</option>
                {Object.keys(localExcelData[0]).map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Y-Axis:
              <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                <option value="">Select</option>
                {Object.keys(localExcelData[0]).map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Chart Type:
              <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
                <option value="Pie">Pie</option>
              </select>
            </label>
          </div>

          <div className="chart-container">{renderChart()}</div>

          <button onClick={downloadExcelFile}>Download Excel File</button>
          <button onClick={downloadChartImage}>Download Chart Image</button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
