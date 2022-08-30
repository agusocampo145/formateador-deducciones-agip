class percepcion():
    def __init__(self):
        self.cuit=""
        self.nagente=""
        self.fecha=""
        self.tfact=""
        self.comprobante=""
        self.importe=""
        self.perfinal=""

    def ordenar_percepcion(self,perdesordenada):
        contador = 16
        muestra = "a"
        puntuacion = "."
        importe = ""
        muestra2 = "2"
        ceros = ""
        contador2 = 0
        muestra3 = ""
        certificado=""
        fecha=""
        tfact=""
        comprobante=""
        importe=""

        per=[str(i) for i in str(perdesordenada)]

    #Formacion del CUIT
        cuit = per[0]+per[1]+"-"+per[2]+per[3]+per[4]+per[5]+per[6]+per[7]+per[8]+per[9]+"-"+per[10]
    #Uso de sub-string
    #Formacion del Numero de Agente
        nagente= per[12]+per[13]+per[14]+per[15]


    #Uso de Find
    #Re-Posicionamiento del contador
        while per[contador].isspace()==False:
            muestra3+=per[contador]
            contador+=1

        while muestra.isdigit()==False:
            muestra=per[contador]
            contador+=1

    #Creacion Numero de Certificado
        for x in range(0,15):
            certificado+=per[contador]
            contador+=1

        contador+=4

    #Creacion de la fecha
        for y in range(0,10):
            fecha+=per[contador]
            contador+=1
        contador+=1


    #Creacion del Tipo de Factura
        if per[contador] != "F":
            tfact="O"+"A"
            contador+=2
        else:
            tfact="F"+"A"
            contador+=5


    #Crreacion del Numero de comprobante
        for z in range(0,8):
            comprobante+=per[contador]
            contador+=1

    #Reposicionamiento del contador
        while muestra2.isdigit()==True:
            muestra2 = per[contador]
            contador+=1
        contador+=13


        while per[contador].isspace()==False:
            importe+=per[contador]
            contador+=1

    #Ceros para rellenar
        cantceros=11-len(importe)

        while contador2 < cantceros:
            ceros+="0"
            contador2+=1

            percepcionfinal="901"+cuit+fecha+nagente+comprobante+tfact+ceros+importe

        self.cuit=cuit
        self.nagente=nagente
        self.fecha=fecha
        self.tfact=tfact
        self.comprobante=comprobante
        self.importe=importe
        self.perfinal=percepcionfinal
        return self

per = percepcion()
rx = input("Insertar Percepcion: ")
per = per.ordenar_percepcion(rx)
print("CUIT: "+per.cuit)
print("Numero de agente: "+per.nagente)
print("Fecha: "+per.fecha)
print("Tipo de Factura: "+per.tfact)
print("Numero de comprobante: "+per.comprobante)
print("Importe percibido: "+per.importe)
print("Percepcion en formato: "+per.perfinal)
