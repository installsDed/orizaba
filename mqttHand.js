import mqtt from 'mqtt';
import { labState } from './state.js';
import { PythonShell } from 'python-shell';

const client = mqtt.connect('ws://172.20.208.15:8083/mqtt');
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
client.on('connect',()=>{
    client.subscribe('foto')
    client.subscribe('rfid')
    client.subscribe('fallo')
    client.subscribe("m1")
    client.subscribe("grabadora")
    client.subscribe('m2')
    client.subscribe('m3')
    client.subscribe('m4')
    client.subscribe('m5')
    client.subscribe('1/autonomo_r')
        
})
client.on('message', (topic, message) => {
    if(labState.api.estado=='proceso'){
        var time = new PythonShell('tiempo.py')
        var red = new PythonShell('interprete.py') 
    if(topic=='fallo'){
            
            labState.api.alerta=true
            labState.api.tituloA='Error Mesa'
            labState.api.mensajeA='Error con el sistema de sensor o RFID'
            labState.api.iconoA="Error"
            labState.api.rutaA="inicio"
            labState.api.estado="inicio"
                
        }else
        if(topic=='foto'){
            if(labState.estado.redN){
                red.send(message.toString())
                red.on('message',function(message){
                    console.log(message.toString())
                    labState.piezas.nPieza=message.toString()
            })
            red.end(function(error){
                if(error){
                    console.log(error)
                }
            })
            }else{
                console.log("Evaluación Manual activada")
            }
            labState.camaras.imagenes.imagen1=urls(labState.listas.lista_filtrada[0])
        }
        if(topic=='rfid'){
                labState.rfid.rfidr=message.toString()
                client.publish("1/autonomo",lista_filtrada[0]+'R')
                labState.api.estado='traslado'  
        }
    }else if(labState.api.estado=='vision' || labState.api.estado=='rfid'){
        if(topic=='rfid'){
                    labState.mensajes.mnsj="El TAG dice: "+message
                    
                }else if(topic=='grabadora'){
                    labState.mensajes.mnsj="El TAG se grabo con "+message
                }else if(topic == 'm1'){
                    labState.mesas.m1=true
                    labState.api.conexionLab=false
                    labState.mensajes.mnsj="Conexion con mesa exitosa."
                }else if(topic == 'fallo'){
                    labState.mensajes.mnsj="Error"
                }else if(topic == 'foto'){
                    labState.mensajes.mnsj="El sistema saco la foto, si se muestra la imagen en pantalla puede empezar a evaluar la imagen"
                    labState.estado.imgStat=true
                }
    }else if(labState.api.estado=='estadoM'){
        if(topic=="m1"){
            labState.mesas.m1=true
        }else if(topic=="m2"){
            labState.mesas.m2=true
        }else if(topic=="m3"){
            labState.mesas.m3=true
        }else if(topic=="m4"){
            labState.mesas.m4=true
        }else if(topic=="m5"){
            labState.mesas.m5=true
        }
        
    }else if(labState.api.estado=='traslado'){
        var time = new PythonShell('tiempo.py')
        var red = new PythonShell('interprete.py')
        console.log(message.toString())
        if(topic=='fallo'){
            labState.cambios.contador++
            if(message=='rfid'){
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'incorrecto')
                console.log('salio mal la pick')
                labState.mensajes.error=true
                console.log('error rfid')
            }else if(message=='sensor' && labState.mensajes.errorF==false){
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'incorrecto')
                console.log('salio mal la pick')
                labState.mensajes.errorF=true
                console.log('error sensor')
            }
        }
        //Sistema de comparacion de datos
        if(topic =='foto'){
            //piezaD=message.toString()
            if(labState.estado.redN){
            red.send(message.toString())
                        red.on('message',function(message){
                            console.log(message.toString())
                            labState.piezas.piezaD=message.toString()
                        })
                        red.end(function(error){
                            if(error){
                                console.log(error)
                            }
                        })
            }else{

            }
            
        }
        if(topic=='rfid' && labState.mensajes.error == false){
            labState.rfid.rfidD=message.toString()
            if(labState.estado.redN){
            var espera = new PythonShell('tiempo.py')
            labState.cambios.contador++
            espera.send(2)
            espera.on('message', function(message){
                
            
            console.log(labState.piezas.piezaD==labState.piezas.nPieza)
            console.log("3 ="+labState.piezas.piezaD===labState.piezas.nPieza)
            console.log("Primer pieza: "+labState.piezas.nPieza)
            console.log("Segunda: "+labState.piezas.piezaD)
            if(labState.piezas.piezaD == labState.piezas.nPieza && labState.rfid.rfidD == labState.rfid.rfidr){
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'correcto')
                console.log('salio bien la pick')
                
                //prender motor entregando lista filtrada[1]
                
                               
                       
            }else{
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'incorrecto')
                console.log('salio mal la pick')
                labState.mensajes.error=true
                //prender motor entregando lista filtrada[1]
                
                
  
            }
            })
        }else{
            var espera = new PythonShell('tiempo.py')
            labState.cambios.contador++
            espera.send(2)
            espera.on('message', function(message){
                if(labState.rfid.rfidD == labState.rfid.rfidr){
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'correcto')
                console.log('salio bien la pick')
                
                //prender motor entregando lista filtrada[1]
                
                               
                       
            }else{
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'entrega')
                client.publish('1/jetsonescaner','Prendido')
                client.publish(labState.listas.lista_filtrada[labState.cambios.contador],'incorrecto')
                console.log('salio mal la pick')
                labState.cambios.error=true
                //prender motor entregando lista filtrada[1]
                
                
  
            }
            })
                
        }
        }
        if(message=='Recibiendo'){
            client.publish(labState.listas.lista_filtrada[0],'entrega')
            //manda prendido al RMA
            client.publish('1/jetsonescaner','Prendido')

        }
        if(message=='Entregando'){
            
            if(labState.mensajes.error==true && labState.cambios.c==0){
                     //prende el motor recibiendo lista filtrada[0]                                                      
                client.publish(labState.listas.lista_filtrada[0], 'recibe')
                
                client.publish('1/jetsonescaner','Prendido')
                client.publish('1/jetsonescaner','error')
            }else if(labState.mensajes.error == true && labState.cambios.c > 0){
                client.publish('1/jetsonescaner', 'errorE')
                labState.cambios.c=0
            }

            if(labState.cambios.c==1&&labState.mensajes.error==false){
                //tiempo
                labState.tiempos.fin=new Date();
                labState.tiempos.diferencia=(labState.tiempos.fin-labState.tiempos.inicio) 
                labState.cambios.t0=tiempo(labState.tiempos.diferencia)
                //
                client.publish(labState.listas.lista_filtrada[1],'recibe')
                //mensaje motores recibe lista filtrada[1]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                //client.publish(lista_filtrada[1],'sensor') se elimina mensaje sensor ya que lo hace la mesa
                time.send(labState.segundos.esp1)
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
            labState.camaras.imagenes.imagen2=urls(labState.listas.lista_filtrada[1])
            }else if(labState.cambios.c==2&&labState.mensajes.error==false){
                time = new PythonShell('tiempo.py')
                labState.tiempos.fin=new Date();
                labState.tiempos.diferencia=(labState.tiempos.fin-labState.tiempos.inicio) 
                labState.cambios.t1=tiempo(labState.tiempos.diferencia)
                //
                client.publish(labState.listas.lista_filtrada[2],'recibe')
                //mensaje motores recibe lista filtrada[2]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(labState.segundos.esp2)
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
            labState.camaras.imagenes.imagen3=urls(labState.listas.lista_filtrada[2])
            }else if(labState.cambios.c==3&&labState.mensajes.error==false){
                labState.tiempos.fin=new Date();
                labState.tiempos.diferencia=(labState.tiempos.fin-labState.tiempos.inicio) 
                labState.cambios.t2=tiempo(labState.tiempos.diferencia)
                //
                client.publish(labState.listas.lista_filtrada[3],'recibe')
                //mensaje motores recibe lista filtrada[3]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(labState.segundos.esp3)
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
            labState.camaras.imagenes.imagen4=urls(labState.listas.lista_filtrada[3])
            }else if(labState.cambios.c==4&&labState.mensajes.error==false){
                labState.tiempos.fin=new Date();
                labState.tiempos.diferencia=(labState.tiempos.fin-labState.tiempos.inicio) 
                labState.cambios.t3=tiempo(labState.tiempos.diferencia)
                //
                client.publish(labState.listas.lista_filtrada[4],'recibe')
                //mensaje motores recibe lista filtrada[4]
                
 
                //manda mensaje motor de prendido
                client.publish('1/jetsonescaner','Prendido')
                
                time.send(labState.segundos.esp4)
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
            labState.camaras.imagenes.imagen5=urls(labState.listas.lista_filtrada[4])
            }
        }
        
        if(message=='listo'){
                if(bandera==1){
                    labState.cambios.boton='1'
                    labState.cambios.bandera = 0
                    
                    labState.mensajes.error = false
                }
            if(labState.cambios.c==labState.listas.lista_filtrada.length||labState.mensajes.error==true){
                if(labState.mensajes.error==true){
                    client.publish('1/autonomo',labState.listas.lista_filtrada[0]+'E')
                    client.publish('1/jetsonescaner','error')
                    labState.cambios.bandera = 1
                }else if(labState.mensajes.error==false){
                    labState.tiempos.fin=new Date();
                    labState.tiempos.diferencia=(labState.tiempos.fin-labState.tiempos.inicio) 
                    labState.cambios.t3=tiempo(labState.tiempos.diferencia)
                    labState.cambios.boton='1'
                    labState.cambios.bandera = 0
                    
                }
                
                
            }else{
                if(labState.cambios.c==0){
                    client.publish('1/autonomo',labState.listas.lista_filtrada[1]+'E')
                if(labState.listas.lista_filtrada.length>0){
                    labState.cambios.c=1 
             
                }    
            }else if(labState.cambios.c==1){
                client.publish('1/autonomo',labState.listas.lista_filtrada[2]+'E')
                if(labState.listas.lista_filtrada.length>1){
                labState.cambios.c=2  
                 
                }
                labState.tiempos.inicio=new Date()
            }else if(labState.cambios.c==2){
                client.publish('1/autonomo',labState.listas.lista_filtrada[3]+'E')
                if(labState.listas.lista_filtrada.length>2){
                    labState.cambios.c=3
                     
                }
                labState.tiempos.inicio=new Date()
            }else if(labState.cambios.c==3){
                client.publish('1/autonomo',labState.listas.lista_filtrada[4]+'E')
                if(labState.listas.lista_filtrada.length>3){
                    labState.cambios.c=4
                     
                } 
                labState.tiempos.inicio=new Date()
            }  
            }          
            }
    }
});



export { client }