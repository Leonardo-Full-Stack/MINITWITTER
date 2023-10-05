const express = require('express')
const cookieParser = require('cookie-parser');
const { consulta } = require('./dbConnect');


/**
 * Función para verificar si el usuario está autenticado basado en la existencia de una cookie de sesión.
 *
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {boolean} - Devuelve 'true' si el usuario está autenticado (tiene una cookie de sesión), 'false' en caso contrario.
 */
const ifLogged = async (req) => {

    const token = req.cookies['xtoken']
    const body = {
        token
    }
    if (!token) {
        return false
    }

    try {
        const request = await consulta('aut/verifyToken', 'post', body)
        const jsonReq = await request.json()
        console.log(jsonReq.ok, 'jeisonrek')
        if (jsonReq.ok) {
            const { name, isAdmin } = jsonReq
            let result = {
                ok: true,
                name,
                isAdmin
            }
            return result
        }

    } catch (error) {
        return false
    }

}

module.exports = {
    ifLogged
}