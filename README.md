# Agip

# AGIP - ANGULAR
https://deduccionesagip.web.app/

Esta aplicacion web desarrollada con Angular, fue creada con el objetivo de facilitar una tarea mensual en el proceso de creacion de las declaraciones de Ingresos Brutos de Empresas que registran retenciones y/o percepciones en la ciudad de Buenos Aires.

Para registrar las retenciones y/o percepciones que se informan en la pagina de AGIP (*Administración Gubernamental de Ingresos Públicos*) en la declaracion de IIBB de AFIP (*Administración Federal de Ingresos Públicos*), se debia realizar una refactorizacion y transcripcion de los datos a mano, que resultaba muy tediosa y muy suceptible al error humano.

Es **con el objetivo de facilitar esta tarea**, que cree este pequeño programa que realiza esta accion de manera automatica, facilitando el proceso y eliminando las posibilidades de errores.

El funcionamiento consiste en insertar las retenciones/percepciones (solamente copiandolas de la pagina de AGIP, sin ninguna modificacion necesaria) en su casilla correspondiente, y al momento de presionar el boton con la leyenda *'En formato',* las deducciones se mostraran con el formato solicitado por AFIP para poder registrarlas, sin necesidad de algun cambio posterior. Seleccionando el boton 'Descargar archivo .txt', se obtendra un archivo en el formato indicado listo para ser subido en la pagina de AFIP, para la declaracion de IIBB. La aplicacion tambien informa la suma total de los montos retenidos/percibidos para una mas facil lectura de los datos.

El programa fue creado en una primera instancia con **Python**, pero para facilitar el uso publico del mismo, se translado a **Typescript** para poder ser incluido en la aplicacion web desarrollada con **Angular**, y publicado utilizando **Firebase**.

*--Actualizacion mediados de 2023--*
La aplicacion fue creada a fines de 2021, y trasladada a Angular a principios de 2022.  A mediados de 2023, la pagina de AGIP actualizo su aplicacion web e incluyo esta misma feature a su apartado de retenciones / percepciones, pero desarrollado por su equipo, **este programa que realiza esta accion en la pagina oficial de AGIP, tiene el mismo objetivo que mi aplicacion mencionada pero no fue creada por mi, sino por el equipo de desarrolladores de AGIP**, *Solo que se me ocurrio a mi primero jaja ;)*. 

Actualmente ya no la utilizo para la refactorizacion, pero si la utilizo mensualmente para obtener el total de los montos percibidos/retenidos, ya que la pagina de AGIP aún no provee esta informacion.

*Saludos Cordiales .-
Agus Ocampo :)*




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
