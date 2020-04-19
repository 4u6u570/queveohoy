var con = require("../lib/conexionbd");

function listarPeliculas(req, res) {
    var filtros = [];
    var parametros = Object.keys(req.query);
    var cantidad = req.query.cantidad;
    var pagina = req.query.pagina;

    let sql = "select * from pelicula";
    let sqlTotal = "SELECT COUNT(*) FROM PELICULA";

    parametros.forEach(parametro => {
        if (parametro != 'pagina' &&
            parametro != 'cantidad' &&
            parametro != 'columna_orden' &&
            parametro != 'tipo_orden') {
            switch (parametro) {
                case 'genero':
                    filtros.push(`genero_id = ${req.query.genero}`);
                    break;
                case 'titulo':
                    filtros.push(`titulo like '%${req.query.titulo}%'`);
                    break;
                default:
                    filtros.push(`${parametro} = ${req.query[parametro]}`);
                    break;
            }
        }
    });
    if (filtros.length != 0) {
        sql += " where " + filtros.join(" and ");
        sqlTotal += " where " + filtros.join(" and ");
    }
    sql += ` order by ${req.query.columna_orden} ${req.query.tipo_orden}
             limit ${(pagina - 1) * cantidad}, ${cantidad}`;

    //console.log("sql: " + sql);
    // console.log("sqlTotal: " + sqlTotal);

    con.query(sql, function (error, resultado, fields) {
        con.query(sqlTotal, function (error, resultadoTotal, fields) {
            if (error) {
                console.log("Ocurrió un error al realizar la consulta.", error.message);
                return res.status(500).send("Ocurrió un error al realizar la consulta.");
            }
            var respuesta = {
                peliculas: resultado,
                total: resultadoTotal[0]['COUNT(*)']
            };
            res.send(JSON.stringify(respuesta));
        });
    });
}

//generos

function listarGenero(req, res) {
    let sql = "select * from genero";
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Ocurrió un error al realizar la consulta.", error.message);
            return res.status(500).send("Ocurrió un error al realizar la consulta.");
        }
        var respuesta = {
            generos: resultado
        };
        res.send(JSON.stringify(respuesta));
    });
}

function buscarPelicula(req, res) {
    var sqlPelicula = `select p.id, p.titulo, p.anio,p.trama, p.fecha_lanzamiento,g.nombre,p.director,p.duracion,p.puntuacion, p.poster
                 from pelicula p,
                      genero g
                where p.genero_id = g.id
                  and p.id = ${req.params.id};`;

    var sqlActores = `select a.nombre, ap.*
                        from actor a, 
                             actor_pelicula ap
                       where a.id = ap.actor_id
                         and ap.pelicula_id = ${req.params.id};`;

    con.query(sqlPelicula, function (error, resultadoPelicula, fields) {
        con.query(sqlActores, function (error, resultadoActores, fields) {
            if (error) {
                console.log("Ocurrió un error al realizar la consulta.", error.message);
                return res.status(500).send("Ocurrió un error al realizar la consulta.");
            }
            var respuesta = {
                'pelicula': resultadoPelicula[0],
                'actores': resultadoActores,
                'genero': resultadoPelicula[0]
            }
            res.send(JSON.stringify(respuesta));
        });
    });

}


function listaRecomendadas(req, res) {
    var filtros = [];
    var parametros = Object.keys(req.query);
    let sql = "SELECT p.id, p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, g.id as idGenero, g.nombre FROM PELICULA P, GENERO G WHERE P.GENERO_ID = G.ID "
    
    parametros.forEach(parametro => {
        if (parametro != 'anio_fin') {
            switch (parametro) {
                case 'puntuacion':
                    filtros.push(`p.puntuacion >= ${req.query.puntuacion}`);
                    break;
                case 'genero':
                    filtros.push(`g.nombre like '%${req.query.genero}%'`);
                    break;
                case 'anio_inicio':
                    filtros.push(`p.anio between ${req.query.anio_inicio}  AND ${req.query.anio_fin}`);
                    break;
                default:
                    filtros.push(`${parametro} = ${req.query[parametro]}`);
                    break;
            }
        }
    });
    if (filtros.length != 0) {
        sql += " AND " + filtros.join(" and ");
    }

    console.log("sql: " + sql);
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Ocurrio el un error al realizar la consulta", error.message);
            return res.status(500).send("Ocurrio el un error al realizar la consulta");
        }
        var respuesta = { peliculas: resultado };
        res.send(respuesta)
    });


}




module.exports = {
    listarPeliculas: listarPeliculas,
    listarGenero: listarGenero,
    buscarPelicula: buscarPelicula,
    listaRecomendadas: listaRecomendadas
};