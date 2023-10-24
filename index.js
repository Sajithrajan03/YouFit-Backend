import express from 'express'
const app = express()
const port = 1234

import {google}from 'googleapis'
import request from 'request'
import cors from 'cors'
import bodyParser from 'body-parser'
import urlParse from 'url-parse'
import queryParse from 'query-string';
import axios from 'axios'

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.get('/auth',(req,res)=>{
    const oauth2client = new google.auth.OAuth2(
        // 'client_id',
        // 'client_secret',
        // 'redirect_uris'
        "510019787897-9hfjvuho1cnsf88j150cec2q5l38ghn8.apps.googleusercontent.com",
        "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",
        "http://localhost:1234/steps"
    )
    
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]
    const urls = oauth2client.generateAuthUrl({
        access_type:"offline",
        scope:scopes,
        state:JSON.stringify({
            callbackUrl:req.body.callbackUrl,
            userID:req.body.userID
        })  
        
    })
    
    request(urls,(err,response,body)=>{
        console.log("error:",err)
        console.log("statusCode:",response && response.statusCode)
        res.send(urls)
    })
    // res.send(`<script>window.open("${urls}");</script>`);
})


app.get('/steps',async (req,res)=>{
    const queryUrl = new urlParse(req.url)
     const code = queryParse.parse(queryUrl.query).code
     const oauth2client = new google.auth.OAuth2(
        // 'client_id',
        // 'client_secret',
        // 'redirect_uris'
        "510019787897-9hfjvuho1cnsf88j150cec2q5l38ghn8.apps.googleusercontent.com",
        "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",
        "http://localhost:1234/nutrition"
    )
    const token = await oauth2client.getToken(code)
    
    

    let stepArray = []
    try{
        const result =  await axios({
            method:"POST",
            headers:{
                Authorization:"Bearer "+token.tokens.access_token
            },
            "content-Type":"application/json",
            url:"https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        data:{
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
              }],
              "bucketByTime": { "durationMillis": 86400000 },
              "startTimeMillis": 1697135400000,
              "endTimeMillis": 1697653800000 
        }
        })
        
        stepArray =  result.data.bucket
        }  
        catch(error){
            console.log(error)  
        }

        try {
            for (const dataSet of stepArray){
                
                for (const point of dataSet.dataset){
                    for (const steps of point.point){
                        console.log(steps.value)
                    }
                    
                }
            }
        } catch (error) {
            
        }
       
    }
)

app.get('/nutrition',async (req,res)=>{
    const queryUrl = new urlParse(req.url)
     const code = queryParse.parse(queryUrl.query).code
     const oauth2client = new google.auth.OAuth2(
        // 'client_id',
        // 'client_secret',
        // 'redirect_uris'
        "510019787897-9hfjvuho1cnsf88j150cec2q5l38ghn8.apps.googleusercontent.com",
        "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",
        "http://localhost:1234/nutrition"
    )
    const token = await oauth2client.getToken(code)
    
    

    let stepArray = []
    try{
        const result =  await axios({
            method:"POST",
            headers:{
                Authorization:"Bearer "+token.tokens.access_token
            },
            "content-Type":"application/json",
            url:"https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        data:{
            "aggregateBy": [{
                "dataSourceId":
                  "raw:com.google.nutrition:407408718192:MyDataSource"
              }],
              "bucketByTime": { "durationMillis": 86400000 },
              "startTimeMillis": 1697135400000,
              "endTimeMillis": 1697653800000 
        }
        })
        
        stepArray =  result.data
        console.log(stepArray)
        }  
        catch(error){
            console.log(error)  
        }

        try {
            for (const dataSet of stepArray){
                
                // for (const point of dataSet.dataset){
                //     for (const steps of point.point){
                //         console.log(steps.value)
                //     }
                    
                // }
                // console.log(dataSet)
            }
        } catch (error) {
            
        }
       
    }
)
app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})