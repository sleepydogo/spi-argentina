# BELLA Ideathon: Desafío de Innovación de Copérnico

## Descripción del problema
Los incendios forestales se han duplicado en todo el mundo en los últimos 20 años, y los incendios devoran el equivalente a 16 campos de fútbol por minuto, según un
estudio conjunto de la Universidad de Maryland en Estados Unidos, Global Forest Watch (GFW) y el World Resources Institute.

En Argentina, nos enfrentamos a uno de los problemas ambientales más devastadores. Según datos recabados por el Cuerpo Nacional de Bomberos
Servicio de Gestión e INTA, los incendios forestales han arrasado hasta el momento más de 700.000 hectáreas en distintas provincias del país
en 2022.

La gente pierde sus hogares, tierras, trabajos y oxígeno. Incluso si el fuego ha terminado, los incendios forestales dejan enfermedades y epidemias en la vida silvestre, afectando la fotosíntesis, lo que es muy perjudicial para
nuestro planeta.

## Solución

Desarrollar una tecnología accesible a los ciudadanos, que utiliza inteligencia artificial (IA) para interpretar y procesar datos complejos y presentar la información que es comprensible para los humanos.

Este proyecto predice las posibilidades de que se inicie un incendio. Utiliza los siguientes parámetros: 0m u component of wind, 10m v component fo wind, 2m temperature, leaf area index  high vegetation, leaf area index low vegetation y total precipitation de Datos por hora ERA5. Los datos de los índices de peligro de incendios se obtuvieron del Servicio de Gestión de Emergencias de Copernicus.


## Miembros del equipo
- David Akim
- Tomas Emanuel Schattmann
- Aldana Tedesco

## Requisitos de instalación
En la terminal ejecuta los siguientes comandos:
- `pip install cdsapi`
- `pip install numpy`
- `pip install netCDF4`
- `pip install torch`
- `pip install skorch`
- `pip install pandas`


## Orden para ejecutar cuadernos
1. 0_download_data.ipynb
2. 1_prepare_data.ipynb
3. 2_norm_consts.ipynb
4. 3_train_model.ipynb