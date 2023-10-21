const express =  require('express')
const app = express()
const port = 1234


app.get('/ting',(req,res)=>{
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})