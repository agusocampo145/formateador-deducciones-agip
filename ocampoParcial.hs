--Ocampo Agustin
--Legajo : 172.385-6

--1er Parcial Paradigmas de Programacion


--Punto 1
-- Modelar y crear al menos un plato y sus ingredientes. Definir poderCalorico,
--el cual se calcula como la sumatoria de las calorías de sus ingredientes.


data Ingrediente = Ingrediente {
     calorias :: Int,
     precio :: Num a
  } deriving (Show,Eq)

data Plato = Plato {
    nombre :: String,
    ingredientes :: [Ingrediente],
    totalCalorias :: Int,
    totalPrecio :: Int,
  } deriving (Show,Eq)

  papa = Ingrediente 260 50
  harina = Ingrediente 345 84
  huevo = Ingrediente 162 2
  sal = Ingrediente 0 0.2

--Uso de Record Syntax en la creacion de ambos tipo de Datos "Plato" e "Ingrediente"

poderCalorico :: Plato -> Int
poderCalorico plato = foldl (+) 0 ((map (calorias ingrediente) ingredientes) plato)

data Persona = Persona {
     nombre :: String,
     direccion :: ("String",Int),
     platos :: [Plato],
     pago :: "String",
     envio :: "String"
  } deriving (Show, Eq)
