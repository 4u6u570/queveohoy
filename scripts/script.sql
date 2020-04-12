CREATE DATABASE queVeoHoy;

use queVeoHoy;

CREATE TABLE `queVeoHoy`.`pelicula`(
  `id` int NOT NULL auto_increment,
  `titulo` varchar(100),
  `duracion` int(5),
  `director` varchar(400),
  `anio` int(5),
  `fecha_lanzamiento` date,
  `puntuacion` int(2),
  `poster` varchar(300),
  `trama` varchar(700),
  PRIMARY KEY (id)
);

CREATE TABLE `queveohoy`.`genero` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(30) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `queVeoHoy`.`pelicula`
ADD COLUMN  `genero_id` INT;

ALTER TABLE `queVeoHoy`.`pelicula` ADD FOREIGN KEY (`genero_id`) REFERENCES `queVeoHoy`.`genero`(`id`);

CREATE TABLE `queVeoHoy`.`actor` (
  `id` INT auto_increment,
  `nombre` varchar(70),
  PRIMARY KEY(`id`)
);

CREATE TABLE `queVeoHoy`.`actor_pelicula` (
  `id` INT auto_increment,
  `actor_id` int,
  `pelicula_id` int,
  PRIMARY KEY(`id`)
);

ALTER TABLE `queVeoHoy`.`actor_pelicula`  ADD FOREIGN KEY (actor_id) REFERENCES `queVeoHoy`.`actor` (`id`);

ALTER TABLE `queVeoHoy`.`actor_pelicula`  ADD FOREIGN KEY (pelicula_id) REFERENCES `queVeoHoy`.`pelicula` (`id`);
