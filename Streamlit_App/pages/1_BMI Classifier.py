import streamlit as st
import pickle
import numpy as np
from pathlib import Path
print(Path.cwd())
model = pickle.load(open('./models/bmi_classifier.pkl','rb'))
st.title('Random Forest Classifier')

html_temp = """
<div style="background:#025246 ;padding:10px">
<h2 style="color:white;text-align:center;"> BMI Classifier </h2>
</div>
"""

st.markdown(html_temp, unsafe_allow_html = True)

def predict_age(Height,Weight,Gender_Male):
    input=np.array([[Height,Weight,Gender_Male]])
    prediction = model.predict(input)
    
    return int(prediction)

st.header('Enter the following details to predict the BMI')
Height = st.number_input('Height')
Weight = st.number_input('Weight')
Gender_Male = st.number_input('Is Male')

if st.button("Predict the BMI"):
        output = predict_age(Height,Weight,Gender_Male)
        st.success('The BMI is {}\n'.format(output))

        if output == 1:
            st.write('The person is underweight')
        elif output == 2:
            st.write('The person is healthy')
        elif output == 3:
            st.write('The person is overweight')
