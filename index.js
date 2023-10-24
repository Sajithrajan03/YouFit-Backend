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

const oauth2client = new google.auth.OAuth2(
    // 'client_id',
    // 'client_secret',
    // 'redirect_uris'
    "510019787897-9hfjvuho1cnsf88j150cec2q5l38ghn8.apps.googleusercontent.com",
    "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",
    "http://localhost:1234/nutrition"
)

const stepsScopes = ["https://www.googleapis.com/auth/fitness.activity.read"];
const nutritionScopes = ["https://www.googleapis.com/auth/fitness.nutrition.read"];

const handleOAuth2 = async (req, res , scopes) => {
    // Generate the authorization URL
    const authUrl = oauth2client.generateAuthUrl({
      access_type: "offline", // Request offline access to get a refresh token
      scope: scopes,
      
      
      
    });
    res.redirect(authUrl);
}


app.get('/steps', (req, res) => {
  handleOAuth2(req, res, stepsScopes);
});

app.get('/nutrition', (req, res) => {
  handleOAuth2(req, res, nutritionScopes);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2client.getToken(code);
  const accessToken = tokens.access_token;

  if (req.query.state.includes('steps')) {
    try {
      const result = await axios({
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        'content-Type': 'application/json',
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        data: {
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: 1697135400000,
          endTimeMillis: 1697653800000,
        },
      });

      const stepArray = result.data.bucket;
      // Process step count data here
      res.json(stepArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch step data' });
    }
  } else if (req.query.state.includes('nutrition')) {
    try {
      const result = await axios({
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        'content-Type': 'application/json',
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        data: {
          aggregateBy: [
            {
              dataSourceId: 'raw:com.google.nutrition:407408718192:MyDataSource',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: 1697135400000,
          endTimeMillis: 1697653800000,
        },
      });

      const nutritionData = result.data;
      // Process nutrition data here
      res.json(nutritionData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch nutrition data' });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
