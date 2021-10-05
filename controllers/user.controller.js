const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


function signUp(req, res) {
    models.Users.findOne({ where: { emailId: req.body.email } }).then(result => {
        if (result) {
            res.status(409).json({
                message: "Email already exists",
            });
        } else {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {
                    const user = {
                        firstName: req.body.firstname,
                        lastName: req.body.lastname,
                        userName: req.body.username,
                        emailId: req.body.email,
                        password: hash,
                        mobileNo: req.body.mobile
                    }

                    models.Users.create(user).then(result => {
                        // res.status(201).json({
                        //     success:{
                        //         message: "User signed up successfully",
                        //     }
                        // });
                        const token = jwt.sign({
                            emailId: user.emailId,
                            userId: user.id
                        }, 'secret', function (err, token) {
                            const data = {
                                message: "User signed up successfully",
                                token: token
                            }
                            res.send({ user: data });
                            // res.status(200).json({
                            //     success: {
                            //         message: "User signed up successfully",
                            //         token: token
                            //     }
                            // });
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                        });
                    });

                })
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        });
    });

}

function login(req, res) {
    models.Users.findOne({ where: { userName: req.body.username } }).then(user => {
        if (user === null) {
            res.status(401).json({
                message: "Invalid credentials",
            });
        } else {
            console.log(req.body.password);
            console.log(user.password);
            bcryptjs.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        emailId: user.emailId,
                        userId: user.id
                    }, 'secret', function (err, token) {
                        const data = {
                            message: "Authentication Successfull!",
                            token: token
                        }
                        // res.status(200).json({
                        //     success: {
                        //         message: 'Authentication Successfull!',
                        //         token: token
                        //     }
                        // });
                        res.send({ userLogin: data });
                    });
                } else {
                    res.status(500).json({
                        message: "Something went wrong!",
                    });
                }
            });
        }
    }).catch(error => {
        console.log(error, "skjdksd");
        res.status(500).json({
            message: "Something went wrong!",
        });
    })

}


function edit(req, res) {
    const id = req.params.id;
    models.Users.findByPk(id).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        })
    });

}
function index(req, res) {
    models.Users.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        })
    });

}

function update(req, res) {
    console.log("req",req);
    const id = req.params.id;
    console.log("id",id);
    const updateUser = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        mobileNo: req.body.mobile
    }
    console.log(updateUser);
    models.Users.update(updateUser, { where: { id: id } }).then(result => {
        const data = {
            message: "User profile update successfully",
            result: result[0]
        }
        res.send({ updateUser: data });
    }).catch(error => {
        res.status(500).json({ 
            message: "Something went wrong!",
            error: error
        });
    })
}

module.exports = {
    signUp: signUp,
    login: login,
    edit: edit,
    index: index,
    update: update,
}