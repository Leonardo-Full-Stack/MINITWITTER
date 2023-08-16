# FRONTSQLBLOG

## Front del SQL Blog

**Tarea blog:**

Bienvenido a la documentación del front-end de la tarea blog de Leonardo.

Antes de comenzar, debes tener tanto el back como el front abierto en el visual, el front irá por el puerto 4000 y el back en 3000.

La bbdd está en la nube con elephant, no es necesario crear una local para hacer pruebas.

**INICIAR**  

Para iniciar el proyecto, se debe clonar los dos repositorios "APISQLBLOG"  y "FRONTSQLBLOG" .
Ingresamos "npm i" para instalar los npm del proyecto  
Luego, agregamos estos valores al template.env del front:  
PORT=4000  
JWT_SECRET_KEY=elcieloestaentabicubiladoquienlodesentabicubilara
JWT_SECRET_KEY2=eldesentabicubiladorquelodesentabicubilebuendesentabicubiladorsera  
Y lo mismo pero en el back:  
PORT=3000
JWT_SECRET_KEY=elcieloestaentabicubiladoquienlodesentabicubilara
JWT_SECRET_KEY2=eldesentabicubiladorquelodesentabicubilebuendesentabicubiladorsera  
 y le quitamos la palabra template
 
Abriendo dos terminales en los directorios de los repositorios, ingresamos "npm run dev" en cada uno.
Listo, ya podemos navegar en el proyecto por la ruta "http://localhost:4000"

**CUENTAS**  

Podéis haccer pruebas con las cuentas:
admin: ana@correo.es | password: 1234
user: maria@correo.es | password: 1234
O podéis crear un usuario nuevo.

**FUNCIONALIDADES:**

Es un servicio de entradas de blogs en comunidad, donde el usuario puede ver todas las entradas,crear y editar las suyas. Al hacer login, se muestra en index las últimas entradas publicadas, donde el usuario puede hacer clic en "ver más" y acceder al contenido. También puede acceder a "mis entradas", donde aparecerán sus entradas publicadas, y un botón para poder editarlas. Solo el administrador puede eliminar entradas.

**ADMINISTRADOR:**

Al acceder con una cuenta de administrador, se te redigirá automáticamente a /admin. La interfaz es prácticamente la misma, solo que el administrador tendrá desde el principio (el index), acceso al botón de editar entradas, sin tener que ser suyas. En el panel de control de editar entradas, también podrá eliminarlas, en un botón que pone "eliminar".

**ULTIMAS FUNCIONALIDADES (2.0)**
Los usuarios no registrados pueden acceder a ver las entradas y a la herramienta de búsqueda.
Las entradas desde la vista admin se hacen desde una tabla.
Remaquetación casi entera, con vistas mas agradables para el cliente.
Expres-validator para comprobar los inputs.
JWT desde el back ( antes se generaba en el front )
Paginación casera para la vista de todas las entradas.

