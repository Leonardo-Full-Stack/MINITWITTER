const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const { consulta } = require('../helpers/dbConnect')
const { ifLogged } = require('../helpers/isLogged')
const { errorMsgs } = require('../helpers/errorMsg')
const { uploadCloudinary } = require('../helpers/cloudImages')



/**
 * Muestra las últimas entradas en la página de entradas.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @throws {Error} Si hay un error de conexión.
 */

const showLogin = (req, res) => {
    res.render('login', {
        title: 'login',
        msg: 'Consulta aqui todas las entradas',
    })
}


const showEntries = async (req, res) => {
    const isLogged = await ifLogged(req)

    let page, respFollows

    if (req.query.pag == undefined) page = 1
    else page = req.query.pag

    try {

        const pageKnew = await consulta('entries/', 'get');
        const pageKnewJson = await pageKnew.json()


        const pages = Math.ceil(pageKnewJson.data.length / 4)


        const peticion = await consulta(`entries?pag=${page}`);
        const peticionJson = await peticion.json();

        const categoriesReq = await consulta('entries/categorias/');
        const categoriesResp = await categoriesReq.json();
        const categories = await categoriesResp.categories

        //esto mandará la información de a quien sigue el usuario en caso de estar logeado
        if (isLogged.ok) {

            const token = req.cookies['xtoken']
            const body = {
                token
            }
            const myFollows = await consulta('aut/myfollows', 'post', body)
            respFollows = await myFollows.json();

            peticionJson.data.forEach(item => {

                respFollows.showFollowers.forEach(followItem => {
                    if (followItem.following == item.name) {
                        item.following = true
                    } else {
                        item.following = false
                    }
                })
            })


        } else {
            respFollows = {
                showFollowers: false
            }
        }


        res.render('entries', {
            title: 'Últimas entradas',
            msg: 'Consulta aqui todas las entradas',
            data: peticionJson.data,
            isLogged,
            pages,
            categories,
            respFollows: respFollows.showFollowers
        })

    } catch (error) {
        res.render('error', {
            title: 'Error de conexión',
            msg: error
        })
    }



}

const postEntry = async (req, res) => {
    const userName = req.userName;
    const isLogged = await ifLogged(req)
    res.render('post', {
        title: 'Escribe una entrada',
        msg: 'Rellena los campos',
        isLogged,
        errors: false,
        userName
    })
}


/**
 * Maneja la subida de una nueva entrada.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @throws {Error} Si hay un error de conexión.
 */
const uploadEntry = async (req, res) => {

    const userName = req.userName;
    const name = userName;
    const isLogged = await ifLogged(req);
    let body;

    console.log(req.file, 'file')
    const { title, extract, content, category } = req.body // cambiar el localhost de aui abajo para el despliegue
    let entryImage = req.file ? `/media/uploads/${req.file.filename}` : 'https://minitwitter-x2oo.onrender.com/media/noimagetwiter.png';

    console.log(entryImage, 'paz')




    try {
        // despliegue : https://minitwitter-x2oo.onrender.com/
        // local : http://localhost:4001/media/
        if (req.file) {
            const uploadImage = await uploadCloudinary(`https://minitwitter-x2oo.onrender.com/media/uploads/${req.file.filename}`)

            body = { name, entryImage: uploadImage, ...req.body }
        } else {
            body = { name, entryImage, ...req.body }
        }

        const peticion = await consulta('entries/create', 'post', body)
        const peticionJson = await peticion.json()


        if (peticionJson.ok) {
            res.render('info', {
                title: 'Entrada creada',
                msg: 'Entrada creada con éxito!',
                isLogged
            })
        } else if (peticionJson.errores) {
            const errores = errorMsgs(peticionJson.errores)

            res.render('post', {
                title: 'Campos incorrectos',
                msg: 'Rellena bien los campos',
                data: body,
                isLogged,
                errors: true,
                errores,
                userName

            })
        }



    } catch (error) {
        res.render('error', {
            title: 'error',
            msg: error,
            isLogged,
            errors: false
        })
    }


}


/**
 * Maneja la obtención de todas las entradas de un usuario.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @throws {Error} Si hay un error de conexión.
 */
const myEntries = async (req, res) => {
    const isLogged = await ifLogged(req)
    const body = {
        name: req.userName
    }
    try {
        const peticion = await consulta(`entries/`, 'post', body)
        const peticionJson = await peticion.json()
        if (peticionJson.ok) {
            res.render('myEntries', {
                title: 'Todas tus entradas',
                msg: 'Consulta, edita o elimina tus entradas',
                data: peticionJson.data,
                isLogged
            })
        } else {
            res.render('error', {
                title: 'error',
                msg: 'Error al obtener tus entradas',
                isLogged
            })
        }
    } catch (error) {
        res.render('error', {
            title: 'error',
            msg: 'Error de conexión',
            isLogged
        })
    }

}

/**
 * Maneja la búsqueda de entradas.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {boolean} isLogged - Indica si el usuario está autenticado.
 * @param {string} search - Término de búsqueda ingresado por el usuario.
 * @param {RegExp} pattern - Patrón de búsqueda utilizado para filtrar las entradas.
 * @param {object} finded - Entradas encontradas con la búsqueda.
 * @returns {void}
 * @throws {Error} Si hay un error de conexión.
 */
const getSearch = async (req, res) => {

    const isLogged = await ifLogged(req)
    const { search } = req.body
    if (search == '') {
        res.render('search', {
            title: 'Búsqueda de entradas',
            msg: 'El campo búsqueda está vacío',
            query: false,
            isLogged
        })
    } else if (!search) {
        res.render('search', {
            title: 'Búsqueda de entradas',
            msg: 'Realiza aquí tu búsqueda',
            query: false,
            isLogged
        })
    } else {
        try {
            const peticion = await consulta('entries/', 'get')
            const peticionJson = await peticion.json()
            console.log(peticionJson)

            if (peticionJson.ok) {
                let pattern = new RegExp(search, 'i')

                let finded = peticionJson.data.filter((item) => item.content.match(pattern))

                if (finded.length == 0) {
                    res.render('search', {
                        title: 'No hay resultados',
                        msg: 'No se han encontrado resultados con tu búsqueda',
                        query: false,
                        isLogged
                    })
                } else {
                    res.render('search', {
                        title: `Resultados de ${search}`,
                        msg: `Se han encontrado ${finded.length} resultados`,
                        query: true,
                        data: finded,
                        isLogged
                    })
                }


            }
        } catch (error) {
            res.render('error', {
                title: 'error',
                msg: error,
                isLogged
            })
        }



    }



}


/**
 * Maneja la edición de una entrada.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {boolean} isLogged - Indicador si el usuario está conectado o no.
 * @param {string} entry - Índice de la entrada a editar.
 * @param {string} email - Dirección de correo electrónico del usuario.
 * @returns {void}
 * @throws {Error} Si hay un error de conexión.
 */
const editEntry = async (req, res) => {
    const isLogged = await ifLogged(req)
    const entry = req.params.indexEntry
    let { email } = req.cookies

    try {
        const allMyEntries = await consulta(`entries/one/${entry}`, 'get')
        const entriesJson = await allMyEntries.json()

        res.render('update', {
            title: 'Modificar  entrada',
            msg: 'Modifica aquí la entrada',
            data: entriesJson.data[0],
            isLogged
        })
    } catch (error) {
        res.render('error', {
            title: 'error',
            msg: error,
            isLogged
        })
    }


}


/**
 * Maneja la actualización de una entrada.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {string} req.body.title - Título de la entrada.
 * @param {string} req.body.oldTitle - Título antiguo de la entrada.
 * @param {string} req.body.extract - Extracto de la entrada.
 * @param {string} req.body.content - Contenido de la entrada.
 * @param {string} req.body.category - Categoría de la entrada.
 * @param {string} req.body.oldImage - Ruta de la imagen antigua de la entrada.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.file.filename - Nombre del archivo de la imagen de la entrada.
 * @returns {void}
 * @throws {Error} Si hay un error de conexión.
 */
const updateEntry = async (req, res) => {
    const isLogged = await ifLogged(req)
    let { title, oldTitle, extract, content, category, oldImage } = req.body
    const { email } = req.cookies
    const entryImage = req.file ? `../media/uploads/${req.file.filename}` : oldImage;



    if (!extract || !title || !content || !category) {
        res.render('error', {
            title: 'error de validación',
            msg: 'Rellena bien todos los campos',
            isLogged
        })


    }

    const body = { email, title, extract, content, entryImage, category, }

    try {


        const peticion = await consulta(`entries/${oldTitle}`, 'put', body)
        const peticionJson = await peticion.json()

        if (peticionJson.ok) {
            res.render('info', {
                title: 'Entrada actualizada',
                msg: 'Entrada actualizada con éxito!',
                isLogged
            })
        } else {
            res.render('post', {
                title: 'error',
                msg: 'Error al conectar con la base de datos',
                isLogged
            })
        }



    } catch (error) {
        res.render('error', {
            title: 'error',
            msg: 'Contacta con el administrador',
            isLogged
        })
    }

}


/**
 * Maneja la visualización de una sola entrada.
 * 
 * @function
 * @async
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {string} req.params.id - ID de la entrada a visualizar.
 * @returns {void}
 * @throws {Error} Si hay un error de conexión.
 */
const viewOne = async (req, res) => {
    const isLogged = await ifLogged(req)
    const id = req.params.id
    try {
        const peticion = await consulta(`entries/one/${id}`, 'get')
        const peticionJson = await peticion.json();


        if (peticionJson.ok) {

            res.render('one', {
                title: `${peticionJson.data[0].title}`,
                msg: 'La entrada al completo',
                data: peticionJson.data[0],
                replies: peticionJson.replies,
                isLogged,
                id
            })
        } else {
            res.render('error', {
                title: 'No existe  la entrada',
                msg: 'No se ha encontrado la entrada',
                isLogged
            })
        }
    } catch (error) {
        res.render('error', {
            title: 'error',
            msg: 'Contacta con el administrador',
            error,
            isLogged
        })
    }
}

const uploadReply = async (req, res) => {
    const { content, id_entry, name } = req.body

    const body = {
        content,
        id_entry,
        name
    }

    try {
        const request = await consulta('replies/createreply', 'post', body)
        const response = await request.json()

        if (response.ok) {
            res.redirect(`viewone/${id_entry}`)
        }

    } catch (error) {
        res.render('error', {
            title: 'error de algo',
            msg: 'Error al registrar la respuesta'
        })
    }
}

const showCategories = async (req, res) => {
    const category = req.params.category


    try {
        const request = await consulta(`entries/categorias/?q=${category}`);
        const response = await request.json()

        if (response.ok) {
            res.render('category', {
                title: 'error de algo',
                msg: `Entradas para la categoría ${category}`,
                data: response.entriesByCategory
            })
        } else {
            res.render('error', {
                title: 'error de algo',
                msg: `No se han encontrado entradas para la categoría ${category}`,
            })
        }
    } catch (error) {
        res.render('error', {
            title: 'error de servidor',
            msg: `Contacta con el administrador`,
        })
    }

}

const showMyProfile = async (req, res) => {
    const isLogged = await ifLogged(req)
    const body = {
        token: req.cookies['xtoken']
    }

    if (!isLogged) res.render('error', {
                   title: 'Loguéate para ver tu perfil',
                   msg:'Loguéate para ver tu perfil'
    })

    try {
        const request = await consulta('aut/myprofile/', 'post', body)
        const response = await request.json()
        console.log(response)

        if (response.ok) {
            res.render('myProfile', {
                title:'meh',
                msg:'mah',
                data:response.data[0]
            })
        }
        

    } catch (error) {
        res.render('error', {
            title: 'error de servidor',
            msg: `Contacta con el administrador`,
        })
    }
}



module.exports = {
    showEntries,
    postEntry,
    uploadEntry,
    myEntries,
    getSearch,
    editEntry,
    updateEntry,
    viewOne,
    showLogin,
    uploadReply,
    showCategories,
    showMyProfile
}