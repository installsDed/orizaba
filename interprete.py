import tensorflow as tf
import cv2
import os
from keras.models import load_model

import numpy as np


#Cargar el modelo
# ================================
modelo = load_model("C:/Users/INGPC05/Documents/mRsP_290925/public/modelo.h5")

# Mostrar resumen del modelo (opcional)
modelo.summary()


# cargar y procesar imagen
# ================================
def preparar_imagen(ruta_img):
    imagen=[]
    img=cv2.imread(ruta_img,cv2.IMREAD_GRAYSCALE)
    imagen.append(img)
    imagen=np.array(imagen).astype('float32')/255
    return imagen


#Hacer predicción

def predecir_imagen(ruta_img):
    img_array = preparar_imagen(ruta_img)
    
  
    prediccion = modelo.predict(img_array)
    
    
    clases = ["circulo", "cuadrado", "triangulo"]
    
    
    indice = np.argmax(prediccion)
    
    #print("\n===== RESULTADO =====")
    print("Predicción:", clases[indice])
    #print("Probabilidades:", prediccion[0])


predecir_imagen("C:/Users/INGPC05/Documents/mRsP_300625/public/imagen.jpg") # aqui se pone la imagen a predecir
