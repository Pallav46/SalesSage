import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict
from sklearn.preprocessing import RobustScaler #type ignore
from tensorflow.keras.models import Sequential #type ignore
from tensorflow.keras.layers import Dense, Dropout, LSTM, Bidirectional, BatchNormalization #type ignore
from tensorflow.keras.callbacks import EarlyStopping #type ignore
from tensorflow.keras.optimizers import Adam, RMSprop #type ignore
from tensorflow.keras.regularizers import l2 #type ignore
import warnings
from datetime import timedelta
from dateutil.relativedelta import relativedelta

warnings.filterwarnings('ignore')

class SalesPredictionModel:
    def __init__(self, data: pd.DataFrame, lookback: int = 30, product_name: str = None, period='D'):
        self.data = data.copy()
        self.scaler = RobustScaler()
        self.product_name = product_name
        self.lookback = lookback
        self.period = period
        self.model = None
        self.future_predictions = []
        self.last_date = None
        self.future_dates = []
        self.product_price = None

    def load_data(self):
        if self.product_name is not None:
            self.data = self.data[self.data['product'] == self.product_name]
            self.product_price = self.price_of_product(self.data, self.product_name)
        
        X = self.data[['order date', 'sales']].copy()
        X['order date'] = pd.to_datetime(X['order date']).dt.to_period(self.period)
        X = X.groupby('order date').sum()

        # self.data = 
        self.data = X.values.reshape((-1, 1))
        self.data = self.scaler.fit_transform(self.data)
        
        self.last_date = X.index[-1].to_timestamp()

        return self.data

    def create_dataset(self, df, lookback=1):
        X, Y = [], []
        for i in range(len(df) - lookback - 1):
            X.append(df[i:(i + lookback), 0])
            Y.append(df[i + lookback, 0])
        return np.array(X), np.array(Y)

    def build_model(self, input_shape):
        model = Sequential([
            Bidirectional(LSTM(500, activation='tanh', return_sequences=True, kernel_regularizer=l2(0.1)), input_shape=input_shape),
            BatchNormalization(),
            Dropout(0.5),
            Bidirectional(LSTM(250, activation='tanh', kernel_regularizer=l2(0.1))),
            BatchNormalization(),
            Dropout(0.5),
            Dense(128, activation='relu', kernel_regularizer=l2(0.1)),
            BatchNormalization(),
            Dense(1, activation='linear')
        ])
        model.compile(optimizer=Adam(learning_rate=0.0001), loss='mean_squared_error')
        return model

    def train_model(self, X_train, Y_train):
        self.model = self.build_model((X_train.shape[1], X_train.shape[2]))
        early_stopping = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)
        self.model.fit(X_train, Y_train, validation_split=0.2, epochs=200, batch_size=32, callbacks=[early_stopping], verbose=1)

    def predict(self, X):
        return self.model.predict(X)

    def inverse_transform(self, data):
        return self.scaler.inverse_transform(data)

    def plot_predictions(self, actual, predicted, title):
        plt.figure(figsize=(16, 6))
        plt.plot(actual, label='Actual')
        plt.plot(predicted, label='Predicted')
        plt.ylabel('Sales_Prediction', size=13)
        plt.xlabel('Time Step', size=13)
        plt.tight_layout()
        plt.legend(fontsize=13)
        plt.title(title)
        plt.show()
        
    def price_of_product(self, data: pd.DataFrame, product_name: str):
        product_data = data[data['product'] == product_name]
        return product_data['price each'].iloc[0]

    def make_future_predictions(self, data, num_predictions=60):
        last_lookback_values = data[-self.lookback:].reshape(1, 1, self.lookback)
        self.future_predictions = []

        for _ in range(num_predictions):
            future_pred_scaled = self.model.predict(last_lookback_values)
            self.future_predictions.append(future_pred_scaled[0, 0])
            last_lookback_values = np.roll(last_lookback_values, -1)
            last_lookback_values[0, 0, -1] = future_pred_scaled[0, 0]

        self.future_predictions = self.inverse_transform(np.array(self.future_predictions).reshape(-1, 1))
        
        if self.period == 'W':
            self.future_dates = [self.last_date + timedelta(weeks=i+1) for i in range(len(self.future_predictions))]
        elif self.period == 'D':
            self.future_dates = [self.last_date + timedelta(days=i+1) for i in range(len(self.future_predictions))]
        elif self.period == 'M':
            self.future_dates = [self.last_date + pd.DateOffset(months=i+1) for i in range(len(self.future_predictions))]

    def plot_future_predictions(self, data, num_predictions):
        data_inverse = self.inverse_transform(data)
        combined_data = np.concatenate((data_inverse, self.future_predictions), axis=0)
        
        combined_df = pd.DataFrame(combined_data, columns=['Sales_Prediction'])
        x_original = range(len(combined_data))
        x_future = range(len(data_inverse), len(data_inverse) + num_predictions)

        plt.figure(figsize=(16, 6))
        plt.plot(x_original, combined_df, label='Historical Sales')
        plt.plot(x_future, self.future_predictions, label='Future Predictions')
        plt.ylabel('Sales Prediction', size=13)
        plt.xlabel('Time Step', size=13)
        plt.tight_layout()
        plt.legend(fontsize=13)
        plt.show()
    
    def future_predictions_to_dict(self):
        if self.period == 'W':
            return {
                date.strftime(r'%Y-%W'): (float(pred), int(pred // self.product_price)) for date, pred in zip(self.future_dates, self.future_predictions)
            }
        elif self.period == 'D':
            return {
                date.strftime(r'%Y-%m-%d'): (float(pred), int(pred // self.product_price)) for date, pred in zip(self.future_dates, self.future_predictions)
            }
        elif self.period == 'M':
            return {
                date.strftime(r'%Y-%m'): (float(pred), int(pred // self.product_price)) for date, pred in zip(self.future_dates, self.future_predictions)
            }

    def run(self, num_pred: int = 30):
        self.data = self.load_data()
        X_data, Y_data = self.create_dataset(self.data, self.lookback)
        X_data = np.reshape(X_data, (X_data.shape[0], 1, X_data.shape[1]))

        self.train_model(X_data, Y_data)
        
        data_predict = self.predict(X_data)
        data_predict = self.inverse_transform(data_predict)
        Y_data = self.inverse_transform([Y_data])

        # self.plot_predictions(Y_data[0], data_predict[:, 0], "Historical Sales Predictions")

        self.make_future_predictions(self.data, num_predictions=num_pred)
        # self.plot_future_predictions(self.data, num_predictions=num_pred)


# if __name__ == "__main__":
#     df = pd.read_csv(r'DataPreprocess\data\Sales Data.csv')
#     proc = DataPreprocessing()
#     df_proc = proc.process_data(df)
#     model = SalesPredictionModel(df_proc, lookback=60, product_name="Macbook Pro Laptop")
#     model.run(num_pred=30)
#     future_dict = model.future_predictions_to_dict()
#     print(future_dict)
