const express = require("express");
var nodemailer = require('nodemailer');
var fileupload = require("express-fileupload");
var cors = require('cors');
const app = express();
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs');


//Creamos el objeto de transporte
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hugo.tovar@grupopissa.com.mx',
    pass: 'Htovar*2021'
  }
});



app.use(fileupload());

 //const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

var mysql = require('mysql');
let jConexion = {
       host:"localhost",
       user:"root",
       password:"",
       database:"ticketing",

dateStrings : true
}

/*
let jConexion = {
       host:"localhost",
       user:"monitorWeb",
       password:"mWebGrp#.",
       database:"ticketing",
}*/

var conn= mysql.createConnection(jConexion);
conn.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conn.threadId);
});


app.listen(3001, () => {
 console.log("El servidor está inicializado en el puerto 3001");
});


//testing de api
app.get('/', function (req, res) {
  res.send('Saludos desde back de ticketing');
});


//************** insert de personas
app.post('/registroUsuario', function (req, res) {
  let userName = req.body.userName;
  let pass = req.body.pass;
  let idTipoUsuario = req.body.idTipoUsuario;
  let nombrePersona = req.body.nombrePersona;
  let apPaterno = req.body.apPaterno;
  let apMaterno = req.body.apMaterno;
  let telefono = req.body.telefono;
  let email = req.body.email;
  let estado = req.body.estado;
  let municipio = req.body.municipio;
  let calle = req.body.calle;
  let numExterior = req.body.numExterior;
  let numInterior = req.body.numInterior;
  let colonia = req.body.colonia;
  let cp = req.body.cp;

  var sql = "INSERT INTO personasDatos (nombre, apPaterno, apMaterno, telefono, email, estado, municipio, calle, numExterior, numInterior, colonia, cp) VALUES ?";
    var values = [
      [nombrePersona, apPaterno, apMaterno, telefono, email, estado, municipio, calle, numExterior, numInterior, colonia, cp]
    ];
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
         console.log(result.insertId);
             let idPersona = result.insertId;
             var sql = "INSERT INTO usuarios (userName, pass, idPersonaDatos, idTipoUsuario) VALUES ('"+userName+"', '"+pass+"',"+idPersona+", "+idTipoUsuario+")";
             conn.query(sql, function (err, result) {
               if (err)
               {
                 console.log(err);
                        res.send({"status" :'error'});
             }else{
                  res.send({"status" :'success'});
             }
        });
      }
    });

});


//obtener todos los agentes
app.post('/getPersonas', function (req, res) {
			let idTipo = req.body.idTipo;
      conn.query("SELECT * FROM usuarios INNER JOIN personasdatos ON usuarios.idPersonaDatos = personasdatos.idPersonaDatos where usuarios.idTipoUsuario = "+idTipo, function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});
//obtener datos de un agente en especifico
app.post('/getPersona', function (req, res) {
    let id = req.body.idUsuario;
      conn.query("SELECT * FROM usuarios INNER JOIN personasdatos ON usuarios.idPersonaDatos = personasdatos.idPersonaDatos where usuarios.idusuario = "+id, function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});

//****************************************************************************
app.post('/actualizarPersona', function (req, res) {
  let idPersonaDatos = req.body.idPersonaDatos;
  let nombrePersona = req.body.nombrePersona;
  let apPaterno = req.body.apPaterno;
  let apMaterno = req.body.apMaterno;
  let telefono = req.body.telefono;
  let email = req.body.email;
  let estado = req.body.estado;
  let municipio = req.body.municipio;
  let calle = req.body.calle;
  let numExterior = req.body.numExterior;
  let numInterior = req.body.numInterior;
  let colonia = req.body.colonia;
  let cp = req.body.cp;
  var sql = "UPDATE personasdatos SET nombre = '"+nombrePersona+"', apPaterno = '"+apPaterno+"', apMaterno = '"+apMaterno+"', telefono = '"+telefono+"' , email = '"+email+"',estado = '"+estado+"', municipio = '"+municipio+"', calle = '"+calle+"', numExterior = '"+numExterior+"',   numInterior = '"+numInterior+"', colonia = '"+colonia+"', cp = '"+cp+"'   WHERE idPersonaDatos = "+idPersonaDatos;
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
       var respuesta = {
         "status" : "success"
       }
       res.send(respuesta);
     }

   });
});


//buscar si existe el usuario
app.post('/busquedaUsuario', function (req, res) {
    let userName = req.body.userName;
      conn.query("SELECT userName FROM usuarios where userName = '"+userName+"'", function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});



//************** insert de personas
app.post('/insertTipoTicket', function (req, res) {
  let nombreTipo = req.body.nombreTipo;
  var sql = "INSERT INTO tipoticket (nombre) VALUES ?";
    var values = [
      [nombreTipo]
    ];
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
			 res.send({ "status" : "success"});
      }
    });
});

app.post('/getTipoTicket', function (req, res) {
		conn.query("SELECT * FROM tipoticket", function (err, result, fields) {
		if (err) {
			throw err;
      res.send([])
		}else{
				console.log(result);
				res.send(result);
		}
	});

});

app.post('/actualizarPersona', function (req, res) {
  let idTipo = req.body.idTipo;
	let nombreTipo = req.body.nombreTipo;

	var sql = "UPDATE tipoticket SET nombre = '"+nombreTipo+"' WHERE  idtipoticket= "+idTipo;
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
       var respuesta = {
         "status" : "success"
       }
       res.send(respuesta);
     }

   });
});
/*
app.post('/insertProyecto', function (req, res) {
  let nombreProyecto = req.body.nombreProyecto;
	let idUsuario = req.body.idUsuario;
	let bajo = req.body.bajo;
	let medio = req.body.medio;
	let alto = req.body.alto;
	let urgente = req.body.urgente;

  var sql = "INSERT INTO proyectocuenta (nombreProyecto, lider) VALUES ?";
    var values = [
      [nombreProyecto, idUsuario]
    ];
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{

				var sql = "INSERT INTO prioridadproyecto (tipo, tiempoVida, idProyecto) VALUES ?";
			    var values = [
			      [1, bajo, result.insertId],
						[2, medio, result.insertId],
						[3, alto, result.insertId],
						[4, urgente, result.insertId]
			    ];
			    conn.query(sql, [values], function (err, result) {
			      if (err) {
			        console.log(err);
			       res.send({"status" :'error'});
			      }else{
						 res.send({ "status" : "success"});
			      }
			    });

      }

    });
});
*/
app.get('/getProyectos', function (req, res) {
			conn.query("SELECT usuarios.idUsuario, personasdatos.nombre, personasdatos.apPaterno, personasdatos.apMaterno, proyectocuenta.nombreproyecto, proyectocuenta.idproyectoCuenta  FROM usuarios INNER JOIN personasdatos ON usuarios.idPersonaDatos = personasdatos.idPersonaDatos Inner Join proyectocuenta on proyectocuenta.lider = usuarios.idusuario", function (err, result, fields) {
			if (err) {
				throw err;
			}else{
					console.log(result);
					res.send(result);
			}
		});
});



app.post('/insertProyecto', function (req, res) {
	console.log("si recibi el json");
  let nombreProyecto = req.body.nombreProyecto;
	let idUsuario = req.body.idUsuario;
	let fechaFinPlaneacion = req.body.fechaFinPlaneacion;
	let fechaInicioPlaneacion = req.body.fechaInicioPlaneacion;
	let fechaFinEjecucion = req.body.fechaFinEjecucion;
	let fechaInicioEjecucion = req.body.fechaInicioEjecucion;
	let costoTotalPlaneacion = req.body.costoTotalPlaneacion;
	let costoTotalEjecucion = req.body.costoTotalEjecucion;
	let ingresoTotalPlaneacion = req.body.ingresoTotalPlaneacion;
	let ingresoTotalEjecucion = req.body.ingresoTotalEjecucion;
	let utilidadPlaneacion = req.body.utilidadPlaneacion;
	let utilidadEjecucion = req.body.utilidadEjecucion;
	let utilidadPorcentajePlaneacion = req.body.utilidadPorcentajePlaneacion;
	let utilidadPorcentajeEjecucion = req.body.utilidadPorcentajeEjecucion;
	let bajo = req.body.bajo;
	let medio = req.body.medio;
	let alto = req.body.alto;
	let urgente = req.body.urgente;
	let diasHoras = req.body.diasHoras;
  var sql = "INSERT INTO proyectocuenta (nombreProyecto, lider, fechaFinPlaneacion, fechaInicioPlaneacion,fechaFinEjecucion, fechaInicioEjecucion, costoTotalPlaneacion, ingresoTotalPlaneacion, utilidadPlaneacion, utilidadPorcentajePlaneacion, diashoras) VALUES ?";
    var values = [
      [nombreProyecto, idUsuario,fechaFinPlaneacion, fechaInicioPlaneacion,fechaFinEjecucion, fechaInicioEjecucion, costoTotalPlaneacion,  ingresoTotalPlaneacion, utilidadPlaneacion,utilidadPorcentajePlaneacion, diasHoras]
    ];
	console.log(values);
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
			 	/***********************************/
				var sql = "INSERT INTO prioridadproyecto (tipo, tiempoVida, idProyecto) VALUES ?";
			    var values = [
			      [1, bajo, result.insertId],
						[2, medio, result.insertId],
						[3, alto, result.insertId],
						[4, urgente, result.insertId]
			    ];
			    conn.query(sql, [values], function (err, result) {
			      if (err) {
			        console.log(err);
			       res.send({"status" :'error'});
			      }else{
						 res.send({ "status" : "success"});
			      }
			    });
/*************************************/
      }
    });
});



app.post('/login', function (req, res) {

  console.log(req.body);
  let userName = req.body.userName;
	let pass = req.body.pass;

	var sql = "SELECT * FROM usuarios INNER JOIN personasdatos ON usuarios.idPersonaDatos = personasdatos.idPersonaDatos where usuarios.userName = '"+userName+"'";
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
			 if(result.length != 0){
				 if(result[0].pass === pass){
					 var respuesta ={
						 "status" : "success",
						 "idusuario" : result[0].idusuario,
						 "nombre" :  result[0].nombre,
						 "apPaterno" : result[0].apPaterno,
						 "apMaterno" : result[0].apMaterno,
						 "idTipoUsuario" : result[0].idTipoUsuario
					 }
					 res.send(respuesta);
				 }else{
					 var respuesta ={
						 "status" : "error"
					 }
					 res.send(respuesta);
				 }
			 }else{
				 var respuesta ={
					 "status" : "error"
				 }
				 res.send(respuesta);
			 }

     }

   });
});



app.post('/nuevoTicket', function (req, res) {
	//let fechaServicio = req.body.fechaServicio;
	let asunto = req.body.asunto;
	let prioridad = req.body.prioridad;
	let descripcion = req.body.descripcion;
	let idTipoTicket = req.body.idTipoTicket;
	let idEstatus = req.body.idEstatus;
	//let idAgente = req.body.idAgente;
	let idCreador = req.body.idCreador;
	let idproyecto = req.body.idProyecto;

  let nombreSolicitante = req.body.nombreSolicitante;
  let correoContacto = req.body.correoContacto;
  let cp = req.body.cp;
  let pais = req.body.pais;
  let estado = req.body.estado;
  let municipio = req.body.municipio;
  let asentamiento = req.body.asentamiento;
  let calle = req.body.calle;
  let numExt = req.body.numExt;
  let numInt = req.body.numInt;
  let lat = req.body.lat;
  let lng = req.body.lng;
  let folio = req.body.folio;

  let idInge = req.body.idAgente;
  let idTipo = req.body.tipoAgente;
  let tiempoUrgente  = req.body.tiempoUrgente;


	var sql = "INSERT INTO ticket (tiempoUrgente,fechaCreacion, folio, asunto, prioridad, descripcion, idTipoTicket,idEstatus, idCreador, idProyecto, nombreSolicitante, correoContacto, cp, Estado, municipio, asentamiento, calle, numeroExterior, numeroInterior, lat, lng, idAgente, tipoAgente, pais) VALUES ?";
    var values = [
      [tiempoUrgente,new Date(),folio, asunto, prioridad, descripcion, idTipoTicket, idEstatus, idCreador, idproyecto,nombreSolicitante, correoContacto, cp, estado, municipio, asentamiento,calle, numExt, numInt, lat, lng,idInge,idTipo, pais]
    ];
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
         console.log(result.insertId);
         var idticketnuevo = result.insertId;
         var sql = "UPDATE ticket SET folio = '"+folio+"-"+idticketnuevo+"' WHERE  idTicket= "+idticketnuevo;
         conn.query(sql, function (err, result) {
           if (err) {
             throw err;
           }else{
             var respuesta = {
               "status" : "success",
               "folio" : folio+"-"+idticketnuevo
             }
             res.send(respuesta);
           }
         });


      }
    });
});

app.post('/getTickets', function (req, res) {
  let idTipoUsuario = req.body.idTipoUsuario;
  let idLider = req.body.idLider;
  var query = "";

  console.log(idLider+" "+idTipoUsuario);
  if(idTipoUsuario != 2){
    query = "select * from (SELECT tipoticket.nombre, ticket.*, prioridadproyecto.idPriporidadProyecto, prioridadproyecto.tipo, prioridadproyecto.tiempoVida, proyectocuenta.*, (select personasdatos.nombre from personasdatos where personasdatos.idPersonaDatos = (select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as nombreAgente, (select personasdatos.apPaterno from personasdatos where personasdatos.idPersonaDatos = (select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as apPaternoAgente, (select personasdatos.apMaterno from personasdatos where personasdatos.idPersonaDatos = (select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as apMaternoAgente FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto WHERE ticket.tipoAgente = 0 UNION SELECT tipoticket.nombre, ticket.*, prioridadproyecto.idPriporidadProyecto, prioridadproyecto.tipo, prioridadproyecto.tiempoVida, proyectocuenta.*, (select ingenierosflotantes.nombre from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as nombreAgente, (select ingenierosflotantes.apPaterno from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as apPaternoAgente, (select ingenierosflotantes.apMaterno from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as apMaternoAgente FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto WHERE ticket.tipoAgente = 1)as i order by i.idticket asc "
  }
  else{
    query = "select * from (SELECT tipoticket.nombre, ticket.*, prioridadproyecto.idPriporidadProyecto, prioridadproyecto.tipo, prioridadproyecto.tiempoVida, proyectocuenta.*, "+
    "(select personasdatos.nombre from personasdatos where personasdatos.idPersonaDatos = "+
    "(select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as nombreAgente, "+
    "(select personasdatos.apPaterno from personasdatos where personasdatos.idPersonaDatos = "+
    "(select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as apPaternoAgente, "+
    "(select personasdatos.apMaterno from personasdatos where personasdatos.idPersonaDatos = "+
    "(select idPersonaDatos from usuarios where idusuario = ticket.idAgente)) as apMaternoAgente "+
    "FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket "+
    "inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad "+
    "inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto  "+
    "where ticket.tipoAgente = 0 and ticket.idProyecto in  (select idproyectoCuenta from proyectocuenta where lider = "+idLider+")"+
    " UNION "+
    "SELECT tipoticket.nombre, ticket.*, prioridadproyecto.idPriporidadProyecto, prioridadproyecto.tipo, prioridadproyecto.tiempoVida, proyectocuenta.*, (select ingenierosflotantes.nombre from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as nombreAgente, (select ingenierosflotantes.apPaterno from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as apPaternoAgente, (select ingenierosflotantes.apMaterno from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = ticket.idAgente) as apMaternoAgente FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.tipoAgente = 1 and ticket.idProyecto in  (select idproyectoCuenta from proyectocuenta where lider = "+idLider+"))  as i order by i.idticket asc;";
  }

	conn.query(query, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicket', function (req, res) {
	var idTicket = req.body.idTicket;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where idTicket = "+idTicket, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			conn.query("select * from notasticket where idticket = "+idTicket, function (err, results, fields) {
			if (err) {
				throw err;
			}else{
					console.log(results);
					var respuesta = {
						"data" : result[0],
						"notas" : results
					}
					res.send(respuesta);
			}
			});
	}
	});
});

app.post('/addNota', function (req, res) {
	var idTicket = req.body.idTicket;
	var nota = req.body.nota;
	var tipoNota = req.body.tipo;
  var creada = req.body.creadaAgente;
	var sql = "INSERT INTO notasticket (idTicket, nota, tipoNota, fechaNota, creadaAgente) VALUES ?";
		var values = [
			[idTicket, nota, tipoNota, new Date(), creada]
		];
		conn.query(sql, [values], function (err, result) {
			if (err) {
				console.log(err);
			  res.send({"status" :'error'});
			}else{
				 console.log(result.insertId);
			res.send({"status" :'success'});
			}
		});
});

app.post('/deleteNota', function (req, res) {
	var idNotaTicket = req.body.idNotaTicket;
  var sql = "DELETE FROM notasticket WHERE  idNotaTicket = "+idNotaTicket;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
         console.log(result.insertId);
      res.send({"status" :'success'});
      }
    });
});


app.post('/updateTicket', function (req, res) {
  let idTipo = req.body.idTicket;
	let asunto = req.body.asunto;
	let estatus = req.body.estatus;
	let asignado = req.body.asignado;
  let tipoasignado = req.body.tipoAsignado;
  let prioridad = req.body.prioridad;
  let fechaPendiente = req.body.fechaPendiente;
  let tiempoUrgente = req.body.tiempoUrgente;

	var sql = "";
	if(asignado != 0){
			sql = "UPDATE ticket SET asunto = '"+asunto+"', idEstatus = "+estatus+", idAgente = "+asignado+" , tipoAgente = "+tipoasignado+" , prioridad = "+prioridad+", tiempoUrgente = "+tiempoUrgente+"  WHERE  idTicket= "+idTipo;
	}else{
      if(estatus == 2 ){
        sql = "UPDATE ticket SET asunto = '"+asunto+"', idEstatus = "+estatus+" , fechaCreacion = '"+fechaPendiente+"', fechaServicio = NULL ,prioridad = "+prioridad+", tiempoUrgente = "+tiempoUrgente+" WHERE  idTicket= "+idTipo;
      }else if(estatus == 3 ){
        sql = "UPDATE ticket SET asunto = '"+asunto+"', idEstatus = "+estatus+" ,fechaServicio = NOW() ,prioridad = "+prioridad+", tiempoUrgente = "+tiempoUrgente+"  WHERE  idTicket= "+idTipo;
      }else if(estatus == 5 ){
        sql = "UPDATE ticket SET asunto = '"+asunto+"', idEstatus = "+estatus+" ,fechaCreacion = NOW(), fechaServicio = NULL ,prioridad = "+prioridad+", tiempoUrgente = "+tiempoUrgente+" WHERE  idTicket= "+idTipo;
      }else{
        sql = "UPDATE ticket SET asunto = '"+asunto+"', idEstatus = "+estatus+" , prioridad = "+prioridad+", tiempoUrgente = "+tiempoUrgente+" WHERE  idTicket= "+idTipo;
      }
	}
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
       var respuesta = {
         "status" : "success"
       }
       res.send(respuesta);
     }
   });
});

app.post('/updateTicketEstatus', function (req, res) {
  let idTicket = req.body.idTicket;
	let estatus = req.body.estatus;
  let fecha = req.body.fecha;
	var sql = "";
  if(estatus == 2){
    sql = "UPDATE ticket SET idEstatus = "+estatus+", fechaCreacion = '"+fecha+"', fechaServicio = NULL WHERE  idTicket= "+idTicket;
  }else{
    sql = "UPDATE ticket SET idEstatus = "+estatus+", fechaServicio = '"+fecha+"' WHERE  idTicket= "+idTicket;
  }
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
       var respuesta = {
         "status" : "error"
       }
       res.send(respuesta);
     }else{
       var respuesta = {
         "status" : "success"
       }
       res.send(respuesta);
     }
   });
});


app.post('/updateTicketEstatusPendiente', function (req, res) {
  let idTipo = req.body.idTicket;
	let fecha = req.body.fecha;
	var sql = "";
  sql = "UPDATE ticket SET idEstatus = "+estatus+" WHERE  idTicket =  "+idTipo;
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
       var respuesta = {
         "status" : "success"
       }
       res.send(respuesta);
     }
   });
});



app.post('/upload', function(req, res) {
  if(!req.files){
    res.send({ "status" : "error1"});
  }else{
    let avatar = req.files.photos;
    let data = req.files.data;
    let jsonData = JSON.parse(data.data.toString('utf-8'))
    console.log(jsonData.idTicket);
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          avatar.mv('./uploads/'+jsonData.idTicket+"_"+avatar.name);

          var sql = "INSERT INTO evidenciasTicket ( nombreArchivo, pathArchivo, fechaDeSubida , idTicket, descripcion,evidenciaAgente) VALUES ?";
            var values = [
              [jsonData.idTicket+"_"+avatar.name,"/uploads/"+ jsonData.idTicket+"_"+ avatar.name , new Date(),jsonData.idTicket ,jsonData.descripcion, jsonData.evidenciaAgente]
            ];
            conn.query(sql, [values], function (err, result) {
              if (err) {
                console.log(err);
               res.send({"status" :'error'});
              }else{
                 console.log(result.insertId);
              res.send({"status" :'success'});
              }
            });
          }
          /*res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: avatar.name,
                  mimetype: avatar.mimetype,
                  size: avatar.size
              }
          });
        }*/
  //console.log(req.files.archivo.name); // the uploaded file object
});


app.post('/deletefile', function(req, res) {
  let namePath ="."+ req.body.namePath;
  let idEvidencia =req.body.idEvidencia;
  try {
  fs.unlinkSync(namePath)

  var sql = "DELETE FROM ticketing.evidenciasTicket WHERE idEvidencia = "+idEvidencia;
    conn.query(sql, function (err, result) {
      if (err)
      {
           res.send({"status" : "error"});
      }
      else
      {
              res.send({"status" : "success"});
      }

    });
  //file removed
} catch(err) {
  console.error(err);
    res.send({"status" : "error" ,"error" : err.toString()});
}
  //console.log(req.files.archivo.name); // the uploaded file object
});


app.post('/getfile', function(req, res) {
  console.log(req.body);
  let namePath = req.body.namePath;
  try {

    res.sendFile(__dirname+namePath)
  //file removed
} catch(err) {
  console.error(err);
    res.send({"status" : "error"});
}
  //console.log(req.files.archivo.name); // the uploaded file object
});


app.post('/getfileApp', function(req, res) {
  console.log(req.body);
  let namePath = req.body.namePath;
  try {

    //res.sendFile(__dirname+namePath)


   var img = Buffer.from(__dirname+namePath, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  res.send(img);


  //file removed
} catch(err) {
  console.error(err);
    res.send({"status" : "error"});
}
  //console.log(req.files.archivo.name); // the uploaded file object
});

app.post('/getDataFiles', function (req, res) {
  let idTicket = req.body.idTicket;
	conn.query("SELECT * FROM ticketing.evidenciasTicket where idTicket = "+idTicket, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/insertGastoTicket', function (req, res) {
  let concepto = req.body.concepto;
  let cantidad = req.body.cantidad;
  let pagado = req.body.pagado;
  let idTicket = req.body.idTicket;
  var sql = "INSERT INTO gastostickets (concepto, cantidad, pagado, idTicket) VALUES ?";
    var values = [
      [concepto , cantidad , pagado, idTicket]
    ];
    conn.query(sql, [values], function (err, result) {
      if (err) {
        console.log(err);
       res.send({"status" :'error'});
      }else{
			 res.send({ "status" : "success"});
      }
    });
});


app.post('/deleteGasto', function (req, res) {
  let id = req.body.idGastoTicket;
  var sql = "DELETE FROM ticketing.gastosTickets WHERE idGastoTicket = "+id;
    conn.query(sql, function (err, result) {
      if (err)
      {
           res.send({"status" : "error"});
      }
      else
      {
              res.send({"status" : "success"});
      }
    });
});



app.post('/updateGastosTicket', function (req, res) {
  let id = req.body.idGastoTicket;
  let concepto = req.body.concepto;
  let cantidad = req.body.cantidad;
  let pagado = req.body.pagado;
  var sql = "UPDATE ticketing.gastostickets SET concepto = '"+concepto+"', cantidad = "+cantidad+" ,pagado = '"+pagado+"' WHERE  idGastoTicket= "+id;
    conn.query(sql, function (err, result) {
      if (err)
      {
           res.send({"status" : "error"});
      }
      else
      {
              res.send({"status" : "success"});
      }
    });
});

app.post('/getGastosTickets', function (req, res) {
  let idTicket = req.body.idTicket;
	conn.query("SELECT * FROM ticketing.gastostickets where idTicket = "+idTicket, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});


app.post('/sendAlerta', function (req, res) {
let send = req.body.correo;
let asunto = req.body.asunto;
let mensaje  = req.body.mensaje;
var mailOptions = {
	  from: 'Foo from @grupopissa.com <donotreply@grupopissa.com>',
	  to: send,
	  subject: 'Asunto Del Correo',
	  html: mensaje
};
	transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
		res.send({ "status" : "error"});
  } else {
    console.log('Email enviado: ' + info.response);
		res.send({ "status" : "success"});
  }
	});
});


app.post('/getContadoresAllTickets', function (req, res) {

	conn.query("select count(idTicket) as totalTickets , (select count(idTicket) from ticket where idEstatus = 1) as estatus1, (select count(idTicket) from ticket where idEstatus = 2) as estatus2, (select count(idTicket) from ticket where idEstatus = 3)  as estatus3, (select count(idTicket) from ticket where idEstatus = 4)  as estatus4, (select count(idTicket) from ticket where idEstatus = 5)  as estatus5,(select count(idTicket) from ticket where idAgente = 0)  as estatus6  from ticket;", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getContadoresTicketsProyecto', function (req, res) {
	let idProyecto = req.body.idProyecto;
	conn.query("select count(idTicket) as totalTickets , (select count(idTicket) from ticket where idEstatus = 1 and idProyecto = "+idProyecto+") as estatus1, (select count(idTicket) from ticket where idEstatus = 2 and idProyecto = "+idProyecto+") as estatus2, (select count(idTicket) from ticket where idEstatus = 3 and idProyecto = "+idProyecto+")  as estatus3, (select count(idTicket) from ticket where idEstatus = 4 and idProyecto = "+idProyecto+")  as estatus4, (select count(idTicket) from ticket where idEstatus = 5 and idProyecto = "+idProyecto+")  as estatus5, (select count(idTicket) from ticket where idAgente = 0 and idProyecto = "+idProyecto+")  as estatus6  from ticket where idProyecto = "+idProyecto, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getContadoresTicketsLider', function (req, res) {
	let idLider = req.body.idLider;
	conn.query("select count(idTicket) as totalTickets , (select count(idTicket) from ticket where idEstatus = 1 and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+")) as estatus1, (select count(idTicket) from ticket where idEstatus = 2  and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+")) as estatus2, (select count(idTicket) from ticket where idEstatus = 3  and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+"))  as estatus3, (select count(idTicket) from ticket where idEstatus = 4  and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+"))  as estatus4, (select count(idTicket) from ticket where idEstatus = 5 and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+"))  as estatus5, (select count(idTicket) from ticket where idAgente = 0 and ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+"))  as estatus6 from ticket where ticket.idProyecto in (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+")", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getContadoresTicketsAgente', function (req, res) {
	let idAgente = req.body.idAgente;
	conn.query("select count(idTicket) as totalTickets , (select count(idTicket) from ticket where idEstatus = 1 and idAgente = "+idAgente+") as estatus1, (select count(idTicket) from ticket where idEstatus = 2 and idAgente = "+idAgente+") as estatus2, (select count(idTicket) from ticket where idEstatus = 3 and idAgente = "+idAgente+")  as estatus3, (select count(idTicket) from ticket where idEstatus = 4 and idAgente = "+idAgente+")  as estatus4, (select count(idTicket) from ticket where idEstatus = 5 and idAgente = "+idAgente+")  as estatus5 from ticket where idAgente = "+idAgente+";", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getContadoresTicketsFlotantes', function (req, res) {
	let idAgente = req.body.idAgente;
	conn.query("select count(idTicket) as totalTickets , (select count(idTicket) from ticket where idEstatus = 1 and idAgente = "+idAgente+" and ticket.tipoAgente = 1) as estatus1, (select count(idTicket) from ticket where idEstatus = 2 and idAgente = "+idAgente+" and ticket.tipoAgente = 1) as estatus2, (select count(idTicket) from ticket where idEstatus = 3 and idAgente = "+idAgente+" and ticket.tipoAgente = 1)  as estatus3, (select count(idTicket) from ticket where idEstatus = 4 and idAgente ="+idAgente+" and ticket.tipoAgente = 1)  as estatus4, (select count(idTicket) from ticket where idEstatus = 5 and idAgente = "+idAgente+" and ticket.tipoAgente = 1) as estatus5 from ticket where idAgente = "+idAgente+" and ticket.tipoAgente = 1", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicketsProyecto', function (req, res) {
	let idProyecto = req.body.idProyecto;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.idProyecto = "+idProyecto, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicketsLider', function (req, res) {
	let idLider = req.body.idLider;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.idProyecto in  (select proyectocuenta.idproyectoCuenta from proyectocuenta where proyectocuenta.lider = "+idLider+");", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicketsAgente', function (req, res) {
	let idAgente = req.body.idAgente;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where  ticket.tipoAgente = 0 and  ticket.idagente = "+idAgente, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicketsFlotante', function (req, res) {
	let idFlotante = req.body.idFlotante;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.tipoAgente = 1 and ticket.idagente = "+idFlotante, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});

app.post('/getTicketsCerrados', function (req, res) {
	//let idFlotante = req.body.idAgente;
  let idFlotante = req.body.idAgente;
	conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.tipoAgente = 1 and ticket.idagente = "+idFlotante, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});


app.post('/getProyecto', function (req, res) {
  let idProyecto = req.body.idProyecto;
	conn.query("select * from proyectocuenta where idProyectoCuenta = "+idProyecto, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});


app.post('/getPrioridadesProyecto', function (req, res) {
  let idProyecto = req.body.idProyecto;
	conn.query("select * from prioridadproyecto where idProyecto ="+idProyecto, function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});


app.post('/updateProyectoSLAs', function (req, res) {
  let idProyecto = req.body.idProyecto;
  let prioridadBajo = req.body.prioridadBajo;
  let prioridadMedia = req.body.prioridadMedia;
  let prioridadAlta = req.body.prioridadAlta;
  let prioridadUrgente = req.body.prioridadUrgente;
  let diasHoras = req.body.diasHoras;

  var sql = "UPDATE prioridadproyecto SET tiempoVida ="+prioridadBajo+" WHERE tipo = 1 and idProyecto = "+idProyecto;
    conn.query(sql, function (err, result) {
      if (err)
      {
           res.send({"status" : "error"});
      }
      else
      {
        var sql = "UPDATE prioridadproyecto SET tiempoVida ="+prioridadMedia+" WHERE tipo = 2 and idProyecto = "+idProyecto;
          conn.query(sql, function (err, result) {
            if (err)
            {
                 res.send({"status" : "error"});
            }
            else
            {
              var sql = "UPDATE prioridadproyecto SET tiempoVida ="+prioridadAlta+" WHERE tipo = 3 and idProyecto = "+idProyecto;
                conn.query(sql, function (err, result) {
                  if (err)
                  {
                       res.send({"status" : "error"});
                  }
                  else
                  {
                    var sql = "UPDATE prioridadproyecto SET tiempoVida ="+prioridadUrgente+" WHERE tipo = 4 and idProyecto = "+idProyecto;
                      conn.query(sql, function (err, result) {
                        if (err)
                        {
                             res.send({"status" : "error"});
                        }
                        else
                        {
                          var sql = "UPDATE proyectocuenta SET diashoras ='"+diasHoras+"' WHERE idproyectoCuenta = "+idProyecto;
                            conn.query(sql, function (err, result) {
                              if (err)
                              {
                                   res.send({"status" : "error "+err});
                              }
                              else
                              {
                                  res.send({"status" : "success"});
                              }
                            });
                        }
                      });
                  }
                });
            }
          });
      }
    });
});

app.post('/setIngenieroFlotante', function (req, res) {
	var curp = req.body.curp;
	var nombre = req.body.nombre;
	var apPaterno = req.body.apPaterno;
	var apMaterno = req.body.apMaterno;
	var telefono = req.body.telefono;
	var email = req.body.email;
	var estado = req.body.estado;
	var municipio = req.body.municipio;
	var calle = req.body.calle;
	var numExterior = req.body.numeroExterior;
	var numInterior = req.body.numeroInterior;
	var colonia = req.body.colonia;
	var cp = req.body.cp;
	var pass = req.body.pass;

  var empresa =  req.body.empresa;
  var proyectoIngreso =  req.body.proyectoIngreso;
  var estatus =  req.body.estatus;
  var edad =  req.body.edad;
  var genero =  req.body.genero;
  var clabeInterbancaria =  req.body.clabeInterbancaria;
  var banco =  req.body.banco;
  var numeroCuenta =  req.body.numeroCuenta;
  var numeroTarjeta =  req.body.numeroTarjeta;
  var comentarios =  req.body.comentarios;

	var sql = 'INSERT INTO ingenierosflotantes (curp, nombre, apPaterno, apMaterno, telefono, email, estado,municipio, calle, numeroExterior, numeroInterior, colonia, cp, pass, fechaRegistro, empresa, proyectoIngreso, estatus, edad, genero, clabeInterbancaria, banco, numeroCuenta, numeroTarjeta, comentarios) VALUES ?';
		var values = [
			[curp, nombre, apPaterno, apMaterno, telefono,email,estado, municipio, calle, numExterior, numInterior, colonia, cp, pass, new Date(), empresa, proyectoIngreso, estatus, edad, genero, clabeInterbancaria,banco, numeroCuenta, numeroTarjeta, comentarios]
		];
		conn.query(sql, [values], function (err, result) {
			if (err) {
				console.log(err);
			 res.send({"status" :'error'});
			}else{
				 console.log(result.insertId);
			res.send({"status" :'success'});
			}
		});
});


app.post('/setIngenieroFlotanteMasivo', function (req, res) {
	var curp = req.body.curp;
	var nombre = req.body.nombre;
	var apPaterno = req.body.apPaterno;
	var apMaterno = req.body.apMaterno;
	var telefono = req.body.telefono;
	var email = req.body.email;
	var estado = req.body.estado;
	var municipio = req.body.municipio;
	var calle = req.body.calle;
	var numExterior = req.body.numeroExterior;
	var numInterior = req.body.numeroInterior;
	var colonia = req.body.colonia;
	var cp = req.body.cp;
	var pass = req.body.pass;

  var empresa =  req.body.empresa;
  var proyectoIngreso =  req.body.proyectoIngreso;
  var estatus =  req.body.estatus;
  var edad =  req.body.edad;
  var genero =  req.body.genero;
  var clabeInterbancaria =  req.body.clabeInterbancaria;
  var banco =  req.body.banco;
  var numeroCuenta =  req.body.numeroCuenta;
  var numeroTarjeta =  req.body.numeroTarjeta;
  var comentarios =  req.body.comentarios;
  var fechaIngreso = req.body.fechaIngreso;
	var sql = 'INSERT INTO ingenierosflotantes (curp, nombre, apPaterno, apMaterno, telefono, email, estado,municipio, calle, numeroExterior, numeroInterior, colonia, cp, pass, fechaRegistro, empresa, proyectoIngreso, estatus, edad, genero, clabeInterbancaria, banco, numeroCuenta, numeroTarjeta, comentarios) VALUES ?';
		var values = [
			[curp, nombre, apPaterno, apMaterno, telefono,email,estado, municipio, calle, numExterior, numInterior, colonia, cp, pass, new Date(), empresa, proyectoIngreso, estatus, edad, genero, clabeInterbancaria,banco, numeroCuenta, numeroTarjeta, comentarios]
		];
		conn.query(sql, [values], function (err, result) {
			if (err) {
				console.log(err);
			 res.send({"status" :'error'});
			}else{
				 console.log(result.insertId);
			res.send({"status" :'success'});
			}
		});
});

app.post('/getIngenierosFlotantes', function (req, res) {
	conn.query("select ingenierosflotantes.* , (select count(ticket.idticket) from ticket where ticket.idAgente = ingenierosflotantes.idingenieroflotante and ticket.tipoAgente = 1)  as servicios from ingenierosflotantes", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});
app.post('/getIngenierosFlotantes', function (req, res) {
	conn.query("select ingenierosflotantes.* , (select count(ticket.idticket) from ticket where ticket.idAgente = ingenierosflotantes.idingenieroflotante and ticket.tipoAgente = 1)  as servicios from ingenierosflotantes", function (err, result, fields) {
	if (err) {
		throw err;
	}else{
			console.log(result);
			res.send(result);
	}
	});
});


app.post('/updateIngenieroFlotante', function (req, res) {
  let id = req.body.idIngenieroFlotante;
  var nombre = req.body.nombre;
	var apPaterno = req.body.apPaterno;
  var apMaterno = req.body.apMaterno;
	var telefono = req.body.telefono;
	var email = req.body.email;
	var estado = req.body.estado;
	var municipio = req.body.municipio;
	var calle = req.body.calle;
	var numExterior = req.body.numExterior;
	var numInterior = req.body.numInterior;
	var colonia = req.body.colonia;
	var cp = req.body.cp;

  var sql = "UPDATE ingenierosflotantes SET nombre = '"+nombre+"', apPaterno = '"+apPaterno+
  "',apMaterno = '"+apMaterno+"' ,telefono = '"+telefono+"' , email = '"+email+"', estado = '"+estado+
  "', municipio = '"+municipio+"' ,calle = '"+calle+"' , numeroExterior = "+numExterior+" , numeroInterior ='"+numInterior+
  "' , colonia = '"+colonia+"' ,cp = "+cp+
  " WHERE  idingenieroflotante= "+id;
    conn.query(sql, function (err, result) {
      if (err)
      {
        console.log(err);
           res.send({"status" : "error "+err});
      }
      else
      {
              res.send({"status" : "success"});
      }
    });
});


//buscar si existe el usuario
app.post('/busquedaCurp', function (req, res) {
    let curp = req.body.curp;
      conn.query("SELECT curp FROM ingenierosflotantes where curp = '"+curp+"'", function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});

app.post('/getFlotante', function (req, res) {
    let idIng = req.body.idIng;
      conn.query("SELECT * FROM ingenierosflotantes where idingenieroflotante = "+idIng, function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});


app.post('/getTicketsFlotante', function (req, res) {
    let idIng = req.body.idIng;
      conn.query("SELECT * FROM ticketing.ticket inner join tipoticket on ticketing.tipoticket.idTipoTicket = ticketing.ticket.idTipoTicket inner join prioridadproyecto on prioridadproyecto.idProyecto = ticket.idProyecto and prioridadproyecto.tipo = ticket.prioridad inner join proyectocuenta on proyectocuenta.idProyectoCuenta = ticket.idProyecto where ticket.idagente = "+idIng+" and ticket.tipoAgente = 1 ", function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});

app.post('/getNotasTicketFlotante', function (req, res) {
    let ticket = req.body.ticket;
      conn.query("select * from notasticket where tipoNota = 1 and idTicket = "+ticket, function (err, result, fields) {
      if (err) {
        throw err;
      }else{
          console.log(result);
          res.send(result);
      }
      });
});


app.post('/loginFlotantes', function (req, res) {

  console.log(req.body);
  let userName = req.body.userName;
	let pass = req.body.pass;

	var sql = "SELECT * FROM ticketing.ingenierosflotantes where curp= '"+userName+"'";
   conn.query(sql, function (err, result) {
     if (err) {
       throw err;
     }else{
			 if(result.length != 0){
				 if(result[0].pass === pass){
					 var respuesta ={
						 "status" : "success",
						 "idusuario" : result[0].idingenieroflotante,
						 "nombre" :  result[0].nombre,
						 "apPaterno" : result[0].apPaterno,
						 "apMaterno" : result[0].apMaterno,
						 "idTipoUsuario" : 5
					 }
					 res.send(respuesta);
				 }else{
					 var respuesta ={
						 "status" : "error"
					 }
					 res.send(respuesta);
				 }
			 }else{
				 var respuesta ={
					 "status" : "error"
				 }
				 res.send(respuesta);
			 }

     }

   });
});


app.post('/getReportes', function (req, res) {

  var jsonArray = [];
  conn.query("select ticket.folio,ticket.idAgente, idProyecto, tipoAgente,   (select lider from proyectocuenta where proyectocuenta.idproyectoCuenta = ticket.idProyecto ) as lider   ,ticket.idticket, ticket.fechaServicio, ticket.asunto, ticket.fechaCreacion, (select proyectocuenta.nombreProyecto from proyectocuenta where idproyectoCuenta = ticket.idProyecto) as proyectoNombre, ticket.cp,ticket.Estado, ticket.municipio, ticket.asentamiento, ticket.numeroExterior,ticket.calle, ticket.idAgente, ticket.tipoAgente, (select tipoTicket.nombre from tipoticket where idTipoTicket = ticket.idTipoTicket) as tipoTicket, ticket.descripcion,  ticket.prioridad, (select estatus.nombre from estatus where idestatus = ticket.idestatus) as estatusticket  from ticket", function (err, result, fields) {
                    if (err) {
                      throw err;
                    }else{
                        if(result.length == 0){
                            res.send(jsonArray);
                        }else{
                          console.log("agentes: "+JSON.stringify(result));
                          for(var i = 0 ; i < result.length; i++){
                            var rows = getLastRecord(result[i]).then(function(rows) {
                            // now you have your rows, you can see if there are <20 of them
														console.log("esto es row "+rows+" "+JSON.stringify(rows)+" esto es rsult "+result[i]);
                            jsonArray.push(rows)
                            if(jsonArray.length == result.length){
                              res.send(jsonArray);
                            }
                        }).catch((err) => setImmediate(() => { throw err; })); // Throw async to escape the promise chain

                            //  jsonRespuesta.agentes.push({"Nombre": "Hugo", "totales": 1})
                          }


                        }
                    }

                  });
});

function getLastRecord(jsonDatos)
{
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
          console.log("idAgente "+jsonDatos.idticket);
          var query = "SELECT * FROM ticketing.notasticket where idTicket = "+jsonDatos.idticket;
          conn.query(query, function (err, results, fields) {
            if (err){
              throw err;
            } else{
              var json = {
                "ticket" : jsonDatos,
                "notas" : results,
                "nombre" : ""
              }
              var sql = "";
              if(jsonDatos.tipoAgente == 0){
                sql = "select personasdatos.nombre, personasdatos.apPaterno, personasdatos.apMaterno from personasdatos where personasdatos.idPersonaDatos = (select usuarios.idPersonaDatos from usuarios where idusuario ="+jsonDatos.idAgente+" )"
              }else{
                sql = "select ingenierosflotantes.nombre, ingenierosflotantes.apPaterno, ingenierosflotantes.apMaterno from ingenierosflotantes where ingenierosflotantes.idingenieroflotante = "+jsonDatos.idAgente;
              }
              conn.query(sql, function (err, result, fields) {
              if (err) {
                throw err;
              }else{
                  //var nombre  = result[0].nombre+" "+result[0].apPaterno+" "+result[0].apMaterno;
                  console.log(result);
                  //res.send(result);
                  if(result.length == 0){
                        json.nombre = "No asignado";
                  }else{
                        json.nombre = result[0].nombre+" "+result[0].apPaterno+" "+result[0].apMaterno;
                  }
                resolve(json);
              }
              });


            }

        });
    });
}



app.post('/getInfoContacto', function (req, res) {
  console.log(req.body);
  let correo = req.body.correo;
  var jsonArray = [];
  conn.query("select nombreSolicitante, cp, Estado, municipio, asentamiento, calle, numeroExterior, numeroInterior from ticket where correoContacto = '"+correo+"'", function (err, result, fields) {
                    if (err) {
                      throw err;
                    }else{
                        if(result.length == 0){
                            res.send(jsonArray);
                        }else{
                            res.send(result);
                        }
                    }
      });
});









/****************************************************/

var cron = require('node-cron');

cron.schedule('0 6 * * *', () => {
  abrirTicketsPendientes();
});



function abrirTicketsPendientes(){
  console.log("ejecuto el cron");
     var ts_hms = new Date();
      var inicio = ts_hms.toISOString().split("T")[0]+" 00:00:00";
      var fin = ts_hms.toISOString().split("T")[0]+" 23:59:00";
      console.log(inicio+" "+fin);
      sql = "UPDATE ticket SET idEstatus = 1 WHERE idEstatus = 2 AND fechaCreacion BETWEEN '"+inicio+"' AND '"+fin+"';";
     conn.query(sql, function (err, result) {
       if (err) {
         throw err;

       }else{
          console.log("cron correcto");
       }
     });
}
