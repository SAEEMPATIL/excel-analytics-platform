import React, { useState, useEffect } from 'react';

const AISummaries = ({ data }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setTimeout(() => {
      setSummary(`Summary for data with ${data?.length || 0} entries: steady growth observed.`);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateSummary();
  }, [data]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AI Data Summary</h2>
      {loading ? (
        <p>Generating summary...</p>
      ) : (
        <>
          <p className="bg-gray-100 p-4 rounded text-gray-700">{summary}</p>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Regenerate Summary'}
          </button>
        </>
      )}
    </div>
  );
};

export default AISummaries;
