const connection = require('../config/db');


class IndexController {
  openHome = (req, res) => {
    let sqlOwner = `SELECT * FROM owner WHERE owner_is_deleted = 0`;
    let sqlPet = `SELECT * FROM pet WHERE pet_is_deleted = 0;`

    connection.query(sqlOwner, (errOwner, resultOwner) => {
      if (errOwner) {
        throw errOwner;
      } 
      else {
        connection.query(sqlPet,(errPet, resultPet)=>{
          if(errPet){
            throw errPet;
          } 
          else {
            res.render('index', { resultOwner, resultPet });
          };
        });
      };
    });
  };

  openContact = (req, res) => {
    res.render("contact")
  };

  sendContact = (req, res) => {
    console.log("DATOS FORMULARIO:", req.body);
    res.redirect("/");
  }
};

module.exports = new IndexController();