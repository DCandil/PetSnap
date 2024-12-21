CREATE DATABASE petsnap;

USE petsnap;

CREATE TABLE owner (
    owner_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    owner_name VARCHAR(50) NOT NULL,
    owner_lastname VARCHAR(100) NOT NULL,
    email VARCHAR(75) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    owner_description VARCHAR(255),
    contact_phone VARCHAR(15),
    owner_img VARCHAR(100),
    owner_is_deleted BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE pet (
    pet_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pet_name VARCHAR(50) NOT NULL,
    pet_description VARCHAR(255),
    adoption_year YEAR(4) NOT NULL,
    species VARCHAR(25) NOT NULL,
    pet_img VARCHAR(100),
    owner_id INT UNSIGNED NOT NULL,
    pet_is_deleted BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_owner_id FOREIGN KEY (owner_id)
        REFERENCES owner(owner_id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT * FROM owner;
SELECT * FROM pet;



