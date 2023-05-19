
const url = ( window.location.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://socket-chat-production-6788.up.railway.app/api/auth'

let usuario = null;
let socket = null;

//Referencias HTML

const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    
    fetch( url , {
        headers: { 'x-token': token }
    })
    .then( res => res.json() )
    .then( ({ usuario: userDB , token: tokenDB }) => {

        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre;        

        conectarSocket();

    });

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect' , () => {
        console.log('Sockets online');
    });

    socket.on('disconnect' , () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes' , dibujarMensajes );

    socket.on('usuarios-activos' , dibujarUsuarios );

    socket.on('mensaje-privado' , (payload) => {

        //Tarea:
        console.log('Privado' , payload);
    });

}

const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = ''

    usuarios.forEach( ({ nombre , uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class='text-success'>${ nombre }</h5>
                    <span class='fs-6 text-muted'>${ uid }</span>
                </p>
            </li>
        `

    });

    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = ''

    mensajes.forEach( ({ mensaje , nombre }) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class='text-primary'>${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `

    });

    ulMensajes.innerHTML = mensajesHtml;

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value.trim();
    const uid = txtUid.value.trim();

    if( keyCode !== 13 ) return; 
    if( mensaje.length === 0 ) return;

    socket.emit('enviar-mensaje', { mensaje , uid });


});


const main = async() => {

    //Validar JWT
    await validarJWT();

}

main();

// const socket = io();

