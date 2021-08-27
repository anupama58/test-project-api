const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


function signUp(req, res){
    models.Users.findOne({where:{emailId:req.body.email}}).then(result=>{
        if(result){
            res.status(409).json({
                message: "Email already exists",
            });
        }else{
            bcryptjs.genSalt(10,function(err,salt){
                bcryptjs.hash(req.body.password,salt, function(err,hash){
                    const user = {
                        firstName:req.body.firstname,
                        lastName:req.body.lastname,
                        userName:req.body.username,
                        emailId:req.body.email,
                        password:hash,
                        mobileNo:req.body.mobile
                    }
                
                    models.Users.create(user).then(result=>{
                        // res.status(201).json({
                        //     success:{
                        //         message: "User signed up successfully",
                        //     }
                        // });
                        const token = jwt.sign({
                            emailId:user.emailId,
                            userId:user.id
                        },'secret',function(err,token){
                            res.status(200).json({
                                success:{
                                    message:"User signed up successfully",
                                    token:token  
                                }
                            });
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                        });
                    });
        
                })
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message: "Something went wrong!",
        });
    });

}

function login(req,res){
    models.Users.findOne({where:{userName:req.body.username}}).then(user => {
        console.log(user);
        if(user === null){
            res.status(401).json({
                message: "Invalid credentials",
            });
        }else{
            console.log(req.body.password);
            console.log(user.password)
            bcryptjs.compare(req.body.password,user.password,function(err,result){
                console.log(err);
                console.log(result);
                if(result){
                    const token = jwt.sign({
                        emailId:user.emailId,
                        userId:user.id
                    },'secret',function(err,token){
                        res.status(200).json({
                            success:{
                                message:"Authentication Successful!",
                                token:token  
                            }
                        });
                    });
                }else{
                    res.status(500).json({
                        message: "Something went wrong!",
                    });
                }
            });
        }
    }).catch(error=>{
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    })

}


function edit(req, res){
    const id = req.params.id;
    models.Users.findByPk(id).then(result=>{
        res.status(200).json(result);
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!",
        })
    });

}
function index(req, res){
    models.Users.findAll().then(result=>{
        res.status(200).json(result);
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!",
        })
    });

}

function update(req, res){
    console.log("lklkl");
    console.log(req.body.firstName);
    const id = req.params.id;
    const updateUser = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        userName:req.body.userName,
        emailId:req.body.emailId,
        mobileNo:req.body.mobileNo
    }
    console.log(updateUser);
    models.Users.update(updateUser,{where:{id:id}}).then(result=>{
        res.status(200).json({
            message:"User profile update successfully",
            user:result
        });
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!",
            error:error
        });
    })
}

module.exports = {
    signUp: signUp,
    login: login,
    edit:edit,
    index:index,
    update:update,
}