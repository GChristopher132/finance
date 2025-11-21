"use client"; // We need a client component to handle state and user input

import { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format as formatDate } from 'date-fns';
import { Loader2, AlertCircle, Download, Settings, BarChart2, Table } from 'lucide-react';
import { getStockData } from './getStockData'; // This is our new Server Action

// Helper to get a date string in YYYY-MM-DD format
const toYYYYMMDD = (date) => formatDate(date, 'yyyy-MM-dd');

// Get default dates
const defaultEndDate = toYYYYMMDD(new Date());
const defaultStartDate = toYYYYMMDD(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));

// Main App Component
export default function StockAnalysisPage() {
  // State for user inputs
  const [tickers, setTickers] = useState("AAPL, MSFT, GOOG, NVDA");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [frequency, setFrequency] = useState("1d");
  const [addMetrics, setAddMetrics] = useState(true);
  
  // State for app status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  
  // State for data
  const [allData, setAllData] = useState(null); // Will hold { "AAPL": [...], "MSFT": [...] }
  const [companyInfo, setCompanyInfo] = useState(null); // Will hold { "AAPL": {...}, "MSFT": {...} }
  const [collatedMetric, setCollatedMetric] = useState('Close');

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAllData(null);
    setCompanyInfo(null);

    // Basic validation
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await getStockData(tickers, startDate, endDate, frequency, addMetrics);
      
      if (result.error) {
        setError(result.error);
      } else {
        setAllData(result.allData);
        setCompanyInfo(result.companyInfo);
        setCollatedMetric(addMetrics ? '% Change' : 'Close'); // Default to % Change if available
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  // Memoized data for charts and tables to prevent re-calculating on every render
  const chartData = useMemo(() => {
    if (!allData) return [];
    
    // Combine data for Recharts: { date: '...', AAPL: 150.00, MSFT: 300.00 }
    const combined = {};
    Object.entries(allData).forEach(([ticker, data]) => {
      data.forEach(row => {
        const dateStr = formatDate(new Date(row.date), 'yyyy-MM-dd');
        if (!combined[dateStr]) {
          combined[dateStr] = { date: dateStr };
        }
        combined[dateStr][ticker] = row[collatedMetric];
      });
    });
    return Object.values(combined).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allData, collatedMetric]);

  const collatedData = useMemo(() => {
    if (!allData) return [];
    
    // Similar to chartData, but for the collated table
    const combined = {};
    const dates = new Set();
    
    Object.entries(allData).forEach(([ticker, data]) => {
      data.forEach(row => {
        const dateStr = formatDate(new Date(row.date), 'yyyy-MM-dd');
        dates.add(dateStr);
        if (!combined[dateStr]) {
          combined[dateStr] = { date: dateStr };
        }
        combined[dateStr][ticker] = row[collatedMetric];
      });
    });
    
    return Array.from(dates)
      .map(date => combined[date])
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending for table view
  }, [allData, collatedMetric]);

  // Helper to generate random bright colors for the chart
  const colors = useMemo(() => {
    if (!allData) return [];
    const colorPalette = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return Object.keys(allData).reduce((acc, ticker, index) => {
      acc[ticker] = colorPalette[index % colorPalette.length];
      return acc;
    }, {});
  }, [allData]);

  // Function to download data as CSV
  const downloadCSV = (dataToDownload, fileName) => {
    if (!dataToDownload || dataToDownload.length === 0) return;
    
    const headers = Object.keys(dataToDownload[0]);
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen">
      {/* --- Page Header --- */}
      <section className="w-full bg-gray-100 py-12 px-6 sm:px-10 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-[#0A437B] md:text-5xl">
          Stock Analysis Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-700 md:text-xl max-w-3xl mx-auto">
          An interactive tool to analyze and visualize historical stock data, running natively on our site.
        </p>
      </section>

      {/* --- Main Content (Sidebar + Content Area) --- */}
      <div className="flex flex-col md:flex-row flex-grow w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* --- Sidebar (Form) --- */}
        <form onSubmit={handleSubmit} className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit">
          <h2 className="text-2xl font-semibold text-[#0A2342] mb-5 border-b pb-3 flex items-center">
            <Settings className="w-6 h-6 mr-2" /> Query Parameters
          </h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="tickers" className="block text-sm font-medium text-gray-700 mb-1">
                Tickers (comma or space separated)
              </label>
              <textarea
                id="tickers"
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9]"
                placeholder="AAPL, MSFT, GOOG..."
              />
            </div>
            
            <div className="flex space-x-3">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9]"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9]"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] bg-white"
              >
                <option value="1d">Daily</option>
                <option value="1wk">Weekly</option>
                <option value="1mo">Monthly</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="addMetrics"
                type="checkbox"
                checked={addMetrics}
                onChange={(e) => setAddMetrics(e.target.checked)}
                className="h-4 w-4 text-[#0A437B] border-gray-300 rounded focus:ring-[#5097C9]"
              />
              <label htmlFor="addMetrics" className="ml-2 block text-sm text-gray-900">
                Add Performance Metrics (% Change, SMA)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-[#0A437B] text-white text-base font-semibold rounded-lg shadow-lg hover:bg-[#5097C9] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Get Stock Data'
              )}
            </button>
          </div>
        </form>

        {/* --- Main Content Area (Tabs) --- */}
        <div className="flex-grow bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center px-5 py-3 -mb-px text-sm font-medium border-b-2 ${
                activeTab === 'chart' 
                  ? 'border-[#0A437B] text-[#0A437B]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart2 className="w-5 h-5 mr-2" /> Performance Chart
            </button>
            <button
              onClick={() => setActiveTab('collated')}
              className={`flex items-center px-5 py-3 -mb-px text-sm font-medium border-b-2 ${
                activeTab === 'collated' 
                  ? 'border-[#0A437B] text-[#0A437B]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="w-5 h-5 mr-2" /> Collated View
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`flex items-center px-5 py-3 -mb-px text-sm font-medium border-b-2 ${
                activeTab === 'detailed' 
                  ? 'border-[#0A437B] text-[#0A437B]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="w-5 h-5 mr-2" /> Detailed Data
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[60vh]">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-[#0A437B]" />
                <p className="ml-3 text-lg text-gray-600">Fetching data...</p>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col items-center justify-center h-64 bg-red-50 p-4 rounded-lg border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="mt-3 text-lg font-semibold text-red-700">An Error Occurred</p>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {!isLoading && !error && !allData && (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500">Please enter tickers and click "Get Stock Data" to begin.</p>
              </div>
            )}

            {allData && (
              <>
                {/* Chart Tab Content */}
                <div className={activeTab === 'chart' ? 'block' : 'hidden'}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#0A2342]">
                      Performance Comparison: {collatedMetric}
                    </h3>
                    {/* Metric selector for the chart */}
                    <select
                      value={collatedMetric}
                      onChange={(e) => setCollatedMetric(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] bg-white"
                    >
                      {allData && Object.keys(allData[Object.keys(allData)[0]][0]).filter(k => k !== 'date').map(metric => (
                        <option key={metric} value={metric}>{metric}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '100%', height: 500 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="date" tickFormatter={(tick) => formatDate(new Date(tick), 'MMM yyyy')} />
                        <YAxis yAxisId="left" tickFormatter={(tick) => `${collatedMetric.includes('%') ? '' : '$'}${tick.toFixed(0)}${collatedMetric.includes('%') ? '%' : ''}`} />
                        <Tooltip 
                          formatter={(value, name) => [`${collatedMetric.includes('%') ? '' : '$'}${Number(value).toFixed(2)}${collatedMetric.includes('%') ? '%' : ''}`, name]}
                          labelFormatter={(label) => formatDate(new Date(label), 'MMM dd, yyyy')}
                        />
                        <Legend />
                        {Object.keys(allData).map(ticker => (
                          <Line 
                            key={ticker} 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey={ticker} 
                            stroke={colors[ticker]} 
                            dot={false} 
                            strokeWidth={2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Collated Tab Content */}
                <div className={activeTab === 'collated' ? 'block' : 'hidden'}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#0A2342]">
                      Collated Data by Metric: {collatedMetric}
                    </h3>
                    <div className="flex items-center space-x-4">
                      {/* Metric selector for the table */}
                      <select
                        value={collatedMetric}
                        onChange={(e) => setCollatedMetric(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] bg-white"
                      >
                        {allData && Object.keys(allData[Object.keys(allData)[0]][0]).filter(k => k !== 'date').map(metric => (
                          <option key={metric} value={metric}>{metric}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => downloadCSV(collatedData, `collated_${collatedMetric}.csv`)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download CSV
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          {allData && Object.keys(allData).map(ticker => (
                            <th key={ticker} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ticker}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {collatedData.map(row => (
                          <tr key={row.date}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.date}</td>
                            {Object.keys(allData).map(ticker => (
                              <td key={ticker} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {row[ticker] !== undefined ? (collatedMetric.includes('%') ? '' : '$') + Number(row[ticker]).toFixed(2) + (collatedMetric.includes('%') ? '%' : '') : 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Detailed Data Tab Content */}
                <div className={activeTab === 'detailed' ? 'block' : 'hidden'}>
                  <h3 className="text-xl font-semibold text-[#0A2342] mb-4">
                    Detailed Data by Ticker
                  </h3>
                  {allData && Object.keys(allData).map(ticker => (
                    <div key={ticker} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-[#0A437B]">
                          {ticker} - <span className="text-gray-600 font-normal">{companyInfo[ticker]?.companyName || ''}</span>
                        </h4>
                        <button
                          onClick={() => downloadCSV(allData[ticker], `${ticker}_data.csv`)}
                          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
                        >
                          <Download className="w-3 h-3 mr-1.5" /> Download
                        </button>
                      </div>
                      <div className="overflow-x-auto max-h-[40vh]">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              {Object.keys(allData[ticker][0]).map(header => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {allData[ticker].map((row, idx) => (
                              <tr key={idx}>
                                {Object.keys(row).map(key => (
                                  <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {key === 'date' ? formatDate(new Date(row.date), 'yyyy-MM-dd') : (typeof row[key] === 'number' ? row[key].toFixed(2) : row[key])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
