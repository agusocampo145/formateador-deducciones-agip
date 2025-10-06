# AGIP - ANGULAR
## https://deduccionesagip.web.app/

# 💼 Formateador de Deducciones AGIP  

Aplicación web desarrollada con **Angular** para facilitar una tarea mensual en la generación de las **declaraciones de Ingresos Brutos (IIBB)** para empresas con **retenciones y/o percepciones** en la Ciudad de Buenos Aires 🧾.  

---

## 🚀 Objetivo  

Automatizar un proceso que antes se hacía manualmente:  
copiar y reformatear los datos de retenciones y percepciones desde la web de **AGIP** para subirlos correctamente a la declaración de **AFIP** (Hoy ARCA).  

Este proceso solía ser tedioso, repetitivo y muy propenso a errores humanos 😅.  
La aplicación resuelve este problema de forma automática, rápida y sin necesidad de modificaciones manuales.  

---

## ⚙️ Funcionamiento  

1. Se copian los datos desde la web de **AGIP** (sin edición previa).  
2. Al presionar **"En formato"**, las deducciones se convierten automáticamente al formato requerido por **AFIP**.  
3. Con **"Descargar archivo .txt"**, se obtiene el archivo listo para importar en la declaración de IIBB.  
4. La app también calcula y muestra el **total de montos retenidos/percibidos**, facilitando la verificación.  

---

## 🧠 Tecnologías utilizadas  

- **Angular** (Frontend)  
- **TypeScript**  
- **Firebase Hosting**  
- Versión original: **Python**, luego migrada a Angular para uso público  

---

## 📅 Historia del proyecto  

- 🧩 Creado a fines de **2021** en **Python**.  
- 🔄 Reescrito en **TypeScript / Angular** a comienzos de **2022** para hacerlo accesible desde la web.  
- 💡 En **2023**, AGIP incorporó una función similar en su portal oficial (aunque yo llegué primero 😜).  
- Actualmente aún la utilizo todos los meses para calcular **totales mensuales**, ya que la página oficial todavía no incluye esa función, y proyecto algunos cambios para mejorarla en algunos puntos que AGIP aún no implemento.  

---

## 💬 Autor  

Desarrollado por **Agustín Ocampo** 🐼  
📧 [oca_a@outlook.com.ar](mailto:oca_a@outlook.com.ar)  
🔗 [LinkedIn](https://www.linkedin.com/in/agust%C3%ADn-ocampo-5684b8182/)  

> Proyecto creado por necesidad, mantenido por pasión y compartido para ayudar 💡  

---




##

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
