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
db.run("Create table if not exists members(Name text , timer integer, age integer, email text primary key, phone integer , timeslot text, password text, newtimeslot text, paymentstatus text)")
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
    const timeslot=req.body.timeslot
    const age=req.body.age
    const payment="false"
    var flag=0;
    db.serialize(()=>
   
    bcrypt.hash(password,7,(err,password2)=>{
        db.run(`Insert into members values("${name}",NULL,"${age}","${email}","${phno}","${timeslot}","${password2}","${timeslot}","${payment}")`,(err)=>{
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
    data.fee=req.user.paymentstatus
    data.name=req.user.Name
    data.card1_date=moment().format("DD/MM/yyyy")
    data.card2_date=moment().add(1,"Days").format("DD/MM/yyyy")
    data.card3_date=moment().add(2,"Days").format("DD/MM/yyyy")
    data.card4_date=moment().add(3,"Days").format("DD/MM/yyyy")
    data.card5_date=moment().add(4,"Days").format("DD/MM/yyyy")
    data.card6_date=moment().add(5,"Days").format("DD/MM/yyyy")
    data.card1_time=req.user.timeslot
    if(moment().add(1,"Days").month()!=moment().month())
    {
        data.card2_time=req.user.newtimeslot
    }
    else{
        data.card2_time=req.user.timeslot

    }
    if(moment().add(2,"Days").month()!=moment().month())
    {
        data.card3_time=req.user.newtimeslot
    }
    else{
        data.card3_time=req.user.timeslot

    }
    if(moment().add(3,"Days").month()!=moment().month())
    {
        data.card4_time=req.user.newtimeslot
    }
    else{
        data.card4_time=req.user.timeslot

    }
    if(moment().add(4,"Days").month()!=moment().month())
    {
        data.card5_time=req.user.newtimeslot
    }
    else{
        data.card5_time=req.user.timeslot

    }
    if(moment().add(5,"Days").month()!=moment().month())
    {
        data.card6_time=req.user.newtimeslot
    }
    else{
        data.card6_time=req.user.timeslot

    }
    console.log(data)
    res.render(basepath+"Land.html",data)



}
function update(req,res,next){
    if(req.user.timer!=moment().month()+1&&req.user.timeslot!=req.user.newtimeslot){
        db.run(`Update members set timeslot="${req.user.newtimeslot}" where email="${req.user.email}"`,(err)=>{
            console.log(err)
           
            if(err)
            {
                res.send(err)
            }
            next()
        })

    }
    if(req.user.timer!=moment().month()+1){
        db.run(`Update members set paymentstatus='false' where email="${req.user.email}"`,(err)=>{
            console.log(err)
           
            if(err)
            {
                res.send(err)
            }
            next()
        })

    }
    next()

    
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
function gettime(req,res,next){
    res.render(basepath+"time.html",{flash:"ere"})
}
function chslot(req,resp,next){
    var password=req.body.password;
    var slot=req.body.slot
    var timer=moment().month()+1;
    console.log(timer)
    bcrypt.compare(password,req.user.password,(err,res)=>{
        if(res){
        db.run(`Update members set newtimeslot="${slot}",timer=${timer} where email="${req.user.email}"`,(err)=>{
            resp.render(basepath+"time.html",{flash:"success"})
        })}
        else{
            resp.render(basepath+"time.html",{flash:"failure"})

        }
    })
        
}
function summarysubmit(req,res,next){
    test=req.body.text
    res.redirect(`http://localhost:8081/summarise?text=${test}`)
}
function topicsubmit(req,res,next){
    test=req.body.text
    res.redirect(`http://localhost:8081/topic?text=${test}`)
}
function sentimentsubmit(req,res,next){
    test=req.body.text
    res.redirect(`http://localhost:8081/sentiment?text=${test}`)
}
function topic(req,res,next){
    res.sendFile(basepath+"Topic.html")
}
function sentiment(req,res,next){
    res.sendFile(basepath+"Sentiment.html")
}
app.post("/chslot",Check,chslot)
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
app.get("/landing",Check,update,landing)
app.get("/time",Check,gettime)
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


