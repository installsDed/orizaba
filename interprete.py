import tensorflow as tf
import cv2
import os
from keras.models import load_model

import numpy as np
IMG_WIDTH=300
IMG_HEIGHT=234
figura=input()
#Cargar el modelo
# ================================
modelo = load_model("C:/Users/Laboratorio/Documents/mRsP_300625/public/modelo_color.h5")

# Mostrar resumen del modelo (opcional)
#modelo.summary()


# cargar y procesar imagen
# ================================
def preparar_imagen(ruta_img):
    imagen=[]
    img = cv2.imread(ruta_img, cv2.IMREAD_COLOR)
    
    if img is None:
        raise FileNotFoundError(f"No se encontró la imagen: {ruta_img}")
    
    img_redimensionada = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
    
    # CAMBIO 2: Convertir BGR (OpenCV) a RGB (TensorFlow)
    img_rgb = cv2.cvtColor(img_redimensionada, cv2.COLOR_BGR2RGB)
    
    imagen.append(img_rgb)
    imagen=np.array(imagen).astype('float32')/255.0
    
    return imagen


#Hacer predicción

def predecir_imagen(ruta_img):
    img_array = preparar_imagen(ruta_img)
    
  
    prediccion = modelo.predict(img_array)
    
    
    clases = ["circulo", "cuadrado", "triangulo"]
    
    
    indice = np.argmax(prediccion)
    
    #print("\n===== RESULTADO =====")
    #print("Predicción:", clases[indice])
    #print("Probabilidades:", prediccion[0])
    print(clases[indice])

predecir_imagen("C:/Users/Laboratorio/Documents/mRsP_300625/public/mesas/"+figura+".jpg") # aqui se pone la imagen a predecir