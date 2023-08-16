const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


/**
 * Middleware para validar un token JWT en una cookie de sesión.
 *
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {function} next - Función de siguiente middleware.
 * @returns {void}
 */
const validarJwt = (req, res, next) => {
    
       
    const xToken = req.cookies['xtoken'];
        

        if (!xToken) {
            res.render('error', {
                title:'Falta iniciar sesión',
                msg:'Tienes que iniciar sesión'
            })
        }

        try {

            const payload = jwt.verify(xToken, process.env.JWT_SECRET_KEY);
            req.userId = payload.uid;
            req.userName = payload.name;

        } catch (error) {
            return res.render('error', {
                title: 'No has iniciado sesión',
                msg: 'Inicia sesión para continuar'
            })
        }

        next()


}


/**
 * Middleware para validar un token JWT de administrador en una cookie de sesión.
 *
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {function} next - Función de siguiente middleware.
 * @returns {void}
 */
const validarJwtAdmin = (req, res, next) => {
   
       
    const zToken = req.cookies['ztoken'];
     
        

        if (!zToken) {
            return res.render('error', {
                title: 'No tienes permisos',
                msg: 'Inicia sesión como administrador para continuar'
            })
        }

        try {

            const payload = jwt.verify(zToken, process.env.JWT_SECRET_KEY2);
            
            req.header.id = payload.uid
            req.header.name = payload.name
            
            

        } catch (error) {
            
            return res.render('error', {
                title: 'No has iniciado sesión',
                msg: 'Inicia sesión para continuar'
            })
        }
        
        next()


}



module.exports = {
    validarJwt,
    validarJwtAdmin
}