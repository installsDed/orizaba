import express from 'express';
import http from 'http';
import path from 'path';
import {PythonShell} from "python-shell";
import {promises as fs2} from 'fs';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { Server } from "socket.io"
import session from 'express-session';
import mysql from 'mysql';
import multer from 'multer';
import { client } from './mqttHand.js';
import { labState } from './state.js';


//var flag= "subir.png"

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
            labState.tareas.tareaI = msg;
        });
        socket.on("inicioV", (msg)=>{
            labState.tareas.tareaV = msg;
        });
        socket.on("t1", (msg)=>{
            labState.segundos.esp1 = msg
        })
        socket.on("t2", (msg)=>{
            labState.segundos.esp2 = msg
        })
        socket.on("t3", (msg)=>{
            labState.segundos.esp3 = msg
        })
        socket.on("t4", (msg)=>{
            labState.segundos.esp4 = msg
        })
        socket.on("punto1", (msg)=>{
            labState.tareas.tarea1 = msg;
        });     
        socket.on("punto2", (msg)=>{
            labState.tareas.tarea2 = msg;
        });  
        socket.on("punto3", (msg)=>{
            //console.log("punto3:", msg)
            labState.tareas.tarea3 = msg;
        });  
        socket.on("punto4", (msg)=>{
            //console.log("punto4:", msg)
            labState.tareas.tarea4 = msg;
        });  
        

   })

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'public')
    },
    filename: function (req, file, cb) {
    cb(null, 'modelo_color.h5'); // Siempre guarda con el mismo nombre
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
app.post('/nm', upload.single('modelo_color'), (req,res)=>{
    
    if(!req.file) return console.log('fallo')
    console.log('success')
    res.redirect('inicio')
})
app.use(function(req, res, next) {
    try{
        if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
    }catch (error) {
        console.log(error);
    }
});
app.get('/notas',(req,res)=>{
    res.render('notas')
})
app.get('/inicio',(req,res)=>{
    if(true){
        
        labState.api.estado='inicio'
        labState.cambios.t0='Primer tiempo'
        labState.cambios.t1='Segundo tiempo'
        labState.cambios.t2='Tercer tiempo'
        labState.cambios.t3='Cuarto tiempo'  
        labState.tareas.tareaI=null
        labState.tareas.tareaV=null
        labState.tareas.tarea1=null
        labState.tareas.tarea2=null
        labState.tareas.tarea3=null
        labState.tareas.tarea4=null
        labState.segundos.esp1=null
        labState.segundos.esp2=null
        labState.segundos.esp3=null
        labState.segundos.esp4=null
        
        
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
     if(labState.api.alerta){
        res.render('index',{
            alert: true,
            alertTitle: labState.api.tituloA,
            alertMessage: labState.api.mensajeA,
            alertIcon: labState.api.iconoA,
            ip: ip,
            login: true,
            ruta: labState.api.rutaA, 
            name: req.session.name                           
            });
            labState.api.alerta=false
     }else{
        res.render('index' , {login: true, 
        name: req.session.name,
        ip: ip
        });
     }
       
     
    }
    
})
app.get('/api/status', (req, res) => {
    res.json({
        ubicacion: labState.api.estado
    });
});

app.get("/rfid", (req,res)=>{
    labState.api.estado='rfid'
    labState.mensajes.mnsj="Esperando proceso..."
    res.render("rfid")
})
app.get("/vision", (req,res)=>{
    labState.api.estado='vision'
    
    labState.mensajes.mnsj="Necesitas sacar una foto"
    res.render('foto')
})

app.post("/get",async(req,res)=>{
    let variable = req.body?.valor
    
    
    if(variable=="conectando"){
        if(labState.api.conexionLab){
            labState.mensajes.mnsj="Error al iniciar la conexión"
            
            
        }else{
           labState.mensajes.mnsj="Conectando con la mesa"
            client.publish("mesas", "prueba")
            labState.api.conexionLab=true
        }
        
    }else if(variable=="leyendo"&&labState.mesas.m1){
        labState.mensajes.mnsj="Leyendo el TAG"
        client.publish("Mesa 1","rfidP")
    }else if(variable=="evaluar"&&labState.mesas.m1){
        labState.mensajes.mnsj="Evaluando la imagen..."
        var check = new PythonShell('interprete.py')
        check.send("imgMesa1")
        check.on('message',function(message){
            
            labState.mensajes.mnsj="La red detecto: "+message.toString()
            check.end()
        })
    }else if(variable=="foto"&&labState.mesas.m1){
        labState.mensajes.mnsj="Se esta tomando la fotografia..."
        client.publish("Mesa 1","camaraP")
    }else if(variable&&labState.mesas.m1){
        labState.mensajes.mnsj="Grabando TAG"
        client.publish("graba",variable)
    }else if(labState.mesas.m1 == false){
        labState.mensajes.mnsj="Necesitas prender la mesa o establecer la conexión."
    }else{
        labState.mensajes.mnsj="Esperando proceso..."
    }
    return res.sendStatus(204).end()
})
app.get('/practicas',(req, res)=>{
    labState.estado.imgStat=false
    labState.api.conexionLab=false
    res.render('practicas')
})
app.get("/status",(req,res)=>{
    
    res.render('status',{stat:labState.mensajes.mnsj})
})
app.get("/statusIMG",(req,res)=>{
    
    res.render('img',{imV:labState.mensajes.flag})
})
app.get('/fotos',(req,res)=>{
    var tam=labState.listas.lista_filtrada.length
    
    res.render('fotoC',{img:labState.camaras.imagenes.imagen1,
        f2:labState.camaras.imagenes.imagen2,
        f3:labState.camaras.imagenes.imagen3,
        f4:labState.camaras.imagenes.imagen4,
        f5:labState.camaras.imagenes.imagen5,
        objetos:labState.listas.lista_filtrada,tamaño:tam})
})
app.get('/control',(req,res)=>{
    res.render('botones')
})
app.post("/aError",async(req,res)=>{
    let variable = req.body?.valor
    if(variable=="error"){
       labState.mensajes.error=true
        console.log("Marcando error de forma manual") 
    }else{

    }
    return res.status(204).end()
})
app.get("/proceso", (req, res)=>{
    let marca=true
    var time = new PythonShell('tiempo.py')
    labState.api.estado='proceso'
    console.log("Tareas ",labState.tareas.tareaI,labState.tareas.tarea1, labState.tareas.tarea2, labState.tareas.tarea3, labState.tareas.tarea4, labState.tareas.tareaV)
    let lista_rutas = [labState.tareas.tareaI,labState.tareas.tarea1, labState.tareas.tarea2, labState.tareas.tarea3, labState.tareas.tarea4,]
    let lista_tiempos=[labState.segundos.esp1,labState.segundos.esp2,labState.segundos.esp3,labState.segundos.esp4]
    if (labState.tareas.tareaV=='manual' || labState.tareas.tareaV==null){
        labState.estado.redN=false
        console.log("Manual")
    }else if(labState.tareas.tareaV=='auto'){
        labState.estado.redN=true
        console.log("Automatico")
    }else{
        labState.estado.redN=false
        console.log("Error 202, el sistema puede seguir funcionando pero hay que darle mantenimiento")
    }
    // filtro para eliminar los ceros y null de la lista_rutas y tiempos
    labState.listas.lista_filtrada = lista_rutas.filter(element => element != 0 && element != null)
    labState.listas.lista_filtradaT =lista_tiempos.filter(element => element !=0&&element!=undefined)
    if(labState.listas.lista_filtrada.length-1==labState.listas.lista_filtradaT.length){
        
    }else{
        marca=false
        labState.mensajes.msj="Cada punto necesita un tiempo de espera minimo de un segundo"
    }
    if(labState.tareas.tarea1==null&&labState.tareas.tarea2==null&&labState.tareas.tarea3==null&&labState.tareas.tarea4==null){
        labState.mensajes.msj="La ruta necesita destinos"
        marca=false
        console.log('falso')
    }else if(labState.tareas.tareaI==null){
        marca=false
        labState.mensajes.msj="La ruta necesita un punto inicial"
    }
    for(var i=0; i<labState.listas.lista_filtrada.length-1;i++){
        
        if(labState.listas.lista_filtrada[i]==labState.listas.lista_filtrada[i+1]){   
            marca=false
            labState.mensajes.msj="No puedes poner la misma mesa consecutivamente"
        }else{                
            
        }
    }
    if(marca==true){
        //accion de buscar imagen cuando la camara saco la foto
        //mensaje de mqtt
        //sacar foto de lista filtrada[0]
        //asignar la foto a la variable nPieza
        console.log("Avanza a proceso")
        time.send('4')
        client.publish(labState.listas.lista_filtrada[0],'camara')
        time.on('message', function(message){
        console.log(message)
        console.log(labState.listas.lista_filtrada[0])
        
        time.end()

          
       })
    }else if(marca==false){
        
        labState.api.alerta=true
        labState.api.tituloA='Error datos ruta'
        labState.api.mensajeA=labState.mensajes.msj
        labState.api.iconoA="Error"
        labState.api.rutaA="inicio"
        labState.api.estado="error"
    }
     
    return res.status(204).end()  
})
app.get('/linea',(req, res)=>{
    labState.mesas.m1=false,labState.mesas.m2=false,labState.mesas.m3=false,labState.mesas.m4=false,labState.mesas.m5=false
    client.publish("mesas","prueba")
    labState.api.estado='estadoM'
    return res.status(204).end() 
})
app.get('/estadoM',(req,res)=>{
    res.render('linea',{mesa1:labState.mesas.m1,
        mesa2:labState.mesas.m2,
        mesa3:labState.mesas.m3,
        mesa4:labState.mesas.m4,
        mesa5:labState.mesas.m5})
})
app.get('/recibir',(req,res)=>{
    
    res.render('tiempos',{t1:labState.cambios.t0,
        t2:labState.cambios.t1,
        t3:labState.cambios.t2,t4:labState.cambios.t3,
        objetos:labState.listas.lista_filtrada,
        tamaño:labState.listas.lista_filtrada.length,
        ia:labState.estado.redN})
})
app.get('/fotos',(req,res)=>{
    res.render('fotoC',{img:labState.camaras.imagenes.imagen1,
        f2:labState.camaras.imagenes.imagen2,
        f3:labState.camaras.imagenes.imagen3,
        f4:labState.camaras.imagenes.imagen4,
        f5:labState.camaras.imagenes.imagen5,
        objetos:labState.listas.lista_filtrada,
        tamaño:labState.listas.lista_filtrada.length})
})

app.get('/traslado',(req,res)=>{
    labState.cambios.contador=0
    labState.cambios.bandera=0
    labState.cambios.c=0
    labState.cambios.boton='0'
    labState.piezas.piezaD=null
    labState.mensajes.error=false
    labState.tiempos.inicio=new Date()
    res.render('resultados',{objetos:labState.listas.lista_filtrada,
        tamaño:labState.listas.lista_filtrada.length,
        ia:labState.estado.redN,
        img:labState.camaras.imagenes.imagen1,
        t1:labState.cambios.t0,
        t2:labState.cambios.t1,
        t3:labState.cambios.t2,
        t4:labState.cambios.t3,
        f2:labState.camaras.imagenes.imagen2,
        f3:labState.camaras.imagenes.imagen3,
        f4:labState.camaras.imagenes.imagen4,
        f5:labState.camaras.imagenes.imagen5})
})

server.listen(port, hostname, () => {
    console.log('server runing at', hostname)
});

