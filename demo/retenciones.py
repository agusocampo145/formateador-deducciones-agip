class retencion():
    def __init__(self):
        self.cuit=""
        self.nagente=""
        self.certificado=""
        self.fecha=""
        self.tfact=""
        self.comprobante=""
        self.importe=""
        self.retfinal=""

    def ordenar_retencion(self,ret):
        contador = 16
        muestra = "a"
        puntuacion = "."
        importe = ""
        contador2 = 0
        certificado=""
        fecha=""
        comprobante=""
        importe=""



    #RETENCION
        ret=[str(i) for i in str(ret)]
    #Creacion del CUIT
        cuit = ret[0]+ret[1]+"-"+ret[2]+ret[3]+ret[4]+ret[5]+ret[6]+ret[7]+ret[8]+ret[9]+"-"+ret[10]
    #Creacion del Numero de Agente
        nagente= ret[12]+ret[13]+ret[14]+ret[15]

    #Acomodar el indice(contador) en posicion para crear el Numero de Certificado
        while muestra.isdigit()==False:
            muestra = ret[contador]
            contador+=1
        contador+=-1
    #Creacion Numero de Certificado
        for x in range(0,16):
            certificado += ret[contador]
            contador+=1
        contador+=4

    #Creacion de Fecha
        for y in range(0,10):
            fecha += ret[contador]
            contador+=1

        contador+=1

    #Creacion de Tipo de Factura
        tfact= ret[contador]+"A"

        contador+=2

        for z in range(0,4):
            comprobante += ret[contador]
            contador+=1

        contador+=1

        if ret[contador].isdigit()==True:
            contador+=11
        else: contador+=9

    #Creacion de Importe
        while ret[contador].isspace()==False:
            importe+= ret[contador]
            contador+=1

    #Ceros a agregar para rellenar los 79 caracteres
        ceros=22-len(importe)
        cantceros=""

        while contador2 < ceros:
            cantceros+="0"
            contador2+=1

        retencionfinal="901"+cuit+fecha+nagente+certificado+tfact+"00000"+comprobante+cantceros+importe

        self.cuit=cuit
        self.nagente=nagente
        self.certificado=certificado
        self.fecha=fecha
        self.tfact=tfact
        self.comprobante=comprobante
        self.importe=importe
        self.retfinal=retencionfinal
        return self

ret = retencion()
rx = input("Insertar Retencion: ")
ret = ret.ordenar_retencion(rx)
print(ret.cuit)
print(ret.nagente)
print(ret.certificado)
print(ret.fecha)
print(ret.tfact)
print(ret.comprobante)
print(ret.importe)
print(ret.retfinal)
