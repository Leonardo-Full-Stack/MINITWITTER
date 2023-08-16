const urlBase='https://api-blog-ahz5.onrender.com/api/'
//https://api-blog-ahz5.onrender.com/api/
//http://localhost:3000/api/
const express = require('express')
/* const fetch = require('node-fetch') */


/**
 * Función para realizar una consulta HTTP a una URL específica con un método y cuerpo de solicitud opcional.
 *
 * @async
 * @function
 * @param {string} url - URL de la consulta HTTP.
 * @param {string} method - Método HTTP de la consulta (p.ej., 'get', 'post', 'put', 'delete').
 * @param {Object} [body] - Cuerpo de la solicitud HTTP en formato JSON (solo para 'post' y 'put').
 * @throws {Error} - Error en caso de fallo en la consulta HTTP.
 * @returns {Promise} - Promesa que se resuelve con la respuesta de la consulta HTTP.
 *
 * @typedef {Object} options - Opciones de configuración para la consulta HTTP.
 * @property {string} method - Método HTTP de la consulta.
 * @property {string} [body] - Cuerpo de la solicitud HTTP en formato JSON (solo para 'post' y 'put').
 * @property {Object} headers - Cabeceras de la solicitud HTTP.
 */
const consulta = async(url,method,body) => {

    let options={}
    if(method=='post' || method=='put'){
        
       const data={...body};
         options={
            method:method,
            body:JSON.stringify(data),
            headers:{
                'Content-type':'application/json'
            }
        }
    }
    if(method=='delete'){
        const data={...body};
         options={
            method:method,
            body:JSON.stringify(data),
            headers:{
                'Content-type':'application/json'
            }
        }
    }
    if(method=='get'){
        options={
            method: method,
        }
    }
    
      return await fetch(`${urlBase}${url}`,options);
}

module.exports = {
    consulta
}