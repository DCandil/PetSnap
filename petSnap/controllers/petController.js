const connection = require("../config/db");
const deleteFile = require("../utils/deletefile");

class PetController {
  addNewPet = (req, res) => {
    const { owner_id } = req.params;
    const { pet_name, pet_description, adoption_year, species } = req.body;

    console.log(owner_id);

    let sql =
      "INSERT INTO pet (pet_name, pet_description, adoption_year, species, owner_id) VALUES (?, ?, ?, ?, ?)";
    let values = [pet_name, pet_description, adoption_year, species, owner_id];

    if (req.file) {
      sql =
        "INSERT INTO pet (pet_name, pet_description, adoption_year, species, owner_id, pet_img) VALUES (?, ?, ?, ?, ?, ?)";
      values.push(req.file.filename);
    }

    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/owner/showOwner/${owner_id}`);
      }
    });
  };

  showFormPetRegister = (req, res) => {
    let sql =
      "SELECT owner_id, owner_name FROM owner WHERE owner_is_deleted = 0";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } 
      else {
        console.log(result);
        res.render("formAddPet", { result });
      }
    });
  };

  createFormAddPet = (req, res) => {
    const { pet_name, pet_description, adoption_year, species, owner_id } =
      req.body;

    if (
      !pet_name ||
      !pet_description ||
      !adoption_year ||
      !species ||
      !owner_id
    ) {
      let sql =
        "SELECT owner_id, owner_name FROM owner WHERE owner_is_deleted = 0";
      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } 
        else {
          res.render("formAddPet", { result, message: "Los datos (*) deben estar cumplimentados" });
        }
      });
    } 
    else {
      let sql = `INSERT INTO pet (pet_name, pet_description, adoption_year, species, owner_id) VALUES (?, ?, ?, ?, ?)`;
      let values = [
        pet_name,
        pet_description,
        adoption_year,
        species,
        owner_id,
      ];

      if (req.file) {
        values = [
          pet_name,
          pet_description,
          adoption_year,
          species,
          owner_id,
          req.file.filename,
        ];

        sql = `INSERT INTO pet (pet_name, pet_description, adoption_year, species, owner_id, pet_img) VALUES (?, ?, ?, ?, ?, ?)`;
      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } 
        else {
          res.redirect(`/owner/showOwner/${owner_id}`);
        };
      });
    };
  };

  delPet = (req, res) => {
    const { pet_id } = req.params;

    let sql1 = "SELECT owner_id, pet_img FROM pet WHERE pet_id = ?";
    connection.query(sql1, [pet_id], (errSelect, resultSelect) => {
      if (errSelect) {
        throw errSelect;
      }
      else {
        const { owner_id, pet_img } = resultSelect[0];
        let sql2 = "DELETE FROM pet WHERE pet_id = ?";
        connection.query(sql2, [pet_id], (errDel, resultDel) => {
          if (errDel) {
            throw errDel;
          } 
          else {
            if (pet_img) {
              deleteFile(pet_img, "pet");
            };
            res.redirect(`/owner/showOwner/${owner_id}`);
          };
        });
      };
    });
  };

  showFormEditPet = (req, res, next) => {
    const { pet_id } = req.params;
    let sql = "SELECT * FROM pet WHERE pet_id = ? AND pet_is_deleted = 0";
    connection.query(sql, [pet_id], (err, result) => {
      if (err) {
        throw err;
      } 
      else {
        if (!result.length) {
          next();
        } 
        else {
          res.render("formEditPet", { result: result[0] });
        };
      };
    });
  };

  editPet = (req, res) => {
    const { pet_id } = req.params;
    const { pet_name, pet_description, adoption_year, species } = req.body;

    if (!pet_name || !adoption_year || !species) {
      let result = {
        pet_id: pet_id,
        pet_name: pet_name,
        pet_description: pet_description,
        adoption_year: adoption_year,
        species: species,
      };
      res.render("formEditPet", {
        result,
        message: "No puede haber ningún campo vacío",
      });
    } 
    else {
      let sql =
        "UPDATE pet SET pet_name = ?, pet_description = ?, adoption_year = ?, species = ? WHERE pet_id = ?";
      let values = [pet_name, pet_description, adoption_year, species, pet_id];
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } 
        else {
          let sql1 = "SELECT * FROM pet WHERE pet_id = ?";
          connection.query(sql1, [pet_id], (err1, result1) => {
            if (err1) {
              throw err1;
            } 
            else {
              let owner_id = result1[0].owner_id;
              res.redirect(`/owner/editShowOwner/${owner_id}`);
            };
          });
        };
      });
    };
  };

  delLogicPet = (req, res) => {
    const { pet_id, owner_id } = req.params;

    let sql = 'UPDATE pet SET pet_is_deleted = 1 WHERE pet_id = ?'
    connection.query(sql, [pet_id], (err, result)=>{
      if(err){
        throw err;
      }
      else{
        res.redirect(`/owner/editShowOwner/${owner_id}`);
      };
    });
  };
};

module.exports = new PetController();
