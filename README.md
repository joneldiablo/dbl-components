# DBL Components

My own components https://joneldiablo.github.io/dbl-components/

## Changes

- Prevent full remount of parent routes when navigating to child routes in React Router Schema.

finalidad: framework de componenentes react con bootstrap 5, todos los componentes han de funcionar exactamente igual para poder ser procesados por un componente específico llamado View, este componente tiene la propiedad de recorrer un objeto JSON de forma recursiva encontrando todos los componentes anidados, tomando como referencia el atributo name, con el cual sabrá que ese objeto es un componente. La estructura mínima JSON es entonces: `{"name":""}` la cual tomará el componente default para mostrar su contenido.
Estructura JSON básica.

```json
{
  "component":"string",
  "name":"string*",
    "content":"string|JSON Object|React Component"
  }
  ```

  * component: es el nombre del componente que se quiere utilizar
  * name:


## TODO

* Order container breakpoints and align with Sass `$container-max-widths`.
* Crear componente panel, que tenga swipe events, que haga el switch de ocultar textos y sólo mostrar íconos a mostrar u ocultar completamente el panel en mobile, además en mobile se muestra por encima de todo, agregar animaciones y dirección.
  * Modificar componente menú para que los elementos funcionen igual que el resto de componentes el toggle se le debe pasar el nombre del evento que ejecuta el toggle text para colapsar el texto dejando únicamente el ícono
* Crear nuevo componente tabla a la cual se le pasen las columnas como contenido
  * Que la nueva tabla controle las columnas visibles pasandole un arreglo de nombres
* permitir pasar componente react en "component"
* hacer que ReactRouterSchecma funcione igual que view!!!! pufffff que se pueda usar uno u otro o fucionarlos!!!!
* permitir indicar un arreglo de ubicaciones dónde colocar las rutas hijas, actualmente funciona con `{"routesIn":"string"}` modificarlo de tal forma que se pueda indicar nombe del componente que habrá de mostrar cada sección, por ejemplo, `{"routesIn":componentNames[]}` || `{"routesIn":{"componentWhereToPut1":"routeNameWhichMove"}}`
* Separar el algoritmo recursivo de view y meterlo en functions para poder usarlo en cualquier cosa. La primisa sería ciclar todo su contenido para saber qué hay de forma lineal. se podría hacer que resolverefs dependa de este.
* separar functions en una librería aparte para poder usarla, por ejemplo, en proyectos backend.
* Add dropdown and collapsible submenu support to Navigation.



=============

vectores de reconstrucción:
 - control de contenido de forma recursiva
 - control de estado lineal
 - control de eventos
 - estado global
 - composiciones
 - modulos
 - autoresponsive
 - no usar react O.o
 - control de rutas
 - control de elementos: 
   [páginas/rutas, componentes, menus, webservices/sockets, eventos]