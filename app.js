const express = require('express')
const app = express()
const bcrypy = require('bcryptjs')
const dotenv = require('dotenv').config({path:'./env/.env'})


//GET DATA
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//STATIC FILES
app.use('/public',express.static('public'))
app.use('/public',express.static(__dirname + 'public'))

//EJS
app.set('view engine', 'ejs')

//Variables de session
const session = require('express-session')
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
})) 

//ROUTES 
const routes = require('./routes/routes')
app.use('/',routes)

//port 

const port = process.env.PORT || 5000 
app.listen(port,()=>{
    console.log('server on port: ' + port)
})