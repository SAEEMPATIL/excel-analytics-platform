import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';

const ELEMENTS = [
  { id: 'line-chart', label: '📈 Line Chart' },
  { id: 'bar-chart', label: '📊 Bar Chart' },
  { id: 'data-table', label: '📋 Data Table' },
  { id: 'summary-box', label: '🧠 AI Summary' }
];

const ElementIntegration = ({ data }) => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // Basic data checks
  const xKey = data?.length ? Object.keys(data[0])[0] : null; // e.g. 'Month'
  // Pick first numeric column for charts
  const yKey = data?.length
    ? Object.keys(data[0]).find(key => typeof data[0][key] === 'number')
    : null;

  const toggleElement = (id) => {
    setSelectedElements(prev =>
      prev.includes(id)
        ? prev.filter(el => el !== id)
        : [...prev, id]
    );
  };

  const generateSummary = () => {
    if (!data || !data.length || !yKey) {
      setSummary('No valid data to summarize.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Simple summary: avg, max, min of yKey values
      const values = data.map(row => row[yKey]);
      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
      const max = Math.max(...values);
      const min = Math.min(...values);
      setSummary(`Summary of "${yKey}": Avg = ${avg}, Max = ${max}, Min = ${min}.`);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    if (selectedElements.includes('summary-box')) {
      generateSummary();
    }
  }, [selectedElements, data]);

  if (!data || !data.length) {
    return <p className="p-6 text-red-600">No data available to display elements.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧩 Element Integration</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        {ELEMENTS.map(el => (
          <button
            key={el.id}
            onClick={() => toggleElement(el.id)}
            className={`px-4 py-2 rounded ${
              selectedElements.includes(el.id)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {el.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {selectedElements.includes('line-chart') && xKey && yKey && (
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Line Chart ({yKey} over {xKey})</h3>
            <LineChart width={500} height={300} data={data}>
              <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        )}

        {selectedElements.includes('bar-chart') && xKey && yKey && (
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Bar Chart ({yKey} over {xKey})</h3>
            <BarChart width={500} height={300} data={data}>
              <Bar dataKey={yKey} fill="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
            </BarChart>
          </div>
        )}

        {selectedElements.includes('data-table') && (
          <div className="p-4 bg-white rounded shadow overflow-x-auto">
            <h3 className="font-semibold mb-2">Data Table</h3>
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="px-4 py-2 border">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(row).map((key) => (
                      <td key={key} className="px-4 py-2 border">{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedElements.includes('summary-box') && (
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">AI Summary</h3>
            {loading ? (
              <p className="text-gray-500 italic">Generating summary...</p>
            ) : (
              <p className="text-gray-700">{summary}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementIntegration;
