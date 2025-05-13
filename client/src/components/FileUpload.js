import React, { useState } from 'react';
import './FileUpload.css'; 
import * as XLSX from 'xlsx'; // Import the XLSX library for parsing the Excel file

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [excelData, setExcelData] = useState([]); // State to store Excel data

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
      // FileReader API to read the uploaded file
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        // Assume the first sheet is the one you want to parse
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert the sheet data to JSON (array of objects)
        const data = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(data); // Update the state with the parsed Excel data
        setMessage('File uploaded successfully');
      };

      // Read the file as binary string
      reader.readAsBinaryString(file);
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>

      {/* Display the table if excelData is available */}
      {excelData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(excelData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileUpload;
