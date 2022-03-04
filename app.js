const express = require('express')
const app = express()
const bcryptjs = require('bcryptjs')
const dotenv = require('dotenv').config({path:'./env/.env'})
const connection = require('./database/db')
const path = require('path')
const ejs = require('ejs')

//GET DATA
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//STATIC FILES
app.use('/public',express.static('public'))
app.use('/public',express.static(path.join(__dirname + 'public')))

//Variables de session
const session = require('express-session')
app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false
})) 

app.use(function (req, res, next) {
    res.locals.user = null
    next()
  })



//EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//ROUTES 
const routes = require('./routes/routes')
app.use('/',routes)



//Signup data
app.post('/signup', async(req,res)=>{
    const {name,lastname,user,email,tel,pass} = req.body;
    let passwordHashed = await bcryptjs.hash(pass,8);
    
    connection.query('INSERT INTO weather_app_users SET ?', {name_:name,lastname_:lastname,user_:user,email:email,tel:tel,password_:passwordHashed},async(error,result)=>{
        if(error){
            console.log('there has been an error' + error)
        }else {
            res.render('signup',{
                alert:true,
                alertTitle:"Registration",
                alertMessage:"¡Successful Registration!",
                alertIcon:"success",
                showConfirmButton:false,
                timer:1500,
                ruta:''
            })
        }

    })

})


//LOGIN AUTH
app.post('/login',async(req,res)=>{
    const {user,pass} = req.body;
    let passwordHashed = await bcryptjs.hash(pass,8)
     
    if(user && pass){
        connection.query('SELECT * FROM weather_app_users WHERE user_ = ?', [user], async (error,results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass,results[0].password_))){
                res.render('login',{
                    alert:true,
                    alertTitle:"Error",
                    alertMessage:"invalid User/password",
                    alertIcon:"error",
                    showConfirmButton:true,
                    timer:false,
                    ruta:'login' 
                })
            }else {
                
                req.session.loggedin = true;
                req.session.name_ = results[0].name_ 
                
                if(req.session.loggedin) {
                    res.render('index',{ login:true, name :req.session.name_})
                     
                }else {
                    res.render('index',{
                        login:false,
                        name:'Inicia session'
                    })
                }
            
             res.render('login',{
                 alert:true,
                 alertTitle:"Successful log in",
                 alertMessage:"¡WELCOME TO WEATHER APP!",
                 alertIcon:"success",
                 showConfirmButton:false,
                 timer:1500,
                 ruta:'' 
             })
 
            }
        })
 
    }else {
       res.render('login',{
         alert:true,
         alertTitle:"Warning",
         alertMessage:"Please inser a valid user/password",
         alertIcon:"warning",
         showConfirmButton:true,
         timer:false,
         ruta:'login'
       })
    }
    

})

//AUTH NAME USER





//port 

const port = process.env.PORT || 3000 
app.listen(port,()=>{
    console.log('server on port: ' + port)
})