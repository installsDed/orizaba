
export const labState = {
    api:{
        //la A es para las alertas
        imgMesa: 'vacio.jpg',
        estado: 'inicio',
        progreso: 0,
        alerta: false,
        tituloA: null,
        mensajeA: null,
        iconoA: null,
        rutaA: 'inicio',
        conexionLab: false
    },
    tiempos: {
        inicio: null,
        fin: null,
        diferencia: null,
        tiempo1: null,
        tiempo2: null,
        tiempo3: null,
        tiempo4: null
    },

    fechas: {
        fE: null,
        fR: null
    },

    estado: {
        ver: 0,
        red: null,
        redN: false,//boton de manual o red neuronal
        imgStat: false
    },

    piezas: {
        piezaD: null,
        pieza: null,
        nPieza: null //pieza que vio al inicio
    },

    rfid: {
        rfidD: null,
        rfidr: null
    },

    mensajes: {
        mnsj: "Error",
        msj: null,
        errorF: false,
        error: false, // error de modo manual y automatico (en automatico sucede por mala foto o rfid)
        flag: 'subir.png'
    },

    mesas: {
        m1: false,
        m2: false,
        m3: false,
        m4: false,
        m5: false
    },

    cambios: {
        c: 0, //contador del traslado (para ver si ya avanzo a la siguiente mesa)
        t0: "Primer tiempo",
        t1: "Segundo tiempo",
        t2: "Tercer tiempo",
        t3: "Cuarto tiempo",
        contador: 0,
        boton: '0',
        bandera: 0
    },

    

    tareas: {
        tarea1: null,
        tareaI: null,
        tarea2: null,
        tarea3: null,
        tarea4: null,
        tareaV: null
    },

    segundos: {
        esp1: null,
        esp2: null,
        esp3: null,
        esp4: null
    },

    listas: {
        lista_filtrada: null,
        lista_filtradaT: null
    },

    camaras: {
        dir_cam1: null,
        cam: null,
        imagenes: {
            imagen1: "mesa10.png",
            imagen2: "mesa10.png",
            imagen3: "mesa10.png",
            imagen4: "mesa10.png",
            imagen5: "mesa10.png"
        }
    }
};