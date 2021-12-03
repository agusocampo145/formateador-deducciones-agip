import { jsDocComment } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit} from '@angular/core';
import { of } from 'rxjs';


@Component({
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.css']
})
export class RetencionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  limpiar(){
    var display = document.getElementById("retencionesDisplay");
    var totalDisplay = document.getElementById("totalRet");
    if(display?.hasChildNodes()){
      while(display?.hasChildNodes()){
    
        display?.removeChild(display?.lastChild as any);
        /*-- 
        TypeScript: "Eu no me podes pasar esto como parametro, podria ser null, no lo acepto >:("
        Yo : "as any >.<"
        ----*/
      }
    }
    if(totalDisplay?.hasChildNodes()){
      while(totalDisplay?.hasChildNodes){
    
        totalDisplay?.removeChild(totalDisplay?.lastChild as any);

      }
    }

  }

  /*------------------------------------ Retencion Submit ------------------------*/

  retencionSubmit(retencion:string,esPrimera:boolean,totalRetenciones:number){


    /* Verificar si es la primera, que no sea vacia ----*/
    if(esPrimera == true && retencion == ""){
      alert("La retencion no puede ser vacia");
    }

    else{

    if(retencion==""){

      alert("¡Retenciones Procesadas Correctamente!")
      var div = document.getElementById("totalRet");
      var totalTitulo = document.createElement("p");
      var total = document.createElement("p");
      totalTitulo.textContent="Total retenido : "
      total.textContent = totalRetenciones as any;
      total.setAttribute("style","border:1px solid black; border-radius:2px")
      div?.appendChild(totalTitulo);
      div?.appendChild(total);

    }
    else{

    /*---- Transformar retencion a array de chars ----*/
     let ret = retencion.split('');
    /*---------- Variables a usar -------------*/
    let cuit= ""
    let nagente= ""
    let certificado= ""
    let fecha= ""
    let tfact= ""
    var comprobante= ""
    let importe= ""
    let retfinal= ""
    let ceros = ""
    var contador = 16;
    let cantCeros = 0;
    var esFactura = false;

    /*---------- Variables a usar -------------*/

      /*---Creacion CUIT----*/
      cuit = ret[0]+ret[1]+"-"+ret[2]+ret[3]+ret[4]+ret[5]+ret[6]+ret[7]+ret[8]+ret[9]+"-"+ret[10]
 
      /*---Creacion Nº de agente-----*/

      nagente= ret[12]+ret[13]+ret[14]+ret[15]

      /*-----Acomodar el indice(contador) en posicion para crear el Numero de Certificado----*/
      if(ret[contador] != " "){
        contador++
      }
      else{
        contador+=1;
      }

      contador+=1;

      while(ret[contador] == " " || isNaN(ret[contador] as any) ){
        contador+=1;
      }

      /*----Numero de cerificado-----*/
      for(let x = 0; x < 16; x++){
        certificado += ret[contador+1];
        contador++;
      }

      contador +=5;
      /*----Creacion Fecha----*/
      for(let x=0; x<10; x++){
          fecha+=ret[contador];
          contador++;
      }

      contador+=1;

      /*----Creacion de Tipo de Factura----*/
      if (ret[contador]=="F"){
        tfact = ret[contador] + "A";
        contador+3;
        esFactura = true;
      }
      else{
        tfact = "OA";
        contador++;
      }
      /*---- Creacion Nº de Comprobante ----*/
      if(esFactura == true){
        contador+=4
      }
      
      console.log(ret[contador]);

      if(ret[contador +4]=="\t"){
        comprobante = "0" + ret[contador + 1] + ret[contador + 2] + ret[contador + 3];
      }
      else{
      for(let x = 0; x < 4; x++){
        comprobante += ret[contador+1];
        contador++;
        }
      }

      while(!isNaN(ret[contador] as any)){
        contador++;
      }

      contador+=9;

      /*--- Creacion de importe ----*/
      while(!isNaN(ret[contador] as any)){
        importe += ret[contador];
        contador++;
      }

      importe+= "." + ret[contador+1] + ret[contador+2];

      contador+=3;

      totalRetenciones = totalRetenciones + parseFloat(importe);

      /*------Ceros para rellenar los 79 caracteres ----*/
      cantCeros = 22 - importe.length;
      for(let x = 0; x < cantCeros ; x++){
        ceros += "0";
      }

      /*---- Acomodar contador al final de la retencion ----*/

      while(ret[contador]!="."){
        contador++;
      }
      contador+=4;
      

      retfinal = "901"+cuit+fecha+nagente+certificado+tfact+"00000"+comprobante+ceros+importe;

      
      /* --- Sacar retencion leida del array de reteneciones */
      for(let x = 0; x < (contador); x++){

        var removed = ret.shift();

      }

      esPrimera = false;

      /*-- Recursividad--*/
      this.retencionSubmit(ret.join(''),esPrimera,totalRetenciones);

      /*----- Agregar retencion a la pagina ---*/
      var display = document.getElementById("retencionesDisplay");
      var retDisplay = document.createElement("p");
      retDisplay.textContent = retfinal;
      retDisplay.setAttribute("style","margin:1px;");
      display?.appendChild(retDisplay);
      }
    } 
  }
   /*------------------------------------ Retencion Submit ------------------------*/




   /*------------------------------------- Descarga de archivo .txt ------------------*/
   private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    }
  }

  userData() {
    var display = document.getElementById("retencionesDisplay");
    var children = display?.childNodes as any;
    var text ="";
    children.forEach(function(item: any){
    var ret = item.textContent;
    if(text==""){
      text = ret;
      }
    else{
      text = text + "\n" + ret;
      }
    });
    return of (text)
  }

  dynamicDownloadTxt() {


    this.userData().subscribe((res: any) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'retenciones',
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

     /*------------------------------------- Descarga de archivo .txt ------------------*/

}
