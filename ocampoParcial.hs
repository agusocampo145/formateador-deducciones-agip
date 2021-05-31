--Ocampo Agustin
--Legajo : 172.385-6

--1er Parcial Paradigmas de Programacion


--Punto 1
-- Modelar y crear al menos un plato y sus ingredientes. Definir poderCalorico,
--el cual se calcula como la sumatoria de las calorías de sus ingredientes.


data Ingrediente = Ingrediente {
     calorias :: Int, --Expresividad
     precio :: Float --Expresividad
  } deriving (Show,Eq) --Record Syntax

data Plato = Plato {
    nombre :: String,
    ingredientes :: [Ingrediente],
    totalPrecio :: Float,
  } deriving (Show,Eq)

papa = Ingrediente 260 50
harina = Ingrediente 345 84
huevo = Ingrediente 162 2
sal = Ingrediente 0 0.2
pimienta = Ingrediente 0 0.25
carne = Ingrediente 181 180
tomate = Ingrediente 22 80
condimentos = Ingrediente 30 10

noquisDePapaConSalsaBoloniesa = Plato "Noquis de papa con salsa boloñesa" [papa,harina,huevo,sal,pimienta,carne,tomate,condimentos] 540 --Expresividad

--Uso de Record Syntax en la creacion de ambos tipo de Datos "Plato" e "Ingrediente"
--La Expresividad podemos encontrarla cuando nombramos las variables, los nuevos tipos de datos y sus componentes en relacion a lo que verdaderamanete
-- almacenan.
--
poderCalorico :: Plato -> Int
poderCalorico plato = foldl (+) 0 ((map (calorias ingrediente) ingredientes) plato)

--Punto 2
-- Modelar y Crear el pedido de una persona

data Pedido = Pedido {
     nombre :: String,
     direccion :: ("String",Int),
     platos :: [Plato],
     pago :: Efectivo | Tarjeta,
     envio :: TakeAway | Delivery
  } deriving (Show, Eq)

ezequiel = Pedido "Ezequiel" ("Boulevard Buenos Aires",4550) [noquisDePapaConSalsaBoloniesa,milanesaDeSojaConEnsalada] Efectivo TakeAway

--Punto 3
--Escribir las consultas necesarias por cada punto.
?????


--Punto 4
-- Indicar en dónde se utiliza point free, delegación, expresividad, recursividad,
composición, orden superior, guardas, tuplas.

--Punto 6
-- Calcular el precio de un pedido determinado, precioPedido. Si se sabe que los que van
a buscarlo (1) tienen un 10% de descuento y el envío (2) cuesta $70

precioPlatos :: [Platos] -> Float
precioPlatos listaDePlatos = foldl (+) 0 (map (precio plato) listaDePlatos)

precioPedido :: Pedido -> Float
precioPedido pedido  --Uso de guardas
  | (==TakeAway).envio pedido = (precioPlatos.platos pedido) - ((*0,1)(precioPlatos.platos pedido)) -- Aplicacion Parcial y Point Free en la condicion a evaluar, y Delegacion con Orden Superior cuando creamos la funcion "precioPlatos", en este caso para lograr una mayor expresividad
  | otherwise = (+70)(precioPlatos.platos pedido) -- Aplicacion parcial con la suma, donde predefinimos que un parametro sea 70, y reciba el otro.

--Punto 7
--Saber que tan interesante es un plato, platoInteresante, el interés de un plato se calcula
multiplicando la cantidad de ingredientes por su precio (según el precio de sus
ingredientes ).

platoInteresante :: Num a => Plato -> a
platoInteresante plato = (length.ingredientes plato) * (precio plato)

esIngredienteSaludable :: Ingrediente -> Bool
esIngredienteSaludable = elem "s" || elem "S" -- Aplicacion parcial y Point free, cancelando a los dos lados el parametro que recibe, "ingrediente" en este caso

esPlatoSaludable :: Plato -> Bool
esPlatoSaludable plato = (/=) (map esIngredienteSaludable ingredientes plato))
