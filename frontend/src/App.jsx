// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  // Fetch upload configuration
  const fetchConfig = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/config');
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  // Fetch documents history
  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/documents');
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setResult(null); // Clear previous results
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Client-side validation
    const maxSize = config ? config.max_file_size_mb * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (selectedFile.size > maxSize) {
      setError(`File too large! Maximum size is ${config?.max_file_size_mb || 10}MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`);
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError('File is empty. Please select a valid file.');
      setFile(null);
      setPreview(null);
      return;
    }

    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    const allowedExts = config?.allowed_extensions || ['.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'];
    
    if (!allowedExts.includes(fileExt)) {
      setError(`File type not allowed. Allowed types: ${allowedExts.join(', ')}`);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    
    // Create preview for images only (not PDFs)
    if (['.png', '.jpg', '.jpeg', '.bmp', '.tiff'].includes(fileExt)) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // No preview for PDFs
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/process', formData);
      setResult(response.data);
      fetchStats(); // Refresh stats after upload
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.detail || 'Processing failed. Please try again.';
      setError(errorMsg);
      setResult(null);
    }
    setLoading(false);
  };

  if (showHistory) {
    return <HistoryView documents={documents} onBack={() => setShowHistory(false)} fetchDocuments={fetchDocuments} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header with History Button */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="w-32"></div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelligent Document Processing
            </h1>
            <button
              onClick={() => {
                fetchDocuments();
                setShowHistory(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all hover:scale-105"
            >
              📚 History
            </button>
          </div>
          <p className="text-xl text-gray-300">
            Extract data from invoices instantly using AI-powered OCR
          </p>
        </div>
          
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Upload Document</h2>
            
            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              error 
                ? 'border-red-400/50 bg-red-500/10' 
                : 'border-purple-400/50 hover:border-purple-400 hover:bg-white/5'
            }`}>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="text-7xl mb-4">{error ? '⚠️' : file ? '✅' : '📎'}</div>
                <p className="text-lg text-gray-200 mb-2 font-medium">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-400">
                  {config 
                    ? `${config.allowed_extensions.join(', ').toUpperCase()} up to ${config.max_file_size_mb}MB`
                    : 'Loading configuration...'
                  }
                </p>
                {file && !error && (
                  <p className="text-xs text-green-400 mt-3 font-semibold">
                    ✓ {(file.size / 1024).toFixed(1)}KB - Ready to process
                  </p>
                )}
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-400/50 rounded-xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="text-red-300 font-semibold">Upload Failed</p>
                    <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview for Images */}
            {preview && !error && (
              <div className="mt-6 animate-fade-in">
                <p className="text-sm text-gray-300 mb-3 font-medium">Preview:</p>
                <img
                  src={preview}
                  alt="Document preview"
                  className="w-full rounded-xl border-2 border-white/20 shadow-lg max-h-96 object-contain bg-white/5"
                />
              </div>
            )}

            {/* PDF Notice */}
            {file && file.name.toLowerCase().endsWith('.pdf') && !error && (
              <div className="mt-6 bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-blue-300 font-semibold">PDF Detected</p>
                    <p className="text-blue-400/80 text-sm mt-1">Will process first page only</p>
                  </div>
                </div>
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading || error}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Document...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  ⚡ Process Document
                </span>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Extracted Data</h2>
            
            {result ? (
              <div className="space-y-4 animate-fade-in">
                {/* Success Badge */}
                <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 backdrop-blur">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">✅</span>
                    <div>
                      <p className="text-green-300 font-semibold text-lg">Processing Complete</p>
                      <p className="text-green-400/70 text-sm">Data extracted in {result.processing_time}s</p>
                    </div>
                  </div>
                </div>

                {/* Extracted Fields */}
                <div className="space-y-3">
                  <DataField
                    label="Invoice Number"
                    value={result.extracted_fields.invoice_number}
                    icon="🔢"
                  />
                  <DataField
                    label="Date"
                    value={result.extracted_fields.date}
                    icon="📅"
                  />
                  <DataField
                    label="Vendor Name"
                    value={result.extracted_fields.vendor_name}
                    icon="🏢"
                  />
                  <DataField
                    label="Total Amount"
                    value={result.extracted_fields.total}
                    icon="💰"
                    highlight
                  />
                </div>

                {/* File Info */}
                {result.file_size_mb && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-gray-400">
                      📦 File Size: <span className="text-white font-semibold">{result.file_size_mb}MB</span>
                    </p>
                  </div>
                )}

                {/* Raw Text Accordion */}
                <details className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                  <summary className="cursor-pointer font-medium text-gray-200 hover:text-white transition-colors">
                    📝 View Raw Extracted Text
                  </summary>
                  <pre className="mt-4 text-xs bg-black/30 p-4 rounded-lg border border-white/10 overflow-x-auto whitespace-pre-wrap text-gray-300 font-mono max-h-96">
                    {result.raw_text}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <div className="text-7xl mb-4 opacity-50">📊</div>
                <p className="text-lg">Upload a document to see extracted data</p>
                <p className="text-sm text-gray-500 mt-2">Supports invoices, receipts, and business documents</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        {stats && (
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Platform Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <StatCard number={stats.total_documents} label="Documents Processed" />
              <StatCard number={`$${stats.total_amount_processed.toLocaleString()}`} label="Transactions Handled" />
              <StatCard number={`${stats.average_processing_time.toFixed(1)}s`} label="Avg Processing Time" />
              <StatCard number={`${stats.accuracy_rate}%`} label="Accuracy Rate" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// History View Component
function HistoryView({ documents, onBack, fetchDocuments }) {
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Document History</h1>
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 hover:scale-105 transition-all"
          >
            ← Back
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <p className="text-xl text-gray-300">No documents processed yet</p>
            <p className="text-sm text-gray-500 mt-2">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Filename</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Invoice #</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Total</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Vendor</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Time</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-300">#{doc.id}</td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={doc.filename}>
                        {doc.filename}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{doc.invoice_number || '-'}</td>
                      <td className="px-6 py-4 text-gray-300">{doc.date || '-'}</td>
                      <td className="px-6 py-4 text-green-400 font-semibold">{doc.total || '-'}</td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={doc.vendor_name}>
                        {doc.vendor_name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {doc.processing_time ? `${doc.processing_time.toFixed(2)}s` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'success' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white/5 px-6 py-4 border-t border-white/10">
              <p className="text-sm text-gray-400 text-center">
                Total: <span className="text-white font-semibold">{documents.length}</span> documents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Components
function DataField({ label, value, icon, highlight }) {
  return (
    <div className={`p-5 rounded-xl border transition-all ${
      highlight 
        ? 'bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-500/20' 
        : 'bg-white/5 border-white/10'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
      </div>
      <p className={`text-xl font-bold ${
        value 
          ? highlight ? 'text-purple-300' : 'text-white'
          : 'text-red-400'
      }`}>
        {value || 'Not detected'}
      </p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="p-4 hover:bg-white/5 rounded-xl transition-colors">
      <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {number}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

export default App;