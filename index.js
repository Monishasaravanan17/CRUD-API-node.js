const express = require('express');
const app = express();
const mySql = require("mysql");
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = mySql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "login"
});

db.connect(function (err) {
    if (err) throw err;
});

app.use(cors());
app.use(express.json());

//----------- register api using promise  ------------
app.post("/api/register", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const salt = 10;
    const encryptedPassword = bcrypt.hashSync(password, salt);
    console.log("register api hitted...")
    let myPromise = new Promise(function (myResolve, myReject) {
        const timeobj = setTimeout(() => {
            db.query("SELECT * FROM regtable WHERE email = ?", [email], (req, result) => {
                if (result.length > 0) {
                    myResolve("user already exists,Please Login");
                } else {
                    db.query("INSERT INTO regtable (firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (req, res) => {
                        myReject("Registered Successfully");
                    })
                }
            })
        }, 5000);
    });
    myPromise.then(
        function (value) {
            res.send(value);
        },
        function (error) {
            res.send(error);
        }

    );
});

// ----------------until here--------------


// -----------------working register api--------------


// app.post("/api/register", (req, res) => {
//     const firstname = req.body.firstname;
//     const lastname = req.body.lastname;
//     const email = req.body.email;
//     const password = req.body.password;
//     const salt = 10;
//     const encryptedPassword = bcrypt.hashSync(password, salt);
//     console.log("register api hitted...")
//     const timeobj = setTimeout(() => {
//         db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
//             if (err) {
//                 res.send(err)
//             }
//             clearTimeout(timeobj);
//             console.log(result)

//             if (result.length > 0) {
//                 res.send("you already have an account,please login")
//             } else {
//                 db.query("INSERT INTO regtable (firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (err, result) => {
//                     if (err) {
//                         return res.send(err);
//                     } else {
//                         return res.send("Registered successfully");
//                     }
//                 })
//             }
//         })
//     }, 5000);
// });

// ---------------------------untill here------------------------

// app.post("/api/register", (req, res) => {
//     const firstname = req.body.firstname;
//     const lastname = req.body.lastname;
//     const email = req.body.email;
//     const password = req.body.password;
//     const salt = 10;
//     const encryptedPassword = bcrypt.hashSync(password, salt);
//     asyncCall();
//     function resolveAfter5Seconds() {
//         setTimeout(() => {
//             db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
//                 if (err) {
//                     res.send(err)
//                 }
//                 console.log(result)
//                 if (result.length > 0) {
//                     return ( "you already have an account,please login" );
//                 }
//                 db.query("INSERT INTO regtable (firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (err, res) => {
//                     if (err) {
//                         return res.send(err);
//                     } else {
//                         return ( "Registered successfully" );
//                     }
//                 })
//             })
//         }, 5000);
//     }

//     async function asyncCall() {
//         res.send("loading...")
//         console.log('loading');
//         return await resolveAfter5Seconds();

//     }
//     console.log("register api hitted...")
// });

//     const promise = new promise(function (ressolve,reject)  {
//         db.query("SELECT * FROM regtable WHERE email = ?" [email],(err,res) =>{
//             if(err){
//                 res.send (err)
//             }
//         })
//     });
//     const getdata = async()=> {
//         try{
// return await res.send({message:"user already exist,login please"})
//         }
//         catch{

//         }
//     }
// async function promise(success, failure) {

//     db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
//         if (err) {
//             return res.send(err);
//         }
//         if (result[0]) {
//             return await({ message: "user already exist, please login" });
//         } else {
//             db.query("INSERT INTO regtable (firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (err, result) => {
//                 if (err) {
//                     return await(err)
//                 } else {
//                     return await({ message: "registered successfully" })
//                 }

//             })
//         }
//     })

// }.then(success)

// async function app() {

//     db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
//         if (err) {
//             return res.send(err);
//         }
//         console.log("result", result);
//         return await(success)
//     }, 5000).then((success) => {
//         if (result[0]) {
//             return res.send({ message: "user already exists,please login" });
//         } else {
//             db.query("INSERT INTO regtable(firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (err, result) => {
//                 if (err) {
//                     return res.send(err);
//                 } else {
//                     return res.send({ message: "registered successfull" });
//                 }
//             })
//         }

//     }).catch((e) => {
//         return res.send(err)
//     });
// }

// setTimeout(function () {
//     const message = res.send({ message: "user already exists,please login" });

//     console.log("time delayed...")
//     db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
//         if (err) {
//             return res.send(err)
//         }

//         if (result.length > 0) {
//             return message;
//         }
//     })
//     db.query("INSERT INTO regtable(firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (err, result) => {
//         if (err) {
//             return res.send(err);
//         } else {
//             return res.send({ message: "registered successfull" });
//         }
//     })
// }, 5000)




app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.send(err);

        }

        if (result[0]) {
            console.log("result", result)
            bcrypt.compare(password, result[0].password).then((success) => {
                if (success) {
                    return res.send({ message: "login successfully", result: result });
                } else {
                    return res.send({ message: "Please,enter the correct password" });
                }

            }).catch((failed) => {
                return res.send({ message: "Something wrong" });
            })


        } else {
            return res.send({ message: "invalid email,please register" });
        }

    })
});

app.post("/api/update", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    db.query("SELECT * FROM regtable WHERE email= ?", [email], (err, result) => {
        if (err) {
            return res.send(err)
        }

        if (result[0]) {
            db.query("UPDATE regtable SET firstname = ?,lastname = ? WHERE email = ?", [firstname, lastname, email], (err, updatedresult) => {
                if (err) {
                    return res.send(err);
                }

                return res.send({ message: "updated successfully" });


            })
        } else {
            return res.send({ message: "Please,Enter the correct email" });
        }
    })


})

app.post("/api/delete", (req, res) => {

    const email = req.body.email;
    db.query("SELECT * FROM regtable WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.send(err);
        }

        if (result[0]) {
            db.query("DELETE FROM regtable WHERE email = ?", [email], (err, response) => {
                if (err) {
                    return res.send(err);
                }

                return res.send({ message: "Deleted successfully" });


            })
        } else {
            return res.send({ message: "Please,Enter a correct email id" });
        }
    })
})

app.listen(3000, () => {
    console.log("running port...")
})