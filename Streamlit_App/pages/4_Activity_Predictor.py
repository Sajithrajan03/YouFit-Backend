import streamlit as st
import pickle
import numpy as np

model = pickle.load(open('./models/hmm_activity.pkl','rb'))
st.title('HMM')

html_temp = """
<div style="background:#025246 ;padding:10px">
<h2 style="color:white;text-align:center;"> Activity Predictor </h2>
</div>
"""

st.markdown(html_temp, unsafe_allow_html = True)

def predict_age(steps):
    input=np.array([[steps]])
    prediction = model.predict(input)
    
    return  prediction

st.header('Enter the following details to predict the Activity')

 
Steps = st.number_input('Steps:')
 


if st.button("Predict the Calories Burnt"):
        output = predict_age(Steps)
        st.success('You Probably are {} Calories\n'.format(output))

        if output == 0:
            st.write('The person is Running')
        elif output == 1:
            st.write('The person is walking')
        elif output == 2:
            st.write('The person is Ideal')
        
        
