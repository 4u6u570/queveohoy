var con = require("../lib/conexionbd");

function listarPeliculas(req, res) {
    let sql = "select * from pelicula";
    con.query(sql, function(error, resultado, fields){
        if(error){
            console.log("Ocurrió un error al realizar la consulta.", error.message);
            return res.status(500).send("Ocurrió un error al realizar la consulta.");
        }
        var respuesta = {
            peliculas: resultado
        };
        res.send(JSON.stringify(respuesta));
    });
}


module.export = {
    listarPeliculas: listarPeliculas
};