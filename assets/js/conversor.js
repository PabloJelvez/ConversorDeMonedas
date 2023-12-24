const urlApi = "https://mindicador.cl/api/"
const optionExchange = document.getElementById("selectExchange")
const inputExchange = document.getElementById("clpValue")
const buttonExchange = document.getElementById("btnExchange")
const resultExchange = document.getElementById("exchangeValue")
const chartCanvas = document.getElementById("chart") 

let exchanges
let myChart

async function getExchange(){
    try{
    const response = await fetch(urlApi)
    exchanges = await response.json()
    return exchanges
    }catch(error){
    const elementError = document.getElementById("error")
    elementError.innerHTML = `!Algo salio mal¡ Error:  ${error.message}`
    }

} 

async function renderExchange(){
 await getExchange()
 let template = ""
 const optionVisible = ["dolar", "euro", "uf"]
const filteredExchange = Object.values(exchanges).filter((exchange) =>{
    return optionVisible.includes(exchange.codigo)
})
//optionExchange.innerHTML = ""
optionExchange.innerHTML = "<option value='' disabled selected>Seleccione moneda</option>"
filteredExchange.forEach((exchange) => {
        template += `
        <option value="${exchange.valor}" id="${exchange.codigo}">${exchange.nombre}</option>
        `
    });
    optionExchange.insertAdjacentHTML("beforeend", template)
}
renderExchange()

async function convertClp() {
    const clp = Number(inputExchange.value)
    const exchange = Number(optionExchange.value)
    const result = (clp * (1 / exchange))
    resultExchange.textContent = `Resultado: $${result.toFixed(2)}`
    inputExchange.value = ""
  }
renderExchange()
 
async function createChart(){

    const exchangeCode = optionExchange.options[optionExchange.selectedIndex].id
    
    const exchangeData = await fetch(`https://mindicador.cl/api/${exchangeCode}`)
    const exchangeJson = await exchangeData.json()
    
    const labels = exchangeJson.serie.map((exchange) => {
    return  new Date(exchange.fecha).toISOString().slice(0, 10)
    })
    const data = exchangeJson.serie.map((exchange) =>{
    const value = exchange.valor
    return Number(value)
    })
    const datasets = [
      {
        label: "Moneda",
        borderColor: "rgb(255, 99, 132)",
        data
    }
    ]
    const config = {
             type: "line",
              data: {
             labels: labels, 
             datasets: datasets
        }
    }
     
        chartCanvas.style.backgroundColor = "white"
        if (myChart) {
        myChart.destroy()
    }
        myChart = new Chart(chartCanvas, config) 
    }

    buttonExchange.addEventListener("click", function(){
    convertClp()
    createChart() 
})