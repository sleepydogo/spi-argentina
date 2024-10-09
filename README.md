# 🔥 Sistema de Predicción de Incendios Forestales en Argentina

Este proyecto utiliza inteligencia artificial y datos satelitales para predecir la probabilidad de incendios forestales en Argentina, basándose en patrones históricos de incendios y condiciones ambientales. Aprovechando la infraestructura satelital de la red Copernicus, el sistema genera índices de riesgo que permiten detectar áreas susceptibles a incendios, brindando información clave para la prevención y respuesta rápida ante emergencias.

## 🚀 Objetivo del Proyecto

El objetivo principal es desarrollar un modelo de predicción de incendios forestales utilizando datos satelitales en tiempo real y registros históricos de incendios. El sistema está diseñado para alertar a las autoridades y organizaciones sobre posibles focos de incendio, ayudando en la planificación de medidas preventivas y optimizando la asignación de recursos para el combate de incendios.

## 🛰️ Datos Satelitales de Copernicus

El sistema recibe y procesa datos proporcionados por la Constelación Sentinel de los satélites de Copernicus. Estos datos incluyen imágenes multiespectrales, información de temperatura de la superficie, vegetación, humedad del suelo, y otras variables que influyen en la ocurrencia de incendios forestales.

## 🧠 Inteligencia Artificial

El núcleo del proyecto es un modelo de machine learning que analiza los registros de incendios previos en diferentes regiones de Argentina. A partir de esos datos y las condiciones actuales detectadas por los satélites, el sistema genera un índice de probabilidad de incendios para áreas específicas. Los pasos clave del proceso son:

  Recopilación de Datos Históricos: Se construye una base de datos de incendios forestales previos, condiciones climáticas y datos ambientales.
  Entrenamiento del Modelo: Se entrena el modelo predictivo utilizando técnicas de regresión y clasificación basadas en algoritmos de aprendizaje supervisado.
  Predicción en Tiempo Real: El modelo predice la probabilidad de un incendio en base a los datos satelitales recibidos y patrones históricos.
  Generación de Alertas: El sistema emite alertas en zonas con alto riesgo de incendios, indicando la probabilidad de ocurrencia en diferentes regiones.

## 📊 Visualización de Resultados

Los resultados se pueden visualizar a través de:

  Mapas interactivos que muestran las áreas con mayor riesgo de incendios.
  Reportes detallados sobre los factores que influyen en las predicciones.
  Alertas que pueden ser enviadas a través de notificaciones automáticas a usuarios y autoridades pertinentes.

## 🛠️ Tecnologías Utilizadas

  Python: Para procesamiento de datos y desarrollo del modelo de machine learning.
  TensorFlow / Scikit-learn: Para el entrenamiento y ajuste del modelo predictivo.
  APIs satelitales de Copernicus: Para obtener datos en tiempo real.
  Herramientas de procesamiento de imágenes satelitales: Para analizar las imágenes proporcionadas por la red de satélites Sentinel. 
  Jupyter Notebooks: Para pruebas y análisis exploratorio de los datos.

## 📦 Instalación

Clonar el repositorio:

    git clone https://github.com/usuario/spi-argentina.git
    cd spi-argentina

Instalar las dependencias:

    pip install -r requirements.txt

Ejecutar el script principal:

    python main.py

## 📈 Entrenamiento del Modelo

Para entrenar el modelo con nuevos datos históricos:

Preparar los datos históricos de incendios en formato CSV.
Configurar el archivo config.py para incluir la ruta de los datos.
Ejecutar el entrenamiento:

    python train.py

## 🗺️ Uso del Sistema en Tiempo Real

Para recibir predicciones basadas en datos satelitales en tiempo real:

Configurar las credenciales de la API de Copernicus en el archivo config.py.
Ejecutar el script de predicción:

    python predict.py

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Consulte el archivo LICENSE para más detalles.
