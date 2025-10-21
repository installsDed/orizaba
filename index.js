import express from 'express';
import http from 'http';
import path from 'path';
import {PythonShell} from "python-shell";
import {promises as fs2} from 'fs';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { Server } from "socket.io"
import mqtt from 'mqtt';
import bcryptjs from 'bcryptjs';
import session from 'express-session';
import mysql from 'mysql';
import multer from 'multer';

function tiempo (t) {

    function ceros(c) {
      return (c<10? '0':'') + c
    }
        var ms = t % 1000
        t = (t - ms) / 1000
        var secs = t % 60
        t = (t - secs) / 60
        var mins = t % 60
        var hrs = (t - mins) / 60
        return ceros(hrs) + ':' + ceros(mins) + ':' + ceros(secs)+ '.' + ceros(ms)
      }

var flag='subir.png'
var client
var diferencia
var inicio, fin
var fE, fR, ver, piezaD, mnsj="Error", rfidD, rfidr
var m1=false,m2=false,m3=false,m4=false,m5=false
var msj
var cambios='Primer tiempo'
var cambios1='Segundo tiempo'
var cambios2='Tercer tiempo'
var cambios3='Cuarto tiempo'
var boton='0'
var tarea1,tareaI,tarea2,tarea3,tarea4,esp1,esp2,esp3,esp4
var lista_filtrada,lista_filtradaT,pieza
var imgStat=false
var nPieza

var error=false
var c=0
var inicio, tiempo1, tiempo2,tiempo3,tiempo4,fin




var dir_cam1 = "C:/Users/IT Zitacuaro/Documents/C_IM_162023_SEC/public/mesas"

var cam = dir_cam1
var imagen1='mesa10.png', imagen2="mesa10.png", imagen3="mesa10.png",imagen4="mesa10.png",imagen5="mesa10.png"

const app = express();
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized:true
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = "172.20.208.15";
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))

var ip = "http://172.20.208.15:3000/"


const puerto = 3000

function urls(mesa){
var url
    switch (mesa) {
case 'Mesa 1':
    url="mesas/imgMesa1.jpg"
    break
case 'Mesa 2':
    url="mesas/imgMesa2.jpg"
    break
case 'Mesa 3':
    url="mesas/imgMesa3.jpg"
    break
case 'Mesa 4':
    url="mesas/imgMesa4.jpg"
    break
case 'Mesa 5':
    url="mesas/imgMesa5.jpg"
    break
default:
     url="mesas/mesa10.png"
    break
}
return url
}

io.on('connection', (socket)=>{
        console.log("socket")
        socket.on("inicio", (msg)=>{
            tareaI = msg;
        });
        socket.on("t1", (msg)=>{
            esp1 = msg
        })
        socket.on("t2", (msg)=>{
            esp2 = msg
        })
        socket.on("t3", (msg)=>{
            esp3 = msg
        })
        socket.on("t4", (msg)=>{
            esp4 = msg
        })
        socket.on("punto1", (msg)=>{
            tarea1 = msg;
        });     
        socket.on("punto2", (msg)=>{
            tarea2 = msg;
        });  
        socket.on("punto3", (msg)=>{
            //console.log("punto3:", msg)
            tarea3 = msg;
        });  
        socket.on("punto4", (msg)=>{
            //console.log("punto4:", msg)
            tarea4 = msg;
        });  
        

   })
/*
const conexion = mysql.createConnection({
    //host: process.env.DB_HOST,
    //user: process.env.DB_USER,
    //password: process.env.DB_PASSWORD,
    //database: process.env.DB_DATABASE
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'sesiones'
});

conexion.connect((error) => {
    if(error){
        console.log(error);
    }
    console.log("SQL");
});
*/

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'public')
    },
    filename: function (req, file, cb) {
    cb(null, 'modelo.h5'); // Siempre guarda con el mismo nombre
    //cb(null, file.originalname)
  }
})
const storage2 = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'public')
    },
    filename: function (req, file, cb){
        cb(null, 'imagen.jpg')
    }
})
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.h5') {
    cb(null, true); // Aceptar
  } else {
    cb(new Error('Solo se permiten archivos .h5')); // Rechazar
  }
};
const fileFilter2 = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.jpg') {
    cb(null, true); // Aceptar
  } else {
    cb(new Error('Solo se permiten archivos .jpg')); // Rechazar
  }
};
const upload = multer({ storage: storage, 
    fileFilter:fileFilter
})
const upload2 = multer({storage: storage2,
    fileFilter:fileFilter2
})

app.post('/nm', upload.single('modelo'), (req,res)=>{
    
    if(!req.file) return console.log('fallo')
    console.log('success')
    res.redirect('inicio')
})
app.post('/process', upload2.single('imagen'), (req,res)=>{
    
    if(!req.file) return console.log('fallo')
    imgStat=true
    res.redirect('vision')
})
app.get('/registro',(req,res)=>{
    res.render('registro');
})

app.post('/registros', async (req,res)=>{
    try{
         const aut= req.body.auto;
    if(aut=="449"){
     const user=req.body.user;
     const pass=req.body.pass;
     let passwordHash= await bcryptjs.hash(pass, 8);
     conexion.query('INSERT INTO registros SET ?', {usuario:user,password:pass}, async(error, results)=>{
         if(error){
             console.log(error);
         }else{
            res.redirect('/login');
         }
     });
    }else{
     console.log("No tienes autorizado registrar");
     res.redirect('/login');
    }
    }catch(error){
        console.log(error);
    }
 })

 app.get('/login',(req,res)=>{
    res.render('login');
});


app.post('/log', async(req, res)=>{
    conexion.query('SELECT * FROM estado', async(error, results)=>{
        if(results[0].dato=='0'){
            try{
                const user=req.body.user;
                const pass=req.body.pass;
                if(user&&pass){
                    conexion.query('SELECT * FROM registros WHERE usuario=?', [user], async(error, results)=>{
                        if(results.length<1 || results[0].password!=pass){
                            console.log("Usuario no encontrado")
                            console.log(results[0].password)
                            res.render('login', {
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "Usuario y/o contraseña incorrecta",
                                alertIcon: "error",
                                timer: 1500,
                                ruta: "login",
                                ip: ip   
                            });
                        }else{
                            req.session.loggedin = true;
                            req.session.name = results[0].usuario;
                            //sube dato de inicio de sesion
                           /* conexion.query('UPDATE estado set dato=?', [1], async(error, results)=>{
                                if(error){
                                    console.log(error);
                                }
                            });*/
                            res.redirect('/inicio');
                        }
                    })
                }                           
            } catch(error){
                console.log(error);
            }
        }else if(results[0].dato=='1'){
            res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ya existe un usuario en uso",
                alertIcon: "error",
                timer: 1500,
                ruta: "error",
                ip: ip                 
            });
        }
        
    });
});
app.get('/error',(req,res)=>{
    res.render('error');
})

app.post('/err', async(req, res)=>{
    try{
        const clave=req.body.pass;
        if(clave=="559") {
            res.redirect('/logout')
        }else{
           console.log("clave erronea");
        res.redirect('/error');
        }
    }catch (error){
        console.log(error);
    }
})
//Método para controlar que está auth en todas las páginas

//función para limpiar la caché luego del logout

app.use(function(req, res, next) {
    try{
        if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
    }catch (error) {
        console.log(error);
    }
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	try{
        req.session.destroy(() => {
	  res.redirect('/login') // siempre se ejecutará después de que se destruya la sesión
	});
    //sube dato de inicio de sesion a base de datos

    /*conexion.query('UPDATE estado set dato=?', [0], async(error, results)=> {
        if (error) {
            console.log(error);
        }
    });*/
    }catch (error) {
        console.log(error);
    }
});
app.get('/inicio',(req,res)=>{
    if(true){
        cambios='Primer tiempo'
        cambios1='Segundo tiempo'
        cambios2='Tercer tiempo'
        cambios3='Cuarto tiempo'  
        tareaI=null
        tarea1=null
        tarea2=null
        tarea3=null
        tarea4=null
        esp1=null
        esp2=null
        esp3=null
        esp4=null
           const cams = 'C:/Users/Laboratorio/Documents/mRsP_300625/public/mesas'
         fs2.readdir(cams)
               .then(files => {
                   const unlinkPromises = files.map(file => {
                       const filePath = path.join(cams, file)
                       return fs2.unlink(filePath)
                   })
                   return Promise.all(unlinkPromises)
               }).catch(err => {
               console.error(`Something wrong happened removing files of ${cams}`)
           });
           
       
     res.render('index' , {login: true, 
        name: req.session.name,
        ip: ip
        });
    }else{
        res.render('index' , {login: true, 
            name: req.session.name,
            ip: ip
            });
    }
    
})
app.get("/rfid", (req,res)=>{
    mnsj="Esperando proceso..."
    res.render("rfid")
})
app.get("/vision", (req,res)=>{
    if(imgStat){
        flag='mesas/imgMesa1.jpg'
    }else{
        mnsj="Necesitas sacar una foto"
        flag='subir.png'
    }
    
    res.render('foto',{imV:flag})
})
var conexion=false
app.post("/get",async(req,res)=>{
    let variable = req.body?.valor
    let cliente = mqtt.connect('ws://172.20.208.15:8083/mqtt')
    
    if(variable=="conectando"){
        if(conexion){
            mnsj="Error al iniciar la conexión"
            res.status(204).end()
            cliente.end()
        }else{
           mnsj="Conectando con la mesa"
            cliente.publish("mesas", "prueba")
            conexion=true
        }
        
    }else if(variable=="leyendo"&&m1){
        mnsj="Leyendo el TAG"
        cliente.publish("Mesa 1","rfidP")
    }else if(variable&&m1){
        mnsj="Grabando TAG"
        cliente.publish("graba",variable)
    }else if(variable=="evaluar"&&m1){
        mnsj="Evaluando la imagen..."
        var check = PythonShell('interprete.py')
        check.send("imgMesa1")
        check.on('message',function(message){
            
            mnsj="La red detecto: "+message.toString()
        })
    }else if(variable=="foto"&&m1){
        mnsj="Se esta tomando la fotografia..."
        cliente.publish("Mesa 1","camaraP")
    }else if(m1 == false){
        mnsj="Necesitas prender la mesa o establecer la conexión."
    }else{
        mnsj="Esperando proceso..."
    }

    function conectar(){
        cliente.subscribe("m1")
        cliente.subscribe("rfid")
        cliente.subscribe("grabadora")
        cliente.subscribe("fallo")
        cliente.subscribe("foto")
    }
    function mensaje(topic,message){
        if(topic=='rfid'){
            mnsj="El TAG dice: "+message
            res.status(204).end()
            cliente.end()
            
        }else if(topic=='grabadora'){
            mnsj="El TAG se grabo con "+message
            res.status(204).end()
            cliente.end()
            
        }else if(topic == 'm1'){
            m1=true
            conexion=false
            mnsj="Conexion con mesa exitosa."
            res.status(204).end()
            cliente.end()
            
        }else if(topic == 'fallo'){
            mnsj="Error"
            res.status(204).end()
            cliente.end()
        }else if(topic == 'foto'){
            mnsj="El sistema saco la foto, si se muestra la imagen en pantalla puede empezar a evaluar la imagen"
            imgStat=true
            res.redirect('vision')
            cliente.end()
        }

    }
    cliente.on('connect',conectar)
    cliente.on('message',mensaje)
})

app.get("/proceso", (req, res)=>{
    let marca=true
    let av=false
    var time = new PythonShell('tiempo.py')
    var red = new PythonShell('interprete.py')
    client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
    console.log("Tareas ",tareaI,tarea1, tarea2, tarea3, tarea4)
    let lista_rutas = [tareaI,tarea1, tarea2, tarea3, tarea4]
    let lista_tiempos=[esp1,esp2,esp3,esp4]
    // filtro para eliminar los ceros y null de la lista_rutas y tiempos
    lista_filtrada = lista_rutas.filter(element => element != 0 && element != null)
    lista_filtradaT =lista_tiempos.filter(element => element !=0&&element!=undefined)
    if(lista_filtrada.length-1==lista_filtradaT.length){
        console.log("Avanza a proceso")
    }else{
        marca=false
        msj="Cada punto necesita un tiempo de espera minimo de un segundo"
    }
    if(tarea1==null&&tarea2==null&&tarea3==null&&tarea4==null){
        msj="La ruta necesita destinos"
        marca=false
        console.log('falso')
    }else if(tareaI==null){
        marca=false
        msj="La ruta necesita un punto inicial"
    }
    for(var i=0; i<lista_filtrada.length-1;i++){
        if(lista_filtrada[i]==lista_filtrada[i+1]){   
            marca=false
            msj="No puedes poner la misma mesa consecutivamente"
        }else{                
            
        }
    }
    if(marca==true){
        //accion de buscar imagen cuando la camara saco la foto
        //mensaje de mqtt
        //sacar foto de lista filtrada[0]
        //asignar la foto a la variable nPieza
        
        time.send('4')
        time.on('message', function(message){
        console.log(message)
       
        console.log(lista_filtrada[0])
        client.publish(lista_filtrada[0],'camara')
        
        time.end()
            
       })
    }else if(marca==false){
        
        res.render('index',{
            alert: true,
            alertTitle: "Error en mesa",
            alertMessage: "No hay palet",
            alertIcon: "error",
            ip: ip,
            login: true,
            ruta: "inicio", 
            name: req.session.name                           
        });
       
    }
    function conectar(){
                client.subscribe(lista_filtrada[0])
                client.subscribe('foto')
                client.subscribe('rfid')
                client.subscribe('fallo')
            }
            
            function mensaje (topic, message){
                //console.log(message)
                
                    if(topic=='fallo'){
                        res.render('index',{
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: msj,
                        alertIcon: "Error con el sistema RFID",
                        ip: ip,
                        login: true,
                        ruta: "inicio", 
                        name: req.session.name                           
                        });   
                    }else
                    if(topic=='foto'){
                        //nPieza=message.toString()
                        red.send(message.toString())
                        red.on('message',function(message){
                           console.log(message.toString())
                            nPieza=message.toString()
                        })
                        red.end(function(error){
                            if(error){
                                console.log(error)
                            }
                        })
                        imagen1=urls(lista_filtrada[0])
                    }
                    if(topic=='rfid'){
                            rfidr=message.toString()
                            client.publish("1/autonomo",lista_filtrada[0]+'R')
                            res.redirect('/traslado')  
                    }
                    
                
                
            }
    
       
        client.on('connect',conectar)
        client.on('message',mensaje)  
        
})
app.get("/recarga",(req,res)=>{
    client.end()
    res.redirect("/inicio")
})
app.get("/python",(req,res)=>{
    var python = new PythonShell('interprete.py')
    var mensaje=""
    console.log("hello")
    python.on('message', function(message){
        console.log(message)
        mensaje=message
    })
    python.end(function(error){
        if(error){
            console.log(error)
        }
    })
    res.send('Python ejecutado')
})
app.post("/rfid-e",(req,res)=>{
    console.log(req.body.mensaje)
    res.redirect('rfid')
})
app.get('/practicas',(req, res)=>{
    imgStat=false
    conexion=false
    res.render('practicas')
})
app.get('/notas',(req,res)=>{
    res.render('notas')
})
app.get('/linea',(req, res)=>{
    client=mqtt.connect('ws://172.20.208.15:8083/mqtt')
    client.publish("mesas","prueba")
    var tiempo = new PythonShell('tiempo.py')
    tiempo.send(1)
    tiempo.on('message',function(message){
        res.redirect('/estadoM')
        tiempo.end()
    })
    m1=false,m2=false,m3=false,m4=false,m5=false
    function connect(){
        client.subscribe('m1')
        client.subscribe('m2')
        client.subscribe('m3')
        client.subscribe('m4')
        client.subscribe('m5')
    }
    function mensaje(topic,message){
        
        if(topic=="m1"){
            m1=true
        }else if(topic=="m2"){
            m2=true
        }else if(topic=="m3"){
            m3=true
        }else if(topic=="m4"){
            m4=true
        }else if(topic=="m5"){
            m5=true
        }
        
    }
    client.on('connect',connect)
    client.on('message',mensaje)
    
})
app.get('/estadoM',(req,res)=>{
    client.end()
    res.render('linea',{mesa1:m1,mesa2:m2,mesa3:m3,mesa4:m4,mesa5:m5})
})
app.get("/traslado",(req,res)=>{
    if(true){
        client.end()
        var time = new PythonShell('tiempo.py')
        var red = new PythonShell('interprete.py')
        var bandera = 0
        var contador = 0
        piezaD=null
        error=false
        inicio=new Date() 
        c=0
        client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
        function conectar(){
          client.subscribe('1/autonomo_r') 
          client.subscribe('fallo')
          client.subscribe('foto')
          client.subscribe('rfid')
        }
        
      function mensaje(topic,message){
        
        console.log(message.toString())
        if(topic=='fallo'){
            contador++
            if(message=='rfid'){
                client.publish(lista_filtrada[contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(lista_filtrada[contador],'incorrecto')
                console.log('salio mal la pick')
                error=true
                console.log('error rfid')
            }else if(message=='sensor' && error==false){
                client.publish(lista_filtrada[contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(lista_filtrada[contador],'incorrecto')
                console.log('salio mal la pick')
                error=true
                console.log('error sensor')
            }
        }
        //Sistema de comparacion de datos
        if(topic =='foto'){
            //piezaD=message.toString()
            red.send(message.toString())
            red.on('message',function(message){
                console.log(message.toString())
                piezaD=message.toString()
            })
            red.end(function(error){
                if(error){
                    console.log(error)
                }
            })
        }
        if(topic=='rfid' && error == false){
            rfidD=message.toString()
            var espera = new PythonShell('tiempo.py')
            espera.send(2)
            espera.on('message', function(message){
                
            contador++
            console.log(piezaD==nPieza)
            console.log("3 ="+piezaD===nPieza)
            console.log("Primer pieza: "+nPieza)
            console.log("Segunda: "+piezaD)
            if(piezaD == nPieza && rfidD == rfidr){
                client.publish(lista_filtrada[contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(lista_filtrada[contador],'correcto')
                console.log('salio bien la pick')
                
                //prender motor entregando lista filtrada[1]
                
                               
                       
            }else{
                client.publish(lista_filtrada[contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(lista_filtrada[contador],'incorrecto')
                console.log('salio mal la pick')
                error=true
                //prender motor entregando lista filtrada[1]
                
                
  
            }
            })
            
        }
        if(message=='Recibiendo'){
            client.publish(lista_filtrada[0],'entrega')
            //manda prendido
            client.publish('1/jetsonescaner','Prendido')

        }
        if(message=='Entregando'){
            
            if(error==true){
                     //prende el motor recibiendo lista filtrada[0]                                                      
                client.publish(lista_filtrada[0], 'recibe')
                
                client.publish('1/jetsonescaner','Prendido')
                client.publish('1/jetsonescaner','error')
            }
            if(c==1&&error==false){
                //tiempo
                fin=new Date();
                diferencia=(fin-inicio) 
                cambios=tiempo(diferencia)
                //
                client.publish(lista_filtrada[1],'recibe')
                //mensaje motores recibe lista filtrada[1]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                //client.publish(lista_filtrada[1],'sensor') se elimina mensaje sensor ya que lo hace la mesa
                time.send(esp1)
                //sacar foto lista[1] con tiempo esp1 para delay

                //posible funcion timepo.py                                           //manda tiempo de espera
                time.on('message', function(message){
                    //console.log(message)                                         // se deberia esperar para iniciar esta funcion
                
                    
                    time.end()
                    //----------------------------------
                    //recibe mensaje de la mesa lista[1]
                    //condicion de topico para almacenar imagen
                    
            //--------
                //<-
            
            })
            imagen2=urls(lista_filtrada[1])
            }else if(c==2&&error==false){
                time = new PythonShell('tiempo.py')
                fin=new Date();
                diferencia=(fin-inicio) 
                cambios1=tiempo(diferencia)
                //
                client.publish(lista_filtrada[2],'recibe')
                //mensaje motores recibe lista filtrada[2]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(esp2)
                //sacar foto lista[2] con tiempo esp2 para delay
                //posible funcion timepo.py                                           //manda tiempo de espera
                time.on('message', function(message){
                    console.log(message)                                         // se deberia esperar para iniciar esta funcion
                
                    
                    time.end()
                    //----------------------------------
                    //recibe mensaje de la mesa lista[2]
                    //condicion de topico para almacenar imagen
                    
            //--------
                //<-
            
            })
            imagen3=urls(lista_filtrada[2])
            }else if(c==3&&error==false){
                fin=new Date();
                diferencia=(fin-inicio) 
                cambios2=tiempo(diferencia)
                //
                client.publish(lista_filtrada[3],'recibe')
                //mensaje motores recibe lista filtrada[3]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(esp3)
                //sacar foto lista[3] con tiempo esp3 para delay
                //posible funcion timepo.py                                           //manda tiempo de espera
                time.on('message', function(message){
                    console.log(message)                                         // se deberia esperar para iniciar esta funcion
                
                    
                    time.end()
                    //----------------------------------
                    //recibe mensaje de la mesa lista[2]
                    //condicion de topico para almacenar imagen
                    
            //--------
                //<-
            
            })
            imagen4=urls(lista_filtrada[3])
            }else if(c==4&&error==false){
                fin=new Date();
                diferencia=(fin-inicio) 
                cambios3=tiempo(diferencia)
                //
                client.publish(lista_filtrada[4],'recibe')
                //mensaje motores recibe lista filtrada[4]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(esp4)
                //sacar foto lista[4] con tiempo esp4 para delay
                //posible funcion timepo.py                                           //manda tiempo de espera
                time.on('message', function(message){
                    console.log(message)                                         // se deberia esperar para iniciar esta funcion
                
                   
                    time.end()
                    //----------------------------------
                    //recibe mensaje de la mesa lista[4]
                    //condicion de topico para almacenar imagen
                   
            //--------
                //<-
            
            })
            imagen5=urls(lista_filtrada[4])
            }
        }
        
        if(message=='listo'){
                if(bandera==1){
                    boton='1'
                    bandera = 0
                    client.end()
                    error = false
                }
            if(c==lista_filtrada.length||error==true){
                if(error==true){
                    client.publish('1/autonomo',lista_filtrada[0]+'E')
                    client.publish('1/jetsonescaner','error')
                    bandera = 1
                }else if(error==false){
                    fin=new Date();
                    diferencia=(fin-inicio) 
                    cambios3=tiempo(diferencia)
                    boton='1'
                    bandera = 0
                    client.end()
                }
                
                
            }else{
                if(c==0){
                    client.publish('1/autonomo',lista_filtrada[1]+'E')
                if(lista_filtrada.length>0){
                    c=1 
             
                }    
            }else if(c==1){
                client.publish('1/autonomo',lista_filtrada[2]+'E')
                if(lista_filtrada.length>1){
                c=2  
                 
                }
                inicio=new Date()
            }else if(c==2){
                client.publish('1/autonomo',lista_filtrada[3]+'E')
                if(lista_filtrada.length>2){
                    c=3
                     
                }
                inicio=new Date()
            }else if(c==3){
                client.publish('1/autonomo',lista_filtrada[4]+'E')
                if(lista_filtrada.length>3){
                    c=4
                     
                } 
                inicio=new Date()
            }  
            }          
            }  
        }
        var tam=lista_filtrada.length
    client.on('connect', conectar)
    client.on('message',mensaje)

    res.render('resultados',{ip: ip,login: true,name: req.session.name,objetos:lista_filtrada,tamaño:tam,img:imagen1,t1:cambios,t2:cambios1,t3:cambios2,t4:cambios3,f2:imagen2,f3:imagen3,f4:imagen4,f5:imagen5})  
    }
    
})
app.get('/recibir',(req,res)=>{
    
    var tam=lista_filtrada.length
    res.render('tiempos',{t1:cambios,t2:cambios1,t3:cambios2,t4:cambios3,objetos:lista_filtrada,tamaño:tam})
})
app.get("/status",(req,res)=>{
    
    res.render('status',{stat:mnsj})
})
app.get('/fotos',(req,res)=>{
    var tam=lista_filtrada.length
    
    res.render('fotoC',{img:imagen1,f2:imagen2,f3:imagen3,f4:imagen4,f5:imagen5,objetos:lista_filtrada,tamaño:tam})
})
app.get('/control',(req,res)=>{
    res.render('botones')
})
app.get('/m1E',(req,res)=>{
    client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
        function conectar(){
          client.subscribe('mesa1') 
        }
        
        client.publish('mesa1',"entrega")
    function mensaje(topic, message){
        console.log(message)
        client.end()
    }
    client.on('connect', conectar)
    client.on('message',mensaje)
})
app.get('/m1R',(req,res)=>{
    client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
        function conectar(){
          client.subscribe('mesa1') 
        }
        client.publish('mesa1',"recibe")
    function mensaje(topic, message){
        console.log(message)
        client.end()
    }
    client.on('connect', conectar)
    client.on('message',mensaje)
})
app.get('/m2E',(req,res)=>{
    client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
        function conectar(){
          client.subscribe('mesa2') 
        }
        client.publish('mesa2',"entrega")
    function mensaje(topic, message){
        console.log(message)
        client.end()
    }
    client.on('connect', conectar)
    client.on('message',mensaje)
})
app.get('/m2R',(req,res)=>{
    client = mqtt.connect('ws://172.20.208.15:8083/mqtt')
        function conectar(){
          client.subscribe('mesa2') 
        }
        client.publish('mesa2',"recibe")
    function mensaje(topic, message){
        console.log(message)
        client.end()
    }
    client.on('connect', conectar)
    client.on('message',mensaje)
})
server.listen(port, hostname, () => {
    console.log('server runing at', hostname)
});