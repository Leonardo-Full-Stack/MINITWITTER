const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const { consulta } = require('../helpers/dbConnect')
const bcrypt = require('bcryptjs');
const { uploadCloudinary } = require('../helpers/cloudImages');
const { ifLogged } = require('../helpers/isLogged');


app.use(cookieParser())

const getIndex = async (req, res) => {
    console.log('kes esto')
    const { email } = req.cookies
    if (email) {
        res.redirect('/entries?pag=1')
    } else {
        res.render('index', {
            title: 'TwitZerg',
            msg: 'Haz login para comenzar'
        })
    }

}

/**
 * Realiza la validación y autenticación de un usuario al realizar el login.
 * Se añaden tokens en función de su rol y
 * si es administrador, se le redirige a dicha ruta
 *
 * @function
 * @async
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @throws {Error} - Si hay un error de conexión a la base de datos.
 * @throws {Error} - Si la validación del formulario de login falla.

 */

const checkLogin = async (req, res) => {
    const { email, password } = req.body


    if (email == '' || password == '') {
        res.render('error', {
            title: 'Error de validación',
            msg: 'Rellena los campos'
        })
    } else {

        try {
            const peticion = await consulta(`aut/`, 'post', req.body)
            const peticionJson = await peticion.json()


            if (peticionJson.ok) {
                if (peticionJson.tokenz) { //Cuando es admin hay ztoken
                    res.cookie('xtoken', peticionJson.token)
                    res.cookie('ztoken', peticionJson.tokenz)
                    res.redirect('/admin/?pag=1')
                } else {// Y aquí cuando es un usuario normal
                    res.cookie('xtoken', peticionJson.token)
                    res.redirect('/mifeed')
                }
            } else {
                res.render('error', {
                    title: 'Error de validación',
                    msg: 'Usuario o contraseña incorrectos'
                })
            }


        } catch (error) {
            console.log(error, 'error')
            res.render('error', {
                title: 'error de conexión',
                msg: 'Contacta con el administrador'
            })
        }
    }


}

/**
 * Cierra la sesión de un usuario y realiza una redirección a la página de inicio de sesión.
 *
 * @function
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {void}
 */

const logOut = (req, res) => {
    res.clearCookie('xtoken')
    res.clearCookie('ztoken')
    res.redirect('/entries?pag=1')
}

/**
 * Maneja el proceso de registro de un nuevo usuario.
 *
 * @function
 * @async
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */

const signup = async (req, res) => {
    res.render('signup', {
        title: 'Regístrate',
        msg: 'Regístrate en nuestra base de datos'
    })
}

/**
 * Maneja el proceso de registro de un nuevo usuario.
 *
 * @function
 * @async
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */

const uploadSignup = async (req, res) => {
    const { name, surname, email, password } = req.body
    if (!name || !surname || !email || !password) {
        res.render('error', {
            title: 'error de validación',
            msg: 'Rellena bien todos los campos'
        })
    } else if (password.length < 4) {
        res.render('error', {
            title: 'error de validación',
            msg: 'La contraseña debe tener 4 o más caracteres'
        })
        
    } else if (name.length > 8) {
        res.render('error', {
            title: 'error de validación',
            msg: 'El campo nombre no puede tener mas de 8 caracteres'
        })
        
    } else {

        let uploadImage;

        if (req.file) {
             uploadImage = await uploadCloudinary(`https://minitwitter-x2oo.onrender.com/media/uploads/${req.file.filename}`)
        } else {
            uploadImage = 'http://res.cloudinary.com/dnxliek6h/image/upload/v1696253814/ucgpke3ozasyktwwmijn.png'
        }
        
        const body = {
            avatar:uploadImage,
            ...req.body
        }

        try {

            const req = await consulta('aut/create', 'post', body);
            const response = await req.json()


            if (response.ok) {
                //Aqui el registro ha ido bien
                    res.cookie('xtoken', response.token)
                    res.redirect('/mifeed')

            } else {
                res.render('error', {
                    title: 'error de validación',
                    msg: 'Ya hay un usuario con ese email'
                })
            }

        } catch (error) {
            res.render('error', {
                title: 'error de registro',
                msg: error
            })
        }
    }

}

const editMyProfile = async (req,res) => {

    try {
        const isLogged = await ifLogged(req)
        const request = await consulta(`aut/profile/${isLogged.name}`)
        const response = await request.json()

        if (!isLogged)
        res.render('error', {
            title: 'error de login',
            msg: 'No estás logeado'
        })

        res.render('editProfile', {
            title: 'Completa tu perfil',
            msg: 'Rellena los campos',
            isLogged,
            errors: false,
            
        })
    } catch (error) {
        res.render('error', {
            title: 'error de registro',
            msg: error
        })
    }
}

module.exports = {
    getIndex,
    checkLogin,
    logOut,
    signup,
    uploadSignup,
    editMyProfile
}