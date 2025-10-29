"use server";

import { format as formatDate } from 'date-fns';

/**
 * Calculates performance metrics for a given DataFrame.
 */
function addPerformanceMetrics(data) {
  if (!data || data.length === 0) return data;
  const getClose = (row) => {
    if (!row) return null;
    if (typeof row.Close === 'number' && !isNaN(row.Close)) return row.Close;
    if (typeof row.close === 'number' && !isNaN(row.close)) return row.close;
    return null;
  };
  const closePrices = data.map(getClose);
  const firstClose = closePrices[0];
  if (typeof firstClose !== 'number' || isNaN(firstClose) || firstClose === 0) {
    data.forEach((row) => {
      row['% Change'] = null;
      row['50-Day SMA'] = null;
    });
    return data;
  }
  data.forEach((row) => {
    const closeVal = getClose(row);
    row['% Change'] = typeof closeVal === 'number' ? ((closeVal / firstClose) - 1) * 100 : null;
  });
  for (let i = 0; i < data.length; i++) {
    if (i >= 49) {
      const window = closePrices.slice(i - 49, i + 1);
      if (window.every(price => typeof price === 'number' && !isNaN(price))) {
        const sma = window.reduce((a, b) => a + b, 0) / 50;
        data[i]['50-Day SMA'] = sma;
      } else {
        data[i]['50-Day SMA'] = null;
      }
    } else {
      data[i]['50-Day SMA'] = null;
    }
  }
  return data;
}

/**
 * Formats a raw data row from yahoo-finance2.
 */
function formatDataRow(row) {
  return {
    date: formatDate(new Date(row.date), 'yyyy-MM-dd'),
    Open: row.open,
    High: row.high,
    Low: row.low,
    Close: row.close,
    Volume: row.volume,
    AdjClose: row.adjClose ?? null,
  };
}

/**
 * Server Action to fetch and process stock data.
 */
export async function getStockData(tickersString, startDate, endDate, frequency, addMetrics) {
  let yahooFinance;
  try {
    const mod = await import('yahoo-finance2');
    if (mod && mod.historical && mod.quote) {
      yahooFinance = mod;
    } else if (mod && mod.default && (mod.default.historical || mod.default.quote)) {
      yahooFinance = mod.default;
    } else if (mod && mod.default && typeof mod.default === 'function') {
      try {
        const inst = mod.default({ suppressNotices: ['ripHistorical', 'yahooSurvey'] });
        if (inst && (inst.historical || inst.quote || inst.chart)) yahooFinance = inst;
      } catch (e) {}
      if (!yahooFinance) {
        try {
          const instNoOpts = mod.default();
          if (instNoOpts && (instNoOpts.historical || instNoOpts.quote || instNoOpts.chart)) yahooFinance = instNoOpts;
        } catch (e) {}
      }
      if (!yahooFinance) {
        try {
          const inst2 = new mod.default({ suppressNotices: ['ripHistorical', 'yahooSurvey'] });
          if (inst2 && (inst2.historical || inst2.quote || inst2.chart)) yahooFinance = inst2;
        } catch (e) {}
      }
      if (!yahooFinance) {
        try {
          const inst3 = new mod.default();
          if (inst3 && (inst3.historical || inst3.quote || inst3.chart)) yahooFinance = inst3;
        } catch (e) {}
      }
    }
    if (!yahooFinance && mod && typeof mod === 'object') {
      for (const k of Object.keys(mod)) {
        const candidate = mod[k];
        if (candidate && (candidate.historical || candidate.quote)) {
          yahooFinance = candidate;
          break;
        }
      }
    }
  } catch (err) {
    console.error('Failed to dynamically import yahoo-finance2:', err);
    return { error: 'Server error: Could not load the finance library.' };
  }
  if (!yahooFinance || typeof yahooFinance.historical !== 'function' || typeof yahooFinance.quote !== 'function') {
    console.error('Dynamically imported yahoo-finance2 module structure is unexpected. Module/keys:', yahooFinance ? Object.keys(yahooFinance) : yahooFinance, yahooFinance);
    return { error: 'Server error: Finance library loaded incorrectly.' };
  }
  const tickers = [...new Set(tickersString.replace(/,/g, ' ').split(' ').map(t => t.trim().toUpperCase()).filter(Boolean))];
  if (tickers.length === 0) return { error: 'Please enter at least one valid ticker.' };
  const allData = {};
  const companyInfo = {};
  const failedTickers = [];
  const inclusiveEndDate = new Date(endDate);
  inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
  const formattedEndDate = inclusiveEndDate.toISOString().split('T')[0];
  // Use Date objects for historical() options to improve compatibility
  const queryOptions = {
    period1: new Date(startDate),
    period2: new Date(formattedEndDate),
    interval: frequency,
  };
  const chartOptions = {
    period1: Math.floor(new Date(startDate).getTime() / 1000),
    period2: Math.floor(new Date(formattedEndDate).getTime() / 1000),
    interval: frequency,
  };
  try {
    for (const ticker of tickers) {
      try {
        let historyData = [];
        try {
          if (typeof yahooFinance.chart === 'function') {
            const chartRes = await yahooFinance.chart(ticker, chartOptions);
            const res0 = chartRes?.result?.[0];
            if (res0 && Array.isArray(res0.timestamp)) {
              const timestamps = res0.timestamp;
              const quote = res0.indicators?.quote?.[0] || {};
              const adjArr = res0.indicators?.adjclose?.[0]?.adjclose || null;
              historyData = timestamps.map((ts, idx) => ({
                date: new Date(ts * 1000).toISOString(),
                open: quote.open?.[idx] ?? null,
                high: quote.high?.[idx] ?? null,
                low: quote.low?.[idx] ?? null,
                close: quote.close?.[idx] ?? null,
                volume: quote.volume?.[idx] ?? null,
                adjClose: adjArr ? adjArr[idx] : null,
              })).filter(r => r.date && (typeof r.close === 'number' || typeof r.open === 'number' || typeof r.high === 'number' || typeof r.low === 'number'));
            } else {
              historyData = [];
            }
          }
          if ((!historyData || historyData.length === 0) && typeof yahooFinance.historical === 'function') {
            const hist = await yahooFinance.historical(ticker, queryOptions);
            if (Array.isArray(hist)) {
              historyData = hist.map(h => ({
                date: h.date ?? h.datetime ?? null,
                open: h.open ?? null,
                high: h.high ?? null,
                low: h.low ?? null,
                close: h.close ?? null,
                volume: h.volume ?? null,
                adjClose: h.adjClose ?? h.adjclose ?? null,
              })).filter(r => r.date && (typeof r.close === 'number' || typeof r.open === 'number'));
            }
          }
          if (!historyData) historyData = [];
        } catch (chartErr) {
          console.warn('chart()/historical() attempt failed for', ticker, chartErr?.message || chartErr);
          if (typeof yahooFinance.historical === 'function') {
            try {
              const hist = await yahooFinance.historical(ticker, queryOptions);
              if (Array.isArray(hist)) {
                historyData = hist.map(h => ({
                  date: h.date ?? h.datetime ?? null,
                  open: h.open ?? null,
                  high: h.high ?? null,
                  low: h.low ?? null,
                  close: h.close ?? null,
                  volume: h.volume ?? null,
                  adjClose: h.adjClose ?? h.adjclose ?? null,
                })).filter(r => r.date && (typeof r.close === 'number' || typeof r.open === 'number'));
              }
            } catch (finalErr) {
              console.warn('historical() fallback also failed for', ticker, finalErr?.message || finalErr);
            }
          }
        }
        const quoteData = await yahooFinance.quote(ticker);
        if (historyData && historyData.length > 0) {
          let formattedData = historyData.map(formatDataRow);
          if (addMetrics) formattedData = addPerformanceMetrics(formattedData);
          allData[ticker] = formattedData;
          companyInfo[ticker] = {
            companyName: quoteData?.longName || quoteData?.shortName || ticker,
            sector: quoteData?.sector || 'N/A',
            industry: quoteData?.industry || 'N/A',
          };
        } else {
          console.warn(`No historical data returned for ${ticker} with options:`, queryOptions);
          failedTickers.push(ticker + ' (no data)');
        }
      } catch (err) {
        console.warn(`Failed to fetch data for ${ticker}:`, err?.message || err);
        failedTickers.push(ticker + ` (${err?.code || err?.message || 'error'})`);
      }
    }
    if (Object.keys(allData).length === 0) {
      console.error('Failed to retrieve data for all requested tickers:', failedTickers);
      return { error: `Could not retrieve data for any tickers. Failures: ${failedTickers.join(', ')}` };
    }
    return {
      allData,
      companyInfo,
      error: failedTickers.length > 0 ? `Failed to load some tickers: ${failedTickers.join(', ')}` : null,
    };
  } catch (error) {
    console.error('Main data fetching error:', error);
    return { error: `An unexpected server error occurred: ${error?.message || error}` };
  }
}