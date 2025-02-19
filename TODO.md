# Reconstrucción total

* quitar react!!!!
* las clases(css) deberán poder ser un arreglo o una string, en el Component deberá cargarse como un Set
* las clases(css) igual pudieran ser un objeto para poder definir clases de diferentes sub nodos no accesibles
* permitir el control de eventos aqui, definir events que sea un objeto asi: `{click:'varName'}` Component deberá hacer eventHandler.dispatch en el evento y mandar la información solicitada tomandola del state
* podrá existir un state como en react que se estará traqueando sus cambios
* controlar las mutaciones del Component con la función mutation como se viene haciendo, suprimir setState y usar el proxy de ecma6
* usar navigo para las rutas
* crear una clase que herede de componente y que sea una ruta
* si un componente indica un path, solo se muestra cuando se cumpla ese path
* básicamente en Component se debe poder colapsar todos los atributos de los subNodos,
* la vista debe ser un atributo que tambien se pueda pasar al componente, el valor default de su vista es su propia vista `$c:{view:{....}}`
* se mantiene en memoria el objeto nodo, sea activo o no, pero se vacía al cambiar de ruta y este no deba estar ahí
* las animaciones deben estar en un animations:`{nodeName:{from:{},to:{}}}` ajustar con gsap
* NO SE puede setear style, el style quedará reservado para animaciones únicamente, todos los estilos se deberán pasar por medio de css
* integrar konva!!!
* ajustar estructura del json de un componFente:

  ```js
  {
    "$component":{},//object, all data to define any component, esto genera atributos en un componente a menos que sean sobre escritos en $
    "$parent":{},//object, información que debe pasarse al componente padre, por ejemplo colClass, datos para sobre escribir propiedades generales para los hijos, wrappers, etc.
    "$":{},//object, all attributes directly set to the element
    //cualquier otra cosa es un nodo hijo, del componente, pero un componente podrá definir algunos llaves y usarlas en alguna posicion especifica, la clase Component deberá construir sus propios hijos de forma que los componentes que hereden de Component puedan seleccionar dónde poner cada elemento
    //todo elemento debe tener una estracción de texto plano, plano.
    //considerar la funcion t en todo componente, para poder implementar traducción
    content:{},//object|string<html>|array
    label:{},//object|string<html>|array
    message:{},//object|string<html>|array
    error:{},//object|string<html>|array
    done:{},
    info:{}
    .....
    //cualquier otra cantidad de elementos
  }
  ```

* tiempos:
  * build, se recorre los json en busca de `"$definitions/...."`: referencias para resolverlas y crear el json estático inicial
  * --------
  * mount, cuando se ha montado un componente en pantalla, entonces se ejecutael onMounted
  * update var, cuando se actualize una variable especifica, la llamada de actualización se construirá asi: `onUpdate[State|Prop]<VarName>` se buscará este método en la clase(Class) si existe se ejecuta se le pasa el valor anterior y se podrá acceder al nuevo valor por `this.state[...]` o `this.props[...]`
  * render, el update de alguna variable provoca un nuevo rendereo, buscar la asociacion de la variable actualizada para solo actualizar los subnodos necesarios o.O
  * mutation, se ejecuta en el render para actualizar lo que sea necesario
  * unmount, cuando un componente se va eliminar de la pantalla
  * destroy, al cambiar de ruta
* crear un array de nodos para mantener la relación de objetos que se han creado, el Component padre crea un arreglo de un solo elemento:
  `[{nameElement:document.createElement('div')}]`
* todos los nombres de los elementos se construyen. se les agrega el sufijo con el name dado y agregan una clase(css) unido a su component ej. `nameComponent-ClassComponent`
* el nombre de la clase(class) del Component crea una clase(css)
* tagName: lo que tengo como tag., cambiarlo por tagName
* component controla los nodos de su view pero no controla su content para que sea controlado por sus propios controllers
