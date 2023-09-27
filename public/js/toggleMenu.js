
const burguerMenu = document.querySelector('i')
const navDiv = document.querySelector('.navDiv')
const mainBox = document.querySelector('main')

const loginLink = document.querySelector('#login')
const loginForm = document.querySelector('.loginSection')
const closeLoginForm = document.querySelector('.closeSymbol')
const showLogin = document.querySelector('#showLogin')


burguerMenu.addEventListener('click', ()=> {
    navDiv.classList.toggle('displayNone')
    
})


loginLink.addEventListener('click', ()=>{
    loginForm.classList.toggle('displayHidden')
    mainBox.classList.toggle('opacStuff')
})

showLogin.addEventListener('click', ()=>{
    loginForm.classList.toggle('displayHidden')
    mainBox.classList.toggle('opacStuff')
})

closeLoginForm.addEventListener('click', ()=>{
    loginForm.classList.toggle('displayHidden')
    mainBox.classList.toggle('opacStuff')
})