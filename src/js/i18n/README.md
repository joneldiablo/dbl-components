# Proyecto eknoI18N
Proyecto de Internacionalización y regionalización para Ekno, la plataforma debe poder cambiar de idioma según sea la preferencia del usuario.

## Consideraciones
 * Tradución. Todos los textos, imagenes, iconos y _archivos de medios_ en general que necesiten cambiar según el idioma deben estar controlados para dicha tarea.
 * Regionalización. Considerar, por ejemplo, formatos de moneda, supongamos que tenemos un costo con el siguiente formato _$ 1,000.00_ pudiera entenderse que son pesos mexicanos, sin embargo si el idioma está configurado en Inglés, y el usuario se encuentra en EU pudiera pensar que son dolares, entonces se debería indicar _$ 1,000.00 MXN_ por tal motivo se debe incluir la región para las traducciones, ES_MX, EN_EU, etc.
 * Integración. Modificar todos los archivos en la plataforma cambiando textos por índices o variables pudiera ser complicado y hacer que el código sea más difícil de entender y más complicado de modificar o de encontrar errores.

## Propuesta
 * Una sección de administración del idioma donde se vean todos los textos que se están utilizando. Ya sea, dentro del propio Ekno o como una plataforma aparte para su administración. De forma que los textos se puedan modificar sin necesidad de hacer un deploy u actualización del sistema en producción.
 * El idioma se inicializará con la primer importación del paquete, se utilizarán el lenguaje configurado en el navegador y el idioma default será en español dado que el sistema actual está de esta forma.
 * Los textos se descargaran del servidor por página, persistiendo en el frontend.
 * Si existe algún texto del cual no se tenga traducción se enviará al servidor para ser agregado a la base de datos. Automatizando de esta forma el registro de nuevos textos. El servicio enviará texto y ruta dónde se está solicitando.
 * Estructura en base de datos:
   | id |    item   |   path    | translate | context | lang | region |
   |----|-----------|-----------|-----------|---------|------|--------|
   | 1  | Descargar |  paths    |           |         |      |        |
   | 2  | Descargar |           | Download  |         |  en  |        |
   | 3  | Descargar |           | Get Files |  files  |  en  |        |
   | 4  |  limpiar  |           |   trash   |  delete |  en  |   us   |
   | 5  |  limpiar  |           |   empty   |  delete |  en  |   uk   |
   | 5  |./img/x.png|           |./img/y.png|         |  en  |        |
 * El paquete incluirá un componente selector de idioma, que lanzará un evento personalizado en el body del documento 

    ```js
    let body = document.querySelector('body');
    let event = new CustomEvent('translate', {  
      detail: langSelected
    });
    body.dispatchEvent(event);
    ```
    El lanzamiento del evento solo implicaría indicar al sistema que vuelva a renderear, podría usarse, alguna otra mecánica, como _meteor_ o _context_, lo que se prefiera. Yo sugiero esta mecánica para mantener un stack básico, usando los eventos de javascript ([pricipio KISS](https://es.wikipedia.org/wiki/Principio_KISS)).
    Como estrategia final, en caso de no resultar, se hará refresh del navegador conservando el dato del lenguaje seleccionado.
 * Todo texto debe ser porcesado por una función `t()` que se importará del paquete eknoI18N como un proyecto independiente
   ```js
     export const t = (text: string, context?: string)=>{
       ...
       return <span>textTranslate</span>
     }
   ```
    Esta función devolverá un objeto React con el texto traducido al idioma seleccionado, o el mismo texto si no hay coincidencia.
    ```js
    ()=><div>{t('Limpiar')}</div>
    ```
    Edemás, la variable de contexto nos permitirá seleccionar una traducción diferente si ya existe un texto que no ajuste de forma adecuada. Si en el contexto no existe elemento se devolverá la traducción general.
 * Todo número pasará por la función `n()`, no hay segundo parametro, nos permitirá cambiar por ejemplo: 1,000.00 a 1.000,00
   ```js
     export const n = (number: number)=>{
       ...
     }
   ```
 * Todo número que implique valor económico pasa por `cur()` el segundo parametro será el formato de moneda de origen, si son pesos mexicános, se coloca el código 'MXN', revisar códigos de moneda
   ```js
     export const cur = (number: number, from:string)=>{
       ...
     }
   ```
 * Todo recurso que se considere pudiera cambiar según el idioma se procesará con `src()` una función que actuará de igual forma que `t()`
   ```js
     export const src = (_src: URL, context?: string)=>{
       ...
     }
   ```
 * Implementación de locale de material ui `@material-ui/core/locale` parametro que se pasa a la función `createMuiTheme(...,lang)` que permite traducir algunos de sus componente, como paginación, o selector de fechas
 * Empaquetado para instalar con npm `npm i -S git+ssh://repositorio/repo.git`
 * Uso de Intl del estandar ES6 contiene una serie de funciones diseñadas para la internacionalización:
   * Intl.Collator
   * Intl.DateTimeFormat
   * Intl.NumberFormat
   * Intl.PluralRules

## Tiempos
 * Package ____________________________  5
 * Funciones de recolección de textos _ 35
 * Componentes de selección de idioma _ 10
 * Persistencia de idioma _____________ 10
 * Implementación _____________________ 30
 -----------------------------------------
 * Sincronización y auth ______________ 20
 * Tabla de administración de textos __ 30
   * selector de idioma
   * selector de región
   * mostrar ruta donde se usa
 * Api && backend express (?) _________ 30
   * access token
   * CRUD
   * servicio para registrar un texto
   * servicio para obtener todos los textos de una pantalla
   * servicio obtener idioma, región y bandera