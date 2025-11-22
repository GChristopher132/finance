"use client";

import { useState, useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { Settings, FileSpreadsheet, FileText, User, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export default function RetirementPlannerPage() {
  // --- State: User Inputs ---
  const [inputs, setInputs] = useState({
    // Person 1
    firstName1: "John",
    lastName1: "Smith",
    currentAge1: 30,
    
    // Person 2 (Optional)
    firstName2: "Jane",
    lastName2: "Doe",
    currentAge2: 28,
    
    // Financials
    retirementAge: 65, 
    currentSavings: 75000,
    annualSavings: 25000,
    annualSavingsIncrease: 1.0,
    preRetirementReturn: 6.75,
    postRetirementReturn: 4.0,
    currentExpenses: 60000,
    inflationRate: 2.5,
    lifeExpectancy: 100
  });

  const [activeTab, setActiveTab] = useState('chart');
  const [selectedChart, setSelectedChart] = useState('netWorth');

  // --- Input Handler ---
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      if (value === '') setInputs(prev => ({ ...prev, [name]: '' }));
      else setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const val = (key) => {
    const v = inputs[key];
    return (v === '' || isNaN(v)) ? 0 : v;
  };

  // --- Household Name ---
  const householdName = useMemo(() => {
    const f1 = inputs.firstName1.trim();
    const l1 = inputs.lastName1.trim();
    const f2 = inputs.firstName2.trim();
    const l2 = inputs.lastName2.trim();
    if (!f1) return "Retirement Projection"; 
    if (!f2) return `${f1} ${l1}`;
    if (l1.toLowerCase() === l2.toLowerCase()) return `${f1} and ${f2} ${l1}`;
    return `${f1} ${l1} and ${f2} ${l2}`;
  }, [inputs]);

  // --- Calculation Logic ---
  const projectionData = useMemo(() => {
    const data = [];
    let beginningBalance = val('currentSavings');
    let savings = val('annualSavings');
    let expenses = val('currentExpenses');
    let currentYear = new Date().getFullYear();
    
    let totalPrincipal = val('currentSavings'); 

    let age1 = val('currentAge1');
    let age2 = val('currentAge2');
    const maxAge = val('lifeExpectancy');
    const retireAge = val('retirementAge');

    for (let a1 = age1; a1 <= maxAge; a1++) {
      const isRetired = a1 >= retireAge;
      const growthRatePct = isRetired ? val('postRetirementReturn') : val('preRetirementReturn');
      const growthRate = growthRatePct / 100;
      
      const yearSavings = isRetired ? 0 : savings;
      const yearRetirementCost = isRetired ? expenses : 0;

      const investmentReturns = (beginningBalance + yearSavings - yearRetirementCost) * growthRate;
      const endBalance = beginningBalance + yearSavings - yearRetirementCost + investmentReturns;
      
      totalPrincipal += yearSavings;
      const displayPrincipal = Math.min(totalPrincipal, endBalance);
      const displayGrowth = Math.max(0, endBalance - displayPrincipal);

      const withdrawalRate = (isRetired && beginningBalance > 0) 
        ? (yearRetirementCost / beginningBalance) 
        : 0;

      const passiveIncome = beginningBalance * growthRate;

      data.push({
        year: currentYear,
        age1: a1,
        age2: age2 + (a1 - age1),
        beginningBalance,
        annualSavings: yearSavings,
        growthRate: growthRatePct / 100,
        retirementCost: yearRetirementCost,
        endBalance,
        costOfLiving: expenses,
        passiveIncome,
        investmentReturns,
        totalPrincipal: displayPrincipal,
        totalGrowth: displayGrowth,
        withdrawalRate,
        isRetired
      });

      beginningBalance = endBalance;
      currentYear++;
      savings = savings * (1 + (val('annualSavingsIncrease') / 100));
      expenses = expenses * (1 + (val('inflationRate') / 100));
    }
    return data;
  }, [inputs]);

  const fmtCurr = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const fmtPct = (num) => (num * 100).toFixed(2) + '%';

  // --- PDF Export (Strict Visual Match) ---
  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Title & Header
    doc.setFontSize(16);
    doc.setTextColor(10, 67, 123); // Brand Blue
    doc.text(householdName, 14, 15); 

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Assumptions: Savings Increase ${val('annualSavingsIncrease')}% | Inflation ${val('inflationRate')}%`, 14, 22);

    // Headers
    const p1Header = inputs.firstName1 || "Age 1";
    const p2Header = inputs.firstName2 ? (inputs.firstName2 || "Age 2") : null;

    const columns = [
      { header: "Year", dataKey: "year" },
      { header: p1Header, dataKey: "age1" },
      ...(p2Header ? [{ header: p2Header, dataKey: "age2" }] : []),
      { header: "Beg. Value", dataKey: "beg" },
      { header: "Savings", dataKey: "sav" },
      { header: "Growth", dataKey: "rate" },
      { header: "Ret. Cost", dataKey: "cost" },
      { header: "End Value", dataKey: "end" },
      { header: "Expenses", dataKey: "col" }
    ];

    const body = projectionData.map(row => ({
      year: row.year,
      age1: row.age1,
      age2: row.age2,
      beg: fmtCurr(row.beginningBalance),
      sav: row.annualSavings > 0 ? fmtCurr(row.annualSavings) : "-",
      rate: fmtPct(row.growthRate),
      cost: row.retirementCost > 0 ? `(${fmtCurr(row.retirementCost)})` : "-",
      end: fmtCurr(row.endBalance),
      col: fmtCurr(row.costOfLiving),
      raw: row 
    }));

    // 1. Generate Table
    autoTable(doc, {
      columns, 
      body, 
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2, halign: 'right' },
      columnStyles: { 
        year: { halign: 'left' }, 
        age1: { halign: 'left' }, 
        age2: { halign: 'left' } 
      },
      headStyles: { fillColor: [10, 67, 123], halign: 'right' },
      
      // Visual Logic (Colors)
      didParseCell: (data) => {
        if (data.section === 'body') {
          const row = data.row.raw.raw;
          
          // Yellow Background for Retirement Year
          if (row.age1 === val('retirementAge')) {
            data.cell.styles.fillColor = [255, 249, 196]; // Yellow-100
          }

          // Text Colors
          if (data.column.dataKey === 'sav' && row.annualSavings > 0) {
            data.cell.styles.textColor = [22, 163, 74]; // Green-600
          }
          if (data.column.dataKey === 'cost' && row.retirementCost > 0) {
            data.cell.styles.textColor = [220, 38, 38]; // Red-600
          }
          if (data.column.dataKey === 'end') {
            data.cell.styles.textColor = [10, 67, 123]; // Brand Blue
            data.cell.styles.fontStyle = 'bold';
          }
          if (data.column.dataKey === 'col') {
            data.cell.styles.textColor = [107, 114, 128]; // Gray-500
          }
        }
      }
    });

    // 2. Append Charts at Bottom
    const chartIDs = ['pdf-chart-netWorth', 'pdf-chart-compounding', 'pdf-chart-cashFlow', 'pdf-chart-withdrawal'];
    const chartTitles = ['Net Worth Projection', 'Principal vs Growth', 'Income vs Expenses', 'Withdrawal Rate Risk'];
    
    let currentY = doc.lastAutoTable.finalY + 10; 
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 0; i < chartIDs.length; i++) {
        const element = document.getElementById(chartIDs[i]);
        if (!element) continue;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (currentY + imgHeight + 10 > pageHeight) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(10, 67, 123);
        doc.text(chartTitles[i], 14, currentY);
        currentY += 5;

        doc.addImage(imgData, 'PNG', 15, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 15;
    }

    doc.save(`${householdName.replace(/\s+/g, '_')}_Report.pdf`);
  };

  // --- Excel Export (Strict Visual Match) ---
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projection');

    worksheet.columns = [
      { header: 'Year', key: 'year', width: 10 },
      { header: inputs.firstName1 || 'Age 1', key: 'age1', width: 8 },
      ...(inputs.firstName2 ? [{ header: inputs.firstName2, key: 'age2', width: 8 }] : []),
      { header: 'Beginning Value', key: 'beg', width: 18 },
      { header: 'Annual Savings', key: 'sav', width: 18 },
      { header: 'Growth Rate', key: 'rate', width: 12 }, // Added to match PDF format
      { header: 'Annual Ret. Cost', key: 'cost', width: 20 },
      { header: 'End of Year Value', key: 'end', width: 20 },
      { header: 'Cost of Living', key: 'col', width: 20 },
    ];

    // Title Row
    worksheet.insertRow(1, [householdName]);
    worksheet.mergeCells(1, 1, 1, inputs.firstName2 ? 9 : 8);
    worksheet.getRow(1).font = { size: 16, bold: true, color: { argb: 'FF0A437B' } };
    
    // Header Row
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A437B' } };
    
    projectionData.forEach(row => {
      const newRow = worksheet.addRow({
        year: row.year,
        age1: row.age1,
        age2: inputs.firstName2 ? row.age2 : null,
        beg: row.beginningBalance,
        sav: row.annualSavings,
        rate: row.growthRate,
        cost: row.retirementCost > 0 ? -row.retirementCost : 0,
        end: row.endBalance,
        col: row.costOfLiving
      });

      // Retirement Year Highlight
      if (row.age1 === val('retirementAge')) {
        newRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } }; // Light Yellow
        newRow.border = { top: { style: 'medium', color: { argb: 'FFEAB308' } }, bottom: { style: 'medium', color: { argb: 'FFEAB308' } } };
      }

      // Formats
      ['beg', 'sav', 'cost', 'end', 'col'].forEach(k => newRow.getCell(k).numFmt = '"$"#,##0');
      newRow.getCell('rate').numFmt = '0.00%';
      
      // Negative/Cost Red Formatting (Parentheses handled by custom format string in real excel if needed, but color is key)
      newRow.getCell('cost').numFmt = '"($"#,##0)'; 

      // Text Colors
      if (row.annualSavings > 0) newRow.getCell('sav').font = { color: { argb: 'FF16A34A' } }; // Green
      if (row.retirementCost > 0) newRow.getCell('cost').font = { color: { argb: 'FFDC2626' } }; // Red
      newRow.getCell('end').font = { color: { argb: 'FF0A437B' }, bold: true }; // Blue
      newRow.getCell('col').font = { color: { argb: 'FF6B7280' } }; // Gray
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${householdName.replace(/\s+/g, '_')}_Projection.xlsx`);
  };

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen">
      <section className="w-full bg-gray-100 py-12 px-6 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-[#0A437B]">Retirement Planner</h1>
        <p className="mt-2 text-lg text-gray-700">Financial Projection Model</p>
      </section>

      <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto p-4 lg:p-8 gap-6">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold text-[#0A2342] mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" /> Inputs
          </h2>
          <div className="space-y-4">
            {/* People */}
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center"><User className="w-4 h-4 mr-1"/> Person 1</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input placeholder="First" name="firstName1" value={inputs.firstName1} onChange={handleInputChange} className="w-full p-2 text-sm border rounded" />
                <input placeholder="Last" name="lastName1" value={inputs.lastName1} onChange={handleInputChange} className="w-full p-2 text-sm border rounded" />
              </div>
              <label className="text-xs font-medium text-gray-500">Age</label>
              <input type="number" name="currentAge1" value={inputs.currentAge1} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center"><User className="w-4 h-4 mr-1"/> Person 2 (Optional)</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input placeholder="First" name="firstName2" value={inputs.firstName2} onChange={handleInputChange} className="w-full p-2 text-sm border rounded" />
                <input placeholder="Last" name="lastName2" value={inputs.lastName2} onChange={handleInputChange} className="w-full p-2 text-sm border rounded" />
              </div>
              <label className="text-xs font-medium text-gray-500">Age</label>
              <input type="number" name="currentAge2" value={inputs.currentAge2} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>

            <hr className="border-gray-200 my-2" />
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Retirement Age (P1)</label><input type="number" name="retirementAge" value={inputs.retirementAge} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5097C9]" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Current Portfolio ($)</label><input type="number" name="currentSavings" value={inputs.currentSavings} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5097C9]" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Annual Savings ($)</label><input type="number" name="annualSavings" value={inputs.annualSavings} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5097C9]" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs font-medium text-gray-500">Pre-Ret Return %</label><input type="number" name="preRetirementReturn" value={inputs.preRetirementReturn} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
              <div><label className="text-xs font-medium text-gray-500">Post-Ret Return %</label><input type="number" name="postRetirementReturn" value={inputs.postRetirementReturn} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Current Expenses ($)</label><input type="number" name="currentExpenses" value={inputs.currentExpenses} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5097C9]" /></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 justify-between items-center">
            <div className="flex">
              <button onClick={() => setActiveTab('chart')} className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'chart' ? 'border-[#0A437B] text-[#0A437B]' : 'border-transparent text-gray-500'}`}>Charts</button>
              <button onClick={() => setActiveTab('table')} className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'table' ? 'border-[#0A437B] text-[#0A437B]' : 'border-transparent text-gray-500'}`}>Data Table</button>
            </div>
            <div className="flex space-x-2">
                <button onClick={exportToPDF} className="flex items-center px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 transition border border-red-200">
                  <FileText className="w-4 h-4 mr-2" /> PDF Report
                </button>
                <button onClick={exportToExcel} className="flex items-center px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 transition border border-green-200">
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                </button>
            </div>
          </div>

          {/* --- CHART SECTION --- */}
          <div className={activeTab === 'chart' ? 'block' : 'hidden'}>
            <div className="mb-6">
              <div className="relative inline-block w-full sm:w-64">
                <select 
                  value={selectedChart} 
                  onChange={(e) => setSelectedChart(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline font-medium text-[#0A437B]"
                >
                  <option value="netWorth">Net Worth Mountain</option>
                  <option value="compounding">Power of Compounding</option>
                  <option value="cashFlow">Financial Independence</option>
                  <option value="withdrawal">Withdrawal Rate Risk</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {selectedChart === 'netWorth' && (
               <div className="h-[400px] w-full">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">{householdName} - Net Worth</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#0A437B" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#0A437B" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="age1" label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} />
                     <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                     <Tooltip formatter={(val) => fmtCurr(val)} labelFormatter={(label) => `Age ${label}`} />
                     <ReferenceLine x={val('retirementAge')} stroke="red" strokeDasharray="3 3" label="Retirement" />
                     <Area type="monotone" dataKey="endBalance" stroke="#0A437B" fillOpacity={1} fill="url(#colorBalance)" name="Portfolio Value" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            )}

            {selectedChart === 'compounding' && (
               <div className="h-[400px] w-full">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">The Power of Compounding</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="age1" />
                     <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                     <Tooltip formatter={(val) => fmtCurr(val)} labelFormatter={(label) => `Age ${label}`} />
                     <Legend />
                     <Bar dataKey="totalPrincipal" stackId="a" fill="#10B981" name="Total Contributions" />
                     <Bar dataKey="totalGrowth" stackId="a" fill="#3B82F6" name="Investment Growth" />
                     <ReferenceLine x={val('retirementAge')} stroke="red" strokeDasharray="3 3" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            )}

            {selectedChart === 'cashFlow' && (
               <div className="h-[400px] w-full">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Financial Independence Crossover</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="age1" />
                     <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                     <Tooltip formatter={(val) => fmtCurr(val)} labelFormatter={(label) => `Age ${label}`} />
                     <Legend />
                     <Line type="monotone" dataKey="passiveIncome" stroke="#10B981" strokeWidth={3} name="Passive Income" dot={false} />
                     <Line type="monotone" dataKey="costOfLiving" stroke="#EF4444" strokeWidth={3} name="Expenses" dot={false} />
                     <ReferenceLine x={val('retirementAge')} stroke="gray" strokeDasharray="3 3" label="Retire" />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            )}

             {selectedChart === 'withdrawal' && (
               <div className="h-[400px] w-full">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Withdrawal Rate Risk</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={projectionData.filter(d => d.isRetired)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="age1" />
                     <YAxis unit="%" />
                     <Tooltip formatter={(val) => fmtPct(val)} labelFormatter={(label) => `Age ${label}`} />
                     <Legend />
                     <ReferenceLine y={0.04} stroke="green" strokeDasharray="3 3" label="4% Safe Rule" />
                     <ReferenceLine y={0.08} stroke="orange" strokeDasharray="3 3" label="Danger Zone" />
                     <Line type="monotone" dataKey="withdrawalRate" stroke="#8B5CF6" strokeWidth={3} name="Withdrawal Rate %" dot={false} />
                   </ComposedChart>
                 </ResponsiveContainer>
               </div>
            )}
          </div>

          {/* --- TABLE SECTION --- */}
          <div className={activeTab === 'table' ? 'block' : 'hidden'}>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-gray-600">Year</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-600">{inputs.firstName1 || 'Age 1'}</th>
                    {inputs.firstName2 && <th className="px-3 py-3 text-left font-semibold text-gray-600">{inputs.firstName2}</th>}
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">Beg. Value</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">Savings</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">Ret. Cost</th>
                    <th className="px-3 py-3 text-right font-semibold text-[#0A437B]">End Value</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">Expenses</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectionData.map((row) => (
                    <tr key={row.year} className={row.age1 === val('retirementAge') ? "bg-yellow-50 border-t-2 border-yellow-200" : "hover:bg-gray-50"}>
                      <td className="px-3 py-2 text-gray-900">{row.year}</td>
                      <td className="px-3 py-2 text-gray-900 font-medium">{row.age1}</td>
                      {inputs.firstName2 && <td className="px-3 py-2 text-gray-500">{row.age2}</td>}
                      <td className="px-3 py-2 text-right text-gray-500">{fmtCurr(row.beginningBalance)}</td>
                      <td className="px-3 py-2 text-right text-green-600">{row.annualSavings > 0 ? fmtCurr(row.annualSavings) : '-'}</td>
                      <td className="px-3 py-2 text-right text-red-500">{row.retirementCost > 0 ? `(${fmtCurr(row.retirementCost)})` : '-'}</td>
                      <td className={`px-3 py-2 text-right font-bold ${row.endBalance < 0 ? 'text-red-600' : 'text-[#0A437B]'}`}>
                        {fmtCurr(row.endBalance)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-400">{fmtCurr(row.costOfLiving)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN OFF-SCREEN AREA FOR PDF CAPTURE --- */}
      <div 
        style={{ 
            position: 'fixed', 
            left: '-10000px', 
            top: 0, 
            width: '800px', 
            height: 'auto',
            visibility: 'visible'
        }}
      >
        <div id="pdf-chart-netWorth" className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-2 text-center">{householdName} - Net Worth</h3>
            <div style={{ width: 750, height: 400 }}>
                <AreaChart width={750} height={400} data={projectionData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="age1" />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                    <ReferenceLine x={val('retirementAge')} stroke="red" strokeDasharray="3 3" label="Retirement" />
                    <Area type="monotone" dataKey="endBalance" stroke="#0A437B" fill="#0A437B" fillOpacity={0.3} />
                </AreaChart>
            </div>
        </div>

        <div id="pdf-chart-compounding" className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-2 text-center">Power of Compounding</h3>
            <div style={{ width: 750, height: 400 }}>
                <BarChart width={750} height={400} data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="age1" />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                    <Legend />
                    <Bar dataKey="totalPrincipal" stackId="a" fill="#10B981" name="Total Contributions" />
                    <Bar dataKey="totalGrowth" stackId="a" fill="#3B82F6" name="Investment Growth" />
                </BarChart>
            </div>
        </div>

        <div id="pdf-chart-cashFlow" className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-2 text-center">Income vs Expenses</h3>
            <div style={{ width: 750, height: 400 }}>
                <LineChart width={750} height={400} data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="age1" />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                    <Legend />
                    <Line type="monotone" dataKey="passiveIncome" stroke="#10B981" strokeWidth={3} name="Passive Income" dot={false} />
                    <Line type="monotone" dataKey="costOfLiving" stroke="#EF4444" strokeWidth={3} name="Expenses" dot={false} />
                </LineChart>
            </div>
        </div>

        <div id="pdf-chart-withdrawal" className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-2 text-center">Withdrawal Rate Risk</h3>
            <div style={{ width: 750, height: 400 }}>
                <ComposedChart width={750} height={400} data={projectionData.filter(d => d.isRetired)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="age1" />
                    <YAxis unit="%" />
                    <Legend />
                    <ReferenceLine y={0.04} stroke="green" strokeDasharray="3 3" />
                    <ReferenceLine y={0.08} stroke="orange" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="withdrawalRate" stroke="#8B5CF6" strokeWidth={3} name="Withdrawal Rate %" dot={false} />
                </ComposedChart>
            </div>
        </div>
      </div>

    </main>
  );
}