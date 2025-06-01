import React, { useState, useEffect } from 'react';

const AISummaries = ({ data }) => {
  const [summary, setSummary] = useState('');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // <-- toggle for showing summary

  const generateInsights = (data) => {
    if (!data || data.length === 0) return ['No data available for insights.'];

    const values = data.map(item => item.value || 0);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = (total / values.length).toFixed(2);
    const max = Math.max(...values);
    const min = Math.min(...values);

    return [
      `🔍 Total Entries: ${values.length}`,
      `📈 Average Value: ${avg}`,
      `🔺 Highest Value: ${max}`,
      `🔻 Lowest Value: ${min}`
    ];
  };

  const generateSummary = () => {
    setLoading(true);
    setTimeout(() => {
      setSummary(`Summary for data with ${data?.length || 0} entries: steady growth observed.`);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (data) {
      setInsights(generateInsights(data));
    }
  }, [data]);

  const handleShowSummary = () => {
    setShowSummary(true);
    generateSummary();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Data Insights</h2>

      {/* Insights Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📊 Insights</h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>

        {!showSummary && (
          <button
            onClick={handleShowSummary}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show AI Summary
          </button>
        )}
      </div>

      {/* Conditional Summary Section */}
      {showSummary && (
        <div>
          <h3 className="text-lg font-semibold mb-2">🤖 AI Summary</h3>
          {loading ? (
            <p>Generating summary...</p>
          ) : (
            <>
              <p className="bg-gray-100 p-4 rounded text-gray-700">{summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISummaries;
