import streamlit as st
import pickle
import numpy as np
from pathlib import Path
print(Path.cwd())
model = pickle.load(open('./models/bmi_classifier.pkl','rb'))
st.title('RNN')

html_temp = """
<div style="background:#025246 ;padding:10px">
<h2 style="color:white;text-align:center;"> Predicted Steps </h2>
</div>
"""

st.markdown(html_temp, unsafe_allow_html = True)



st.header('Enter the following details to predict the STEPS')

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow import keras
import matplotlib.pyplot as plt

# Load data from the provided CSV file
df = pd.read_csv("./Datasets/Daily activity metrics.csv", parse_dates=['Date'])

# Extract the time series (Step count)
time_series = df['Step count'].values.reshape(-1, 1)

# Normalize the data
scaler = MinMaxScaler()
time_series_normalized = scaler.fit_transform(time_series)

# Create sequences for training
sequence_length = 5  # You can adjust this based on your preference
X, y = [], []

for i in range(len(time_series_normalized) - sequence_length):
    X.append(time_series_normalized[i:i + sequence_length, 0])
    y.append(time_series_normalized[i + sequence_length, 0])

X, y = np.array(X), np.array(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Reshape data for RNN input (batch_size, timesteps, input_dim)
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

# Build the specified RNN model
model = keras.models.Sequential()
model.add(keras.layers.SimpleRNN(50, activation='relu', input_shape=(X_train.shape[1], 1)))
model.add(keras.layers.Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
st.write(model.fit(X_train, y_train, epochs=50, batch_size=8))

# Predict the next 7 days
future_data = []

# Use the last sequence from the test set to predict the next steps
current_sequence = X_test[-1].reshape(1, sequence_length, 1)

for _ in range(7):
    predicted_step_normalized = model.predict(current_sequence)[0, 0]
    future_data.append(predicted_step_normalized)
    current_sequence = np.roll(current_sequence, -1, axis=1)
    current_sequence[0, -1, 0] = predicted_step_normalized

# Inverse transform to get the actual predicted steps
future_data = np.array(future_data)
future_data = scaler.inverse_transform(future_data.reshape(-1, 1))

# Create dates for the next 7 days
future_dates = pd.date_range(df['Date'].max() + pd.Timedelta(days=1), periods=7, freq='D')
future_df = pd.DataFrame({'Date': future_dates, 'predicted_steps': future_data.flatten()})



# Print the predicted steps for the next 7 days
print("Predicted Steps for the Next 7 Days using RNN:")
print(future_df)

st.line_chart(data=future_df, x='Date', y='predicted_steps', color=None, width=0, height=0, use_container_width=True)