const Bcrypt=require ("bcrypt")
const db=require("./db")
const LocalStrategy=require("passport-local").Strategy
const moment = require("moment")

function initialize(passport){
    const authenticateUser= (email,password,done)=>{
        db.serialize(()=>{
            db.get(`Select email,password from members where email="${email}"`,(err,row)=>{
                console.log(row)
                if(row==null){
                    return done(null,false,{message:"User not found"})
                }
                try{
                    Bcrypt.compare(password,row.password,(err,res)=>{
                        if(res){
                            return done(null,row)
                        }
                        else{
                            return done(null,false,{message:"Password Incorrect"})
                        }
                    })
                    
                }
                catch(e){
                    return done(e)
                
            }
            })
            
        })
              
    }
    passport.use(new LocalStrategy({usernameField:"email"},authenticateUser))
    passport.serializeUser((member,done)=>{done(null,member.email)})
    
    passport.deserializeUser((email,done)=>{ 
        db.get(`Select * from members where email="${email}"`,(err,row)=>{
            done(null,row)
        })
        
    })
}
module.exports=initialize