require('dotenv').config();
const express = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const app = express();
require("./db/conn");
const Register =require("./models/registers");
const hbs = require("hbs");
const { registerPartial } = require("hbs");
const port = process.env.PORT || 8000;
const static_path =path.join(__dirname, "../public");
const template_path =path.join(__dirname , "../templates/views");
const partials_path= path.join(__dirname , "../templates/partials");


//console.log(path.join(__dirname , "../public"));
app.set("view engine","hbs");
app.use(express.static(static_path));
app.set("views" , template_path)
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));


//  console.log(process.env.SECRETE_KEY);

app.get("/" , (req,res)=>{
res.render("index");
})

app.get("/register" , (req,res)=>{
    res.render("register");
    })

app.get("/login" , (req,res)=>{
    res.render("login");
})

    // create new user in our database

    app.post("/register" , async(req,res)=>{
        try{
            const password = req.body.password;
            const cpassword = req.body.confirmpassword;
            if(password===cpassword){
                const registerEmployee = new Register({

                    firstname:req.body.firstname,
                    lastname : req.body.lastname,
                    email : req.body.email,
                    gender: req.body.gender,
                    phone : req.body.phone,
                    age : req.body.age,
                    password:req.body.password,
                    confirmpassword :req.body.cpassword
                })
                //middleware data ko get karne ke bad and save karne ke pehle 
                  //password hash
                  //to generate a token
                  console.log("the success part" + registerEmployee);
                  const token = await registerEmployee.generateAuthToken();
                   console.log(token);


                const registered = await registerEmployee.save();
                res.status(201).render("index");
            }else{
                res.send("password not matching");
            }

        }catch(e){
            res.status(400).render(e);
        }
       
        })
        //login check
      
        app.post("/login" , async(req,res)=>{
            try{
                const email =req.body.email;
                const password =req.body.password;
                // console.log(`${email} and password is ${password}`);
                const useremail= await Register.findOne({email:email});
               const isMatch = await bcrypt.compare(password,useremail.password);
               const token = await useremail.generateAuthToken();
               console.log("the token part " + token);
                if(isMatch){
                    res.status(201).render("index");
                }else{
                   res.send("invalid password Details") ;
                }
            }catch(e){
                res.status(400).send("invalid Login Details");
            }
        })


    //     //create jason web token

    //     const jwt = require("jsonwebtoken");
    //     const createToken = async()=>{
        
    //     const token =  await jwt.sign({_id:"2123323123"},"mynameispoonampleasinggirl",{expiresIn:"2 seconds"});
    //     //here object payload {}:esme vahi data pass karege jo unique ho adn id is unique for all
    //     //secret key:dusara user claim ni kar sakta ki me ye user ni hu it should be atleast 32 char. long
    //     //expiresIn:means kitne min, sec day bad apko expire karna hai eske expire hone par apko page login karna rahega
    //     console.log(token) ;
    //        const userVer = await jwt.verify(token,"mynameispoonampleasinggirl");
    //     console.log(userVer);
    //     }
    //    createToken();

app.listen(port , (req,res)=>{
console.log(`server at run on port no ${port}`);
})