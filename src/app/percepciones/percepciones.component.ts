import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-percepciones',
  templateUrl: './percepciones.component.html',
  styleUrls: ['./percepciones.component.css']
})
export class PercepcionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  limpiar(){
    var display = document.getElementById("percepcionesDisplay");
    var totalDisplay = document.getElementById("totalPer");
    if(display?.hasChildNodes()){
      while(display?.hasChildNodes()){
        let hijo = display?.lastChild;
        display?.removeChild(hijo as any);
      }
    }
    if(totalDisplay?.hasChildNodes()){
      while(totalDisplay?.hasChildNodes){
    
        totalDisplay?.removeChild(totalDisplay?.lastChild as any);

      }
    }
  }

/*----------------------------------PercepcionesSubmit------------------------------------------------- */

  percepcionSubmit(percepcion:string,esPrimera:boolean,totalPercepciones:number){

    if(percepcion == "" && esPrimera == true){
      alert("La percepcion no puede ser vacia");
    }
    else{
      if(percepcion == ""){
      alert("¡Percepciones procesadas correctamente!");
      var div = document.getElementById("totalPer");
      var totalTitulo = document.createElement("p");
      var total = document.createElement("p");
      totalTitulo.textContent="Total Percibido : "
      total.textContent = totalPercepciones as any;
      total.setAttribute("style","border:1px solid black; border-radius:2px")
      total.setAttribute("id","totalNumero")
      div?.appendChild(totalTitulo);
      div?.appendChild(total);
      }
      else {

        let per = percepcion.split('');
        var cuit=""
        var nagente=""
        var fecha=""
        var tfact=""
        var comprobante=""
        var importe=""
        var perfinal=""
        var contador = 17
        var certificado =""
        var cantCeros = 0
        var ceros = ""
        /*------- Creacion del CUIT ----*/
        cuit = per[0]+per[1]+"-"+per[2]+per[3]+per[4]+per[5]+per[6]+per[7]+per[8]+per[9]+"-"+per[10];

        /*--------Creacion Nº de agente -------*/

        nagente= per[12]+per[13]+per[14]+per[15]

        contador++;

        while(per[contador] != "\t"){
          contador++;
        }
        contador++;

        /*---- Creacion Nº certificado----*/

        for(let x = 0; x < 15; x++){
          certificado += per[contador];
          contador++;
        }
      
        contador+=5;

        /*-------Creacion de la fecha ----*/

        for(let x = 0; x < 10; x++){
          fecha+=per[contador];
          contador++;
        }

        contador++;

        /*------ Creacion del Tipo de Factura----*/

        if(per[contador]!= "F"){
          tfact = "OA";
          contador+=2;
        }
        else{
          tfact ="FA";
          contador+=5;
        }


        /*------- Creacion del Nº de comprobante -----*/

        for(let x = 0; x < 8; x++){
          comprobante += per[contador];
          contador++;
        }


        while(!isNaN(per[contador] as any)){
          contador++;
        }

        contador+=11;

        /*----- Creacion del importe ----*/
        while(per[contador]!="\t"){
          importe += per[contador];
          contador++;
        }
        totalPercepciones = totalPercepciones + parseFloat(importe);

        /*------- Ceros faltantes ------*/
        
        while (cantCeros < (11 - importe.length)){
          ceros += "0";
          cantCeros++;
        }

        while(per[contador]!="."){
          contador++;
        }
        contador+=4;

        perfinal="901"+cuit+fecha+nagente+comprobante+tfact+ceros+importe;


        for(let x = 0; x < (contador); x++){

          var removed = per.shift();
  
        }
  
        esPrimera = false;
  
        this.percepcionSubmit(per.join(''),esPrimera,totalPercepciones);
          /*----- Agregar percepcion a la pagina ---*/
          var display = document.getElementById("percepcionesDisplay");
          var perDisplay = document.createElement("p");
          perDisplay.setAttribute("style","margin:1px;");
          perDisplay.textContent = perfinal;
          display?.appendChild(perDisplay);

      }
    }
  }

/*----------------------------------PercepcionesSubmit------------------------------------------------- */

/*----------------------------------- Creacion y Descarga de archivo .txt ------------------------------*/
  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    }
  }

  userData() {
    var display = document.getElementById("percepcionesDisplay");
    var children = display?.childNodes as any;
    var text ="";
    children.forEach(function(item: any){
    var per = item.textContent;
    if(text==""){
      text = per;
      }
    else{
      text = text + "\n" + per;
      }
    });
    return of (text)
  }

  dynamicDownloadTxt() {


    this.userData().subscribe((res: any) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'percepciones',
        text: res
      });
    });

  }
  
  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  } 

/*----------------------------------- Creacion y Descarga de archivo .txt ------------------------------*/
}
