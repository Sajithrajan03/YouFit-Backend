import streamlit as st
import pickle
import numpy as np

model = pickle.load(open('./models/calories_burnt_prediction.pkl','rb'))
st.title('XGB REGRESSOR')

html_temp = """
<div style="background:#025246 ;padding:10px">
<h2 style="color:white;text-align:center;"> Calories Burnt Predictor </h2>
</div>
"""

st.markdown(html_temp, unsafe_allow_html = True)

def predict_age(Boole, Gender, Age, Height, Weight, Duration, Heart_Rate,Body_Temp):
    input=np.array([[Boole, Gender, Age, Height, Weight, Duration, Heart_Rate,Body_Temp]])
    prediction = model.predict(input)
    
    return  prediction

st.header('Enter the following details to predict the Calories Burnt')
Boole = st.checkbox("True/False",value=False)
Gender= st.number_input('Gender')
Age= st.number_input('Age')
Height = st.number_input('Height')
Weight = st.number_input('Weight')
Duration= st.number_input('Duration')
Heart_Rate = st.number_input('Heart_Rate')
Body_Temp = st.number_input('Body_Temp')


if st.button("Predict the Calories Burnt"):
        output = predict_age(Boole, Gender, Age, Height, Weight, Duration, Heart_Rate,Body_Temp)
        st.success('You Probably burnt {} Calories\n'.format(output))
        
        
