import streamlit as st
import pandas as pd
import yfinance as yf
from datetime import date, timedelta

# =============================================================================
# Page Configuration
# =============================================================================
st.set_page_config(
    page_title="Bulk Stock Quote Downloader",
    page_icon="📈",
    layout="wide"
)

st.title("📈 Bulk Stock Quote Downloader")
st.write("This tool downloads historical stock data from Yahoo Finance. Enter ticker symbols, select a date range, and click the button to get started.")


# =============================================================================
# Helper Functions
# =============================================================================

@st.cache_data
def convert_df_to_csv(df):
    """Converts a DataFrame to a CSV string for download."""
    return df.to_csv(index=True).encode('utf-8')

def download_stock_data(ticker, start_date, end_date, interval):
    """
    Downloads historical data for a single stock ticker.
    Returns a DataFrame on success, or None on failure.
    """
    try:
        # yfinance expects the end_date to be exclusive, so add one day.
        end_date_inclusive = end_date + timedelta(days=1)
        
        data = yf.download(
            tickers=ticker,
            start=start_date,
            end=end_date_inclusive,
            interval=interval,
            progress=False, # Suppress the progress bar in the console
            auto_adjust=True # Automatically adjust for splits and dividends
        )
        
        if data.empty:
            return None # No data found for this ticker in the given range
        
        # Ensure standard columns are present, even if some are missing from API
        required_cols = ['Open', 'High', 'Low', 'Close', 'Volume']
        for col in required_cols:
            if col not in data.columns:
                data[col] = 0 # Add missing columns with 0
        
        # Return only the desired columns
        return data[['Open', 'High', 'Low', 'Close', 'Volume']]

    except Exception:
        return None # An error occurred during download

# =============================================================================
# User Interface (Sidebar)
# =============================================================================

st.sidebar.header("Query Parameters")

# Use a more recent and valid default date range
default_start = date(2020, 1, 1)
default_end = date.today() - timedelta(days=1)

start_date_input = st.sidebar.date_input("Start Date", default_start)
end_date_input = st.sidebar.date_input("End Date", default_end)

ticker_string = st.sidebar.text_area(
    "Enter Tickers",
    "AAPL, MSFT, GOOG, NVDA",
    help="Enter tickers separated by commas or on new lines."
)

freq_map = {'Daily': '1d', 'Weekly': '1wk', 'Monthly': '1mo'}
freq_option = st.sidebar.selectbox("Frequency", options=list(freq_map.keys()))
frequency = freq_map[freq_option]

collate_data = st.sidebar.checkbox("Collate Data by Type", value=False)

# =============================================================================
# Main Application Logic
# =============================================================================

if st.sidebar.button("Get Bulk Quotes", type="primary"):

    # 1. Process Inputs
    tickers = [t.strip().upper() for t in ticker_string.replace(",", "\n").split()]
    tickers = list(filter(None, sorted(set(tickers)))) # Remove duplicates and empty strings

    if not tickers:
        st.warning("Please enter at least one ticker symbol.")
    elif start_date_input > end_date_input:
        st.error("Error: The start date cannot be after the end date.")
    else:
        
        # 2. Fetch Data
        progress_bar = st.progress(0, text="Initializing...")
        status_text = st.empty()
        
        all_data = {}
        failed_tickers = []

        for i, ticker in enumerate(tickers):
            status_text.text(f"Downloading data for {ticker} ({i+1}/{len(tickers)})...")
            
            data = download_stock_data(ticker, start_date_input, end_date_input, frequency)
            
            if data is not None:
                all_data[ticker] = data
            else:
                failed_tickers.append(ticker)
            
            progress_bar.progress((i + 1) / len(tickers))

        status_text.success(f"Download complete! Found data for {len(all_data)} of {len(tickers)} tickers.")

        # 3. Display Results
        if all_data:
            if collate_data:
                st.header("Collated Data")
                data_types = ['Open', 'High', 'Low', 'Close', 'Volume']
                collated_tabs = st.tabs(data_types)

                for i, dtype in enumerate(data_types):
                    with collated_tabs[i]:
                        collated_df = pd.concat(
                            [df[[dtype]].rename(columns={dtype: ticker}) for ticker, df in all_data.items()],
                            axis=1
                        )
                        collated_df.index.name = "Date"
                        st.dataframe(collated_df.sort_index(ascending=False))
                        
                        csv = convert_df_to_csv(collated_df)
                        st.download_button(
                            label=f"Download {dtype} Data as CSV",
                            data=csv,
                            file_name=f"collated_{dtype}.csv",
                            mime='text/csv',
                        )
            else:
                st.header("Individual Ticker Data")
                ticker_tabs = st.tabs(list(all_data.keys()))

                for i, ticker in enumerate(all_data.keys()):
                    with ticker_tabs[i]:
                        st.subheader(f"Historical Data for {ticker}")
                        df = all_data[ticker]
                        st.dataframe(df.sort_index(ascending=False))
                        
                        csv = convert_df_to_csv(df)
                        filename = f"{ticker}_{start_date_input}_to_{end_date_input}.csv"
                        st.download_button(
                            label="Download as CSV",
                            data=csv,
                            file_name=filename,
                            mime='text/csv',
                        )
        
        if failed_tickers:
            st.error(f"Could not retrieve data for the following tickers: {', '.join(failed_tickers)}")
