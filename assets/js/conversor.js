const urlApi = "https://mindicador.cl/api/"
const optionExchange = document.getElementById("selectExchange")
const inputExchange = document.getElementById("clpValue")
const buttonExchange = document.getElementById("btnExchange")
const resultExchange = document.getElementById("exchangeValue")

let exchanges

async function getExchange(){
    try{
    const response = await fetch(urlApi)
    const exchanges = await response.json()
    return exchanges
    }catch{
    const elementError = document.getElementById("error")
    elementError.innerHTML = `!Algo salio mal¡ Error:  ${error.message}`
    }

} 

async function renderExchange(){
 exchanges = await getExchange()
 let template = ""
 const optionVisible = ["dolar", "euro"]
const filteredExchange = Object.values(exchanges).filter((exchange) =>{
    return optionVisible.includes(exchange.codigo)
})

filteredExchange.forEach((exchange) => {
        template += `
        <option value="${exchange.codigo}" id="${exchange.codigo}">${exchange.nombre}</option>
        `
    });
    optionExchange.insertAdjacentHTML("beforeend", template)
}

renderExchange()

function convertClp() {
    const clp = Number(inputExchange.value)
    const exchangeType = optionExchange.value
    const exchange = exchanges[exchangeType].valor
    const result = (clp * (1 / exchange))
    resultExchange.textContent = `Resultado: $${result.toFixed(2)}`
    inputExchange.value = ""
  }
  
  buttonExchange.addEventListener("click", convertClp)





//const urlApi = "https://mindicador.cl/api/"
//async function getExchange(){
//    const response = await fetch(urlApi)
//    const exchanges = await response.json()
//    const arrexchange = Object.entries(exchanges).splice(3, 15)
//    let myExchange = []
//    arrexchange.forEach((val) => {
//    myExchange.push(val[0])
//    })
//    myExchange.forEach((moneyExchange) => {
//        document.getElementById("selectExchange").innerHTML += `
//        <option>${moneyExchange}</option>`
//    })
//}
// getExchange()