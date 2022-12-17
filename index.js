const express=require("express")
 const moment = require("moment")
const bodyParser=require("body-parser")
const passport =require("passport")
const flash =require("express-flash")
const session =require("express-session")
const basepath=process.cwd()+"/";
const bcrypt=require("bcrypt")
const db=require("./db")
var app=express()
const MY_SECRET_KEY="qazwsxedcrfvtgbyhnujmiklop"
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({extended: true})) 
const initializePassport=require("./passport-strategy")
initializePassport(passport)
app.use(flash())
app.use(session({
    secret:MY_SECRET_KEY,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
db.run("Create table if not exists members(Name text , timer integer, age integer, email text primary key, phone integer , password text, paymentstatus text)")
const port= process.env.PORT ||5000
app.use(express.static(basepath))
app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});
function register(req,res,next){
    res.sendFile(basepath+"register.html")
}
function registerpost(req,res,next){
    const name=req.body.name
    const password=req.body.password
    const phno=req.body.phno
    const email= req.body.email
    const age=req.body.age
    const payment="false"
    var flag=0;
    db.serialize(()=>
   
    bcrypt.hash(password,3,(err,password2)=>{
        db.run(`Insert into members values("${name}",NULL,"${age}","${email}","${phno}","${password2}","${payment}")`,(err)=>{
            if(err){
                res.render(basepath+"/Home.html",{flash:"failure"})
            }  
            else{
                res.render(basepath+"/Home.html",{flash:"success"})

            }              
            
        })
        console.log(flag)


    }) )
    
    
}
function home(req,res,next){
    res.render(basepath+"Home.html",{flash:"ere"})

}
function getlogin(req,res,next){
    res.render(basepath+"login.html",{flash:false})
}
function getlogin2(req,res,next){
    res.render(basepath+"login.html",{flash:true})
}
function summarise(req,res,next){
    res.sendFile(basepath+"Summarisation.html")
}
function landing(req,res,next){
    data={}
    
    data.name=req.user.Name
    res.render(basepath+"Land.html",data)
}

function Check(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/")
}
function getpayfee(req,res,next){
res.sendFile(basepath+"fees.html")
}
function CompletePayment(req,res,next){
    db.run(`Update members set paymentstatus="true" where email="${req.user.email}"`,(err)=>{
        res.send("Success")

    })
}
function getcp(req,res,next){
    res.sendFile(basepath+"cp.html")
    }
function chpwd(req,res,next){
    var password=req.body.password;
    bcrypt.hash(password,17,(err,password2)=>{
        db.run(`Update members set password="${password2}" where email="${req.user.email}"`,(err)=>{
            res.redirect("/landing")
        })
    })
}


function summarysubmit(req,res,next){
    test=req.body.text
    res.redirect(`http://localhost:8081/summarise?text=${test}`)
}
function topicsubmit(req,res,next){
    test=req.body.text
    res.redirect(`https//nlphub-api.onrender.com/topic?text=${test}`)
}
function senntsubmit(req,res,next){
    test=req.body.text
    res.redirect(`http://nlphub-api.onrender.com/sentiment?text=${test}`)
}
function topic(req,res,next){
    res.sendFile(basepath+"Topic.html")
}
function sentiment(req,res,next){
    res.sendFile(basepath+"Sentiment.html")
}
app.get("/getcp",Check,getcp)
app.get("/",home)
app.post("/chpwd",chpwd)
app.get("/login",getlogin)
app.get("/summarise",Check,summarise)
app.get("/topic",Check,topic)
app.get("/sentiment",Check,sentiment)
app.post("/summarysubmit",Check,summarysubmit)
app.post("/topicsubmit",Check,topicsubmit)
app.post("/sentimentsubmit",Check,sentimentsubmit)
app.get("/login2",getlogin2)
app.get("/landing",Check,landing)
app.get("/register",register)
app.post("/register",registerpost)
app.post("/login",passport.authenticate("local",{
    successRedirect:"/landing",
    failureRedirect:"/login2",
    failureFlash:true
}))
app.get('/logout', (req, res) => {
    req.logOut((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
    
  })


