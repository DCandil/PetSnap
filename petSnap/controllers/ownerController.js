const connection = require("../config/db");
const bcrypt = require("bcrypt");

class OwnerController {
  showRegister = (req, res) => {
    res.render("formAddOwner");
  };

  register = (req, res) => {
    console.log(req.file);
    console.log(req.body);

    const {
      owner_name,
      owner_lastname,
      email,
      owner_description,
      contact_phone,
      password,
      repPassword,
    } = req.body;
    if (!owner_name || !owner_lastname || !email || !password || !repPassword) {
      res.render("formAddOwner", {
        message: "Estos campos (*) son obligatorios",
      });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) {
          throw errHash;
        } else {
          let sql = `INSERT INTO owner (owner_name, owner_lastname, email, password, owner_description, contact_phone) VALUES (?, ?, ?, ?, ?, ?)`;
          let values = [
            owner_name,
            owner_lastname,
            email,
            hash,
            owner_description,
            contact_phone,
          ];
          if (req.file) {
            sql = `INSERT INTO owner (owner_name, owner_lastname, email, password, owner_description, contact_phone, owner_img) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values.push(req.file.filename);
          }
          connection.query(sql, values, (err, result) => {
            if (err) {
              if (err.errno == 1062) {
                res.render("formAddOwner", {
                  message: "El email utilizado ya está en uso",
                });
              } 
              else {
                throw err;
              }
            } 
            else {
              res.redirect("/");
            }
          });
        }
      });
    } 
    else {
      res.render("formAddOwner", { message: "Las contraseñas no coinciden" });
    };
  };

  showOneOwner = (req, res, next) => {
    const { id } = req.params; 
    let sqlOwner =  "SELECT * FROM owner WHERE owner_id = ? AND owner_is_deleted = 0 LIMIT 10";
    let sqlPet = "SELECT * FROM pet WHERE owner_id = ? AND pet_is_deleted = 0 LIMIT 10";

    connection.query(sqlOwner, [id], (errOwner, resultOwner) => {
      if (errOwner) {
        throw errOwner;
      } 
      else {
        if (resultOwner.length == 0) {
          next();
        } 
        else {
          connection.query(sqlPet, [id], (errPet, resultPet) => {
            if (errPet) {
              throw errPet;
            } 
            else {
              res.render("showOwner", {resultOwner: resultOwner[0], resultPet});
            }
          });
        };
      };
    });
  };

  editShowOwner = (req, res) => {
      const { id } = req.params; 
      let sqlOwner =  "SELECT * FROM owner WHERE owner_id = ? AND owner_is_deleted = 0";
      let sqlPet = "SELECT * FROM pet WHERE owner_id = ? AND pet_is_deleted = 0";
  
      connection.query(sqlOwner, [id], (errOwner, resultOwner) => {
        if (errOwner) {
          throw errOwner;
        } 
        else {
          if (resultOwner.length == 0) {
            next();
          } 
          else {
            connection.query(sqlPet, [id], (errPet, resultPet) => {
              if (errPet) {
                throw errPet;
              } 
              else {
                res.render("editShowOwner", {resultOwner: resultOwner[0], resultPet});
              };
            });
          };
        };
      });
    };


  showLogin = (req, res) => {
    res.render("login");
  }

  login = (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    let sql = "SELECT * FROM owner WHERE email = ? AND owner_is_deleted = 0";

    connection.query(sql, [email], (err, result)=> {
      if(err){
        throw err;
      }
      else{
        if(!result.length){
          res.render("login", { message: "El correo electrónico que has introducido no está conectado a una cuenta" });
        }
        else{
          let hash = result[0].password;
          bcrypt.compare(password, hash, (err, resultCompare)=> {
            console.log("resCompare: ", resultCompare);
            if(!resultCompare){
              res.render("login", { message: "Contraseña incorrectas" });
            } 
            else {
              let id = result[0].owner_id;
              res.redirect(`/owner/editShowOwner/${id}`)
            };
          });
        };
      };
    });
  };
};


module.exports = new OwnerController();
