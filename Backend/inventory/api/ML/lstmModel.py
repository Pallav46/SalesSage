import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import RobustScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM, Bidirectional, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2

import warnings
warnings.filterwarnings('ignore')
from DataPreprocess.DataProcessing import DataPreprocessing

# Load and preprocess the data
df = pd.read_csv(r'DataPreprocess\data\Sales Data.csv')
proc = DataPreprocessing()
df_proc = proc.process_data(df)

X = df_proc.loc[:, ['order date', 'sales']]
X['order date'] = pd.to_datetime(X['order date'])
X['order date'] = X['order date'].dt.to_period('D')
X = X.groupby('order date').sum()

data = X.values
data = data.reshape((-1, 1))

# Scale the data
scaler = RobustScaler()
data = scaler.fit_transform(data)

# Function to create dataset for LSTM
def Create_Dataset(df, lookback=1):
    X, Y = [], []
    for i in range(len(df) - lookback - 1):
        X.append(df[i:(i + lookback), 0])
        Y.append(df[i + lookback, 0])
    return np.array(X), np.array(Y)

# Prepare the dataset with lookback period
lookback = 30
X_data, Y_data = Create_Dataset(data, lookback)

X_data = np.reshape(X_data, (X_data.shape[0], 1, X_data.shape[1]))

# Build the model
print("Model Training Starts.......")
model = Sequential()
model.add(Bidirectional(LSTM(1000, activation='tanh', return_sequences=True, kernel_regularizer=l2(0.1)), input_shape=(X_data.shape[1], X_data.shape[2])))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Bidirectional(LSTM(500, activation='tanh', kernel_regularizer=l2(0.1))))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu', kernel_regularizer=l2(0.1)))
model.add(BatchNormalization())
model.add(Dense(1, activation='linear'))

optimizer = Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='mean_squared_error')

early_stopping = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)

model.summary()

# Train the model
history = model.fit(X_data, Y_data, validation_split=0.2, epochs=200, batch_size=32, callbacks=[early_stopping], verbose=1)

# Predictions for the dataset
data_predict = model.predict(X_data)

# Invert the predictions to original scale
data_predict = scaler.inverse_transform(data_predict)
Y_data = scaler.inverse_transform([Y_data])

# Plot dataset predictions
plt.figure(figsize=(16, 6))
plt.plot(Y_data[0], label='Actual')
plt.plot(data_predict[:, 0], label='Predicted')
plt.ylabel('Sales_Prediction', size=13)
plt.xlabel('Time Step', size=13)
plt.tight_layout()
plt.legend(fontsize=13)
plt.show()

# Future predictions using the entire dataset
last_lookback_values = data[-lookback:].reshape(1, 1, lookback)

future_predictions = []
num_predictions = 60  # Number of future steps to predict

for _ in range(num_predictions):
    future_pred_scaled = model.predict(last_lookback_values)
    future_predictions.append(future_pred_scaled[0, 0])
    last_lookback_values = np.roll(last_lookback_values, -1)
    last_lookback_values[0, 0, -1] = future_pred_scaled[0, 0]

future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

data_inverse = scaler.inverse_transform(data)
combined_data = np.concatenate((data_inverse, future_predictions), axis=0)

# Create a new DataFrame to plot the combined data
combined_df = pd.DataFrame(combined_data, columns=['Sales_Prediction'])
x_original = range(len(combined_data))
x_future = range(len(data_inverse), len(data_inverse) + num_predictions)

# Plot historical sales and future predictions
plt.figure(figsize=(16, 6))
plt.plot(x_original, combined_df, label='Historical Sales')
plt.plot(x_future, future_predictions, label='Future Predictions')
plt.ylabel('Sales Prediction', size=13)
plt.xlabel('Time Step', size=13)
plt.tight_layout()
plt.legend(fontsize=13)
plt.show()
