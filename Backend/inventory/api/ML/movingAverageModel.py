import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing # type: ignore
import warnings
import matplotlib.pyplot as plt

warnings.filterwarnings('ignore')

def standardize_column_names(data: pd.DataFrame):
    data.columns = data.columns.str.lower().str.replace(' ', '_')

def find_datetime_column(df: pd.DataFrame) -> str:
    data = df.copy()
    for column in data.select_dtypes(include=['object']):
        try:
            data[column] = pd.to_datetime(data[column])
            if pd.api.types.is_datetime64_any_dtype(data[column]):
                return column
        except ValueError:
            continue
        
    datetime_types = ["datetime64[ns]", "datetime64", "datetime", "datetimetz"]
    datetime_columns = df.select_dtypes(include=datetime_types).columns
    
    if len(datetime_columns) > 0:
        return datetime_columns[0]
    
    return None

def prepare_data(df: pd.DataFrame, time_interval: str, noOfPred: int = 5):
    datetime_column = str(find_datetime_column(df))
    if datetime_column is None:
        raise ValueError("No datetime column found in the DataFrame")

    data = df.copy()
    data[datetime_column] = pd.to_datetime(data[datetime_column])
    data.set_index(datetime_column, inplace=True)

    if time_interval == 'M':
        sales = data.resample('M')['sales'].sum()
        seasonal_period = 3
    elif time_interval == 'Q':
        sales = data.resample('Q')['sales'].sum()
        seasonal_period = 4
    elif time_interval == 'Y':
        sales = data.resample('A')['sales'].sum()
        seasonal_period = 1
    elif time_interval == 'W':
        sales = data.resample('W')['sales'].sum()
        seasonal_period = 7
    elif time_interval == 'D':
        sales = data.resample('D')['sales'].sum()
        seasonal_period = 1
    else:
        raise ValueError("Invalid time interval. Use 'D', 'W', 'M', 'Q', or 'Y'.")

    # sales.index = pd.DatetimeIndex(sales.index).to_period(time_interval)

    model = ExponentialSmoothing(sales, trend='add', seasonal='mul', seasonal_periods=seasonal_period+1).fit()
    forecast = model.forecast(noOfPred)
    forecast_df = pd.DataFrame(forecast, columns=['Forecast'])
    forecast_df.reset_index(inplace=True)
    forecast_df.rename(columns={'index': 'Date'}, inplace=True)

    return sales, forecast_df

def price_of_product(data: pd.DataFrame, product_name: str):
    product_data = data[data['product'] == product_name]
    return product_data['price_each'].mean()

def predict_for_product(data: pd.DataFrame, product_name: str, time_interval: str, noOfPred: int = 5):
    product_df = data[data['product'] == product_name]
    timely_sales, forecast_sales = prepare_data(product_df, time_interval, noOfPred)

    if isinstance(timely_sales, pd.Series):
        timely_sales = timely_sales.to_frame(name='sales')
    
    if isinstance(forecast_sales, pd.Series):
        forecast_sales = forecast_sales.to_frame(name='Forecast')

    priceprod = price_of_product(data, product_name)
    timely_sales['Quantity Required'] = timely_sales['sales'] // priceprod
    forecast_sales['Quantity Required'] = forecast_sales['Forecast'] // priceprod

    return timely_sales, forecast_sales

df = pd.read_csv(r'DataPreprocess\data\Sales Data.csv')
standardize_column_names(df)
timely_sales, forecast_sales = predict_for_product(df, 'Wired Headphones', 'W', noOfPred=5)

print(timely_sales)
print(forecast_sales)


"""



Plotting the sales and forecast
timely_sales.index = timely_sales.index.to_timestamp()

plt.figure(figsize=(14, 7))
plt.plot(timely_sales.index, timely_sales['sales'], marker='', linestyle='-', color='b', label='Timely Sales')
plt.plot(forecast_sales['Date'], forecast_sales['Forecast'], marker='', linestyle='-', color='r', label='Forecasted Sales')
plt.title('Timely Sales vs Forecasted Sales')
plt.xlabel('Date')
plt.ylabel('Sales')
plt.legend()
plt.grid(True)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()



"""
