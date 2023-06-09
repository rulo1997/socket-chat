const miFormulario = document.querySelector('form');


miFormulario.addEventListener('submit', ev => {

    const url = ( window.location.host.includes('localhost') )
    ? 'http://localhost:8080/api/auth/'
    : 'https://socket-chat-production-6788.up.railway.app/api/auth/'

    ev.preventDefault();

    const formData = {};

    for( let el of miFormulario.elements ) {

        if( el.name.length > 0 ) {

            formData[el.name] = el.value;

        }

    }

    fetch( url + 'login', {
        method: 'POST'
        ,body: JSON.stringify( formData )
        ,headers: { 'Content-Type': 'application/json'}
    })
    .then( resp => resp.json() )
    .then( ({ msg , token }) => {
        if( msg ) {
            console.error(msg);
        }
        
        localStorage.setItem('token' , token)
        window.location = 'chat.html'
    })
    .catch( console.warn );

});

function handleCredentialResponse(response) {

    const url = ( window.location.host.includes('localhost') )
    ? 'http://localhost:8080/api/auth/'
    : 'https://socket-chat-production-6788.up.railway.app/api/auth/'

    const body = { id_token: response.credential };    

    console.log({ id_token: response.credential });

    fetch(url + 'google' , {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( res => res.json() )
        .then( ({ token }) => {
            
            console.log(token);
            localStorage.setItem('token', token );
            window.location = 'chat.html';
    
        })
        .catch( console.warn )

}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log( google.accounts.id )
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem('email') , done => {
        localStorage.clear();
        location.reload();
    })
}