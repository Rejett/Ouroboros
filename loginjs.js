const loginn = document.querySelector("#login")
const cadastro = document.querySelector(".cadastrar")
let emailu = document.querySelector("#email-user")
let email = document.querySelector("#email")
let password = document.querySelector("#password")
const loader = document.querySelector(".loader")
const recuperar = document.querySelector("#recuperar")
let emailr = document.querySelector("#email-recuperar")
let senha = document.querySelector("#senha")
const confirmacao = document.querySelector("#confirmacao")


function showLoading() {
    loader.style.display = "flex"

    setTimeout(() => hideLoading(), 2000)
}
function hideLoading(){
    loader.style.display = "none"
}

function entrar(){
    loginn.style.display = "flex"
    cadastro.style.display = "none"
    recuperar.style.display = "none"

}
function cadastrar(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "index.html"
        }
    })
    
    loginn.style.display = "none"
    cadastro.style.display = "block"
    recuperar.style.display = "none"
}

function recuperars(){
    loginn.style.display = "none"
    cadastro.style.display = "none"
    recuperar.style.display = "block"
}

function enviar(){
    showLoading()
    firebase.auth().createUserWithEmailAndPassword(email.value, senha.value).then( () => {
        hideLoading()
        window.location.href = "index.html"
    }).catch(error => {
        hideLoading()
        alert(getErrorMessage(error))
    })
}
function login(){
    showLoading()
    firebase.auth().signInWithEmailAndPassword(
        emailu.value, password.value
        ).then(response => {
            window.location.href = "index.html"
      }).catch(error => {
            alert(getErrorMessage(error))
      })
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuario não dadastrado, Porfavor confirme o E-mail e Senha"
    }
    if (error.code == "auth/wrong-password"){
        return "Senha Invalida"
    }
    if (error.code == "auth/email-already-in-use"){
        return "E-mail já está em uso!"
    }
    if (error.code == "auth/missing-password"){
        return "Porfavor digite uma senha valida!"
    }
    if (error.code == "auth/weak-password"){
        return "A senha deve conter pelo menos 6 caracteres!"
    }
    return error.message
}
function checar() {
    recoverPassword()
}

function recoverPassword (){
    showLoading()
    firebase.auth().sendPasswordResetEmail(emailr.value).then (() => {
        hideLoading()
        alert('Email enviado com sucesso')
    }).catch(error => {
        hideLoading()
        alert(getErrorMessage(error))
    })
}
function sairH() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html"
    }).catch(() => {
        alert("Erro ao fazer logout")
    })
}


/* const usuario = document.querySelector("#usuario").value
    const senha = document.querySelector("#senha").value
    const confirmacao = document.querySelector("#confirmacao").value
    const email = document.querySelector("#email").value
    if(senha != confirmacao){
        senha = ""
        confirmacao = ""
        alert("Senhas Não conhecidem!")
    } else{
        alert("cadastrou!")
    } 
    
        entrarH.style.display = "none"
    sairH.style.display = "block"
    
    */