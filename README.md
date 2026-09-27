¿qué pasaría si el módulo no quedara registrado en la raíz?
nest no sabria que el modulo existe, porque todo lo arma empezando por el AppModule. si el InscripcionesModule no esta en los imports, su controlador nunca se carga y las rutas de /inscripciones no existen. cualquier peticion te regresaria un 404 aunque el codigo este bien. lo peor es que el servidor arranca normal sin marcar ningun error, entonces es facil que no te des cuenta

¿por qué los métodos del repositorio devuelven promesas si los datos van a estar en memoria?
porque se hizo pensando en lo que viene despues. ahorita los datos estan en un arreglo y todo sale al instante, pero despues se van a guardar en una base de datos y eso si tarda. si desde ahorita todo regresa una promesa, cuando cambiemos a la base de datos el servicio no se tiene que tocar porque ya usa await en todos lados

¿qué error apareció al cambiar a la interfaz, y por qué la clase sí se había resuelto sola?
salio el error de que nest no podia resolver las dependencias del InscripcionesService ("Nest can't resolve dependencies of the InscripcionesService (?)"). pasa porque las interfaces solo existen en typescript y cuando el codigo se convierte a javascript desaparecen, entonces nest ya no sabe que tiene que darle al servicio. con la clase no pasaba porque la clase si sigue existiendo cuando corre el servidor, nest la usa para buscarla y como estaba en los providers la encontraba sola


¿por qué el servicio necesita un token para el repositorio, pero el controlador no lo necesita para el servicio?
porque el servicio pide una interfaz y el controlador pide una clase. las interfaces desaparecen cuando el codigo se convierte a javascript, entonces nest no sabe que darle al servicio. el token es como ponerle un nombre para que nest lo encuentre, y en el modulo le decimos que ese nombre es el repositorio en memoria. el controlador no tiene ese problema porque el servicio es una clase y esa si sigue existiendo cuando corre el servidor

¿cuál es la diferencia entre un 400 y un 409?
el 400 es cuando la peticion esta mal hecha, por ejemplo mandar "hola" en vez de un numero, y va a fallar siempre. el 409 es cuando la peticion esta bien pero choca con lo que ya hay, como cuando el cupo esta lleno o el miembro ya estaba inscrito, y si eso cambia la misma peticion si puede pasar   


¿por qué cambió el código de estado de esa última petición?
porque lo que cambio fue el servidor, no la peticion. la primera vez que mandamos el horario 1 con el miembro 3 dio 409 porque el horario ya tenia sus 2 lugares ocupados. luego cancelamos la inscripcion 1 con el DELETE, esa queda como "cancelada" y ya no cuenta, entonces se libera un lugar. al mandar la misma peticion otra vez ya habia espacio y por eso dio 201

