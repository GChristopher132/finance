import streamlit as st
import pandas as pd
import yfinance as yf
from datetime import date, timedelta
import io
import plotly.express as px

# =============================================================================
# Page Configuration
# =============================================================================
st.set_page_config(
    page_title="Stock Analysis Dashboard",
    page_icon="📊",
    layout="wide"
)

st.title("📊 Stock Analysis Dashboard")
st.write("An interactive tool to download, analyze, and visualize historical stock data.")

# =============================================================================
# Helper Functions
# =============================================================================

@st.cache_data
def convert_df_to_csv(df):
    """Converts a DataFrame to a CSV string for download."""
    return df.to_csv(index=True).encode('utf-8')

def df_to_excel(dataframes_dict):
    """Converts a dictionary of DataFrames to an in-memory Excel file."""
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        for ticker, df in dataframes_dict.items():
            df.to_excel(writer, sheet_name=ticker)
    processed_data = output.getvalue()
    return processed_data

@st.cache_data
def get_company_info(ticker):
    """Fetches company metadata."""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "Company Name": info.get('longName', 'N/A'),
            "Sector": info.get('sector', 'N/A'),
            "Industry": info.get('industry', 'N/A')
        }
    except Exception:
        return {
            "Company Name": "N/A", "Sector": "N/A", "Industry": "N/A"
        }

def download_stock_data(ticker, start_date, end_date, interval, add_metrics):
    """
    Downloads historical data for a single stock ticker and calculates metrics.
    """
    try:
        end_date_inclusive = end_date + timedelta(days=1)
        data = yf.download(
            tickers=ticker, start=start_date, end=end_date_inclusive,
            interval=interval, progress=False, auto_adjust=True, group_by='ticker'
        )
        if data.empty:
            return None
        
        # FIX: Proactively flatten the MultiIndex if yfinance returns one
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.droplevel(0)

        # Add performance metrics if requested
        if add_metrics:
            data['% Change'] = (data['Close'] / data['Close'].iloc[0] - 1) * 100
            data['50-Day SMA'] = data['Close'].rolling(window=50).mean()
        
        return data
    except Exception:
        return None

# =============================================================================
# Session State Initialization
# =============================================================================
if 'tickers' not in st.session_state:
    st.session_state.tickers = "AAPL, MSFT, GOOG, NVDA"
if 'start_date' not in st.session_state:
    st.session_state.start_date = date(2020, 1, 1)
if 'end_date' not in st.session_state:
    st.session_state.end_date = date.today() - timedelta(days=1)

# =============================================================================
# User Interface (Sidebar)
# =============================================================================
st.sidebar.header("Query Parameters")

st.session_state.start_date = st.sidebar.date_input("Start Date", st.session_state.start_date)
st.session_state.end_date = st.sidebar.date_input("End Date", st.session_state.end_date)
st.session_state.tickers = st.sidebar.text_area("Enter Tickers", st.session_state.tickers)

add_metrics = st.sidebar.checkbox("Add Performance Metrics", value=True)

with st.sidebar.expander("Advanced Options"):
    freq_map = {'Daily': '1d', 'Weekly': '1wk', 'Monthly': '1mo'}
    freq_option = st.selectbox("Frequency", options=list(freq_map.keys()))
    frequency = freq_map[freq_option]

# =============================================================================
# Main Application Logic
# =============================================================================
if st.sidebar.button("Get Stock Data", type="primary"):
    tickers = [t.strip().upper() for t in st.session_state.tickers.replace(",", "\n").split()]
    tickers = list(filter(None, sorted(set(tickers))))

    if not tickers:
        st.warning("Please enter at least one ticker symbol.")
    elif st.session_state.start_date > st.session_state.end_date:
        st.error("Error: The start date cannot be after the end date.")
    else:
        progress_bar = st.progress(0, text="Initializing...")
        all_data, failed_tickers = {}, []

        for i, ticker in enumerate(tickers):
            progress_bar.progress((i + 1) / len(tickers), text=f"Fetching {ticker}...")
            data = download_stock_data(ticker, st.session_state.start_date, st.session_state.end_date, frequency, add_metrics)
            if data is not None:
                all_data[ticker] = data
            else:
                failed_tickers.append(ticker)
        
        progress_bar.success(f"Complete! Found data for {len(all_data)} tickers.")
        st.session_state.all_data = all_data # Save data to session state
        st.session_state.failed_tickers = failed_tickers

# Display results if data exists in session state
if 'all_data' in st.session_state and st.session_state.all_data:
    all_data = st.session_state.all_data
    
    # --- Create Tabs for Different Views ---
    chart_tab, data_tab, collate_tab = st.tabs(["📈 Performance Chart", "📄 Detailed Data", "🗂️ Collated View"])

    with chart_tab:
        st.subheader("Closing Price Performance Comparison")
        
        # Add a multiselect widget to filter tickers for the chart
        all_tickers = list(all_data.keys())
        selected_tickers = st.multiselect(
            "Select tickers to display on the chart:",
            options=all_tickers,
            default=all_tickers
        )

        if selected_tickers:
            # Filter the data to only include selected tickers for plotting
            filtered_data = {ticker: all_data[ticker] for ticker in selected_tickers}
            
            close_prices = pd.concat(
                [df[['Close']].rename(columns={'Close': ticker}) for ticker, df in filtered_data.items()],
                axis=1
            )
            
            fig = px.line(close_prices, title='Closing Prices Over Time', labels={'value': 'Price (USD)', 'variable': 'Ticker'})
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Please select at least one ticker to display the chart.")

    with data_tab:
        st.subheader("Individual Ticker Data")
        
        excel_data = df_to_excel(all_data)
        st.download_button(
            label="📥 Download All as Excel Workbook",
            data=excel_data,
            file_name=f"stock_data_{st.session_state.start_date}_to_{st.session_state.end_date}.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        
        ticker_tabs = st.tabs(list(all_data.keys()))
        for i, ticker in enumerate(all_data.keys()):
            with ticker_tabs[i]:
                info = get_company_info(ticker)
                st.markdown(f"**{info['Company Name']}**")
                st.caption(f"Sector: {info['Sector']} | Industry: {info['Industry']}")
                
                df = all_data[ticker]
                st.dataframe(df.sort_index(ascending=False))
                
                csv = convert_df_to_csv(df)
                st.download_button(label="Download as CSV", data=csv, file_name=f"{ticker}.csv")

    with collate_tab:
        st.subheader("Collated Data by Metric")
        # Ensure there's data to select from before creating the selectbox
        if all_data:
            first_ticker_df = all_data[list(all_data.keys())[0]]
            data_types = first_ticker_df.columns
            
            selected_type = st.selectbox("Select a metric to collate:", options=data_types)
            
            collated_df = pd.concat(
                [df[[selected_type]].rename(columns={selected_type: ticker}) for ticker, df in all_data.items()],
                axis=1
            )
            collated_df.index.name = "Date"
            st.dataframe(collated_df.sort_index(ascending=False))
            csv = convert_df_to_csv(collated_df)
            st.download_button(label=f"Download {selected_type} as CSV", data=csv, file_name=f"collated_{selected_type}.csv")

    if 'failed_tickers' in st.session_state and st.session_state.failed_tickers:
        st.error(f"Could not retrieve data for: {', '.join(st.session_state.failed_tickers)}")
