import streamlit as st
import pickle
import numpy as np
from pathlib import Path
print(Path.cwd())
model = pickle.load(open('./models/parkinsson_classifier.pkl','rb'))
st.title('Support Vector Machine Classifier')

html_temp = """
<div style="background:#025246 ;padding:10px">
<h2 style="color:white;text-align:center;"> Parkinsson Disease Classifier </h2>
</div>
"""

st.markdown(html_temp, unsafe_allow_html = True)

def predict_age(Height,Weight,Gender_Male):
    input=np.array([[119.992,157.302,74.997,0.00784,0.00007,0.0037,0.00554,0.01109,0.04374,0.426,0.02182,0.0313,0.02971,0.06545,0.02211,21.033,0.414783,0.815285,-4.813031,0.266482,2.301442,0.284654]])
    prediction = model.predict(input)
    
    return  prediction

st.header('Enter the following details to predict the BMI')
Height = st.number_input('Height')
Weight = st.number_input('Weight')
Gender_Male = st.number_input('Is Male')

if st.button("Predict the BMI"):
        output = predict_age(Height,Weight,Gender_Male)
        st.success('The BMI is {}\n'.format(output))
        if output == 0:
            st.write('The person does not have Parkinsson Disease')
        elif output == 1:
            st.write('The person Has Parkinsson Disease')
        
