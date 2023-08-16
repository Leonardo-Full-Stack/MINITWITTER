const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT || 4000
app.use(cors())

app.use(express.static( __dirname+'/public'));

app.set('view engine' , 'ejs')
app.set("views",__dirname + "/views");

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());


app.use('/', require ('./routers/routerFront'))
app.use('/admin', require ('./routers/routerAdmin'))




app.use((req,res)=> {
    res.status(404).render('error', {
        title: 404,
        msg: 'Página no encontrada'
    })
})

app.listen(port, () => {
    console.log(`servidor a la escucha del puerto ${port}`)
})