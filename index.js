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

//----------- register api using promise  -----------------------------
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
                    myResolve({ message: "user already exists,Please Login" });
                } else {
                    db.query("INSERT INTO regtable (firstname,lastname,email,password) VALUES (?,?,?,?)", [firstname, lastname, email, encryptedPassword], (req, res) => {
                        myReject({ message: "Registered Successfully" });
                    })
                }
            })
        }, 5000);
    }).then(
        function (value) {
            return res.send(value);
        }).catch(
            function (err) {
                return res.send(err);
            }
        )
});

// ----------------until here---------------------------------


// -----------------without promise register api--------------


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


// ------------login API-----------------------------------------

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
                    return res.send({ message: "Oops your password was incorrect" });
                }

            }).catch((failed) => {
                return res.send({ message: "Oops...Something went wrong" });
            })


        } else {
            return res.send({ message: "invalid email,please register" });
        }
    })
});

// -------------------------untill here----------------------------------

//--------------------update API-----------------------------------------

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
});

// ------------------untill here---------------------------------------

// --------------delete API--------------------------------------------

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
            return res.send({ message: "Oops....invalid mailId" });
        }
    })
})

// -----------------------------untill here----------------------------------------

app.listen(3000, () => {
    console.log("running port...")
})