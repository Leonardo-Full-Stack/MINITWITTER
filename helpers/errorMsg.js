/**
 * Función para obtener un objeto con los nombres de los campos con errores y los mensajes de error correspondientes.
 *
 * @function
 * @param {Object} errores - Objeto que contiene los errores de validación.
 * @returns {Object} - Objeto con dos propiedades: 'input' que contiene un array con los nombres de los campos con errores,
 * y 'msg' que contiene un array con los mensajes de error correspondientes.
 */
const errorMsgs = (errores) => {
     let input = [];
     let msg = [];
    
    for (let key in errores) {
        
        input.push(key)
        msg.push(errores[key].msg)
        
     }

     return {
        input,
        msg
     }
}

module.exports = {
    errorMsgs
}