const urlApi = "https://mindicador.cl/api/"
const optionExchange = document.getElementById("selectExchange")
const inputExchange = document.getElementById("clpValue")
const buttonExchange = document.getElementById("btnExchange")
const resultExchange = document.getElementById("exchangeValue")
const chartCanvas = document.getElementById("chart") 


let exchanges

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
 const optionVisible = ["dolar", "euro"]
const filteredExchange = Object.values(exchanges).filter((exchange) =>{
    return optionVisible.includes(exchange.codigo)
})
optionExchange.innerHTML = ""
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
  let chart
  async function createChart() {
   
    const exchangeCode = optionExchange.options[optionExchange.selectedIndex].id
    
    const exchangeData = await fetch(`https://mindicador.cl/api/${exchangeCode}`)
    const exchangeJson = await exchangeData.json()
   
    const labels = []
    const values = []
   
    for (let i = exchangeJson.serie.length - 10; i < exchangeJson.serie.length; i++) {
       
        const date = new Date(exchangeJson.serie[i].fecha)
        const value = exchangeJson.serie[i].valor
        
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
       
        labels.push(formattedDate)
        values.push(value)
    }
  
    const ctx = chartCanvas.getContext("2d")
    if (chart) {
        chart.destroy()
    }
   
     chart = new Chart(ctx, {
       
        type: "line",
        
        data: {
            labels: labels,
            datasets: [{
                label: exchangeJson.nombre, 
                data: values, 
                borderColor: "blue",
                fill: false 
            }]
        },
        
        options: {
            
            maintainAspectRatio: false,
            
            legend: {
                display: true
            },
            
            title: {
                display: true,
                text: "Valores de los últimos 10 días"
            },
            
            scales: {
                
                xAxes: [{
                    type: "time",
                    time: {
                        unit: "day",
                        displayFormats: {
                            day: "DD/MM/YYYY"
                        }
                    }
                }],
                
                yAxes: [{
                    ticks: {
                        
                        callback: function(value, index, values) {
                            return value.toFixed(2)
                        }
                    }
                }]
            }
        }
    })
}

renderExchange()

buttonExchange.addEventListener("click", function(){
     convertClp()
     createChart()
})

//optionExchange.addEventListener("change", createChart)




  
  //async function getData(exchanges){
    
    //await getExchange()
    //const exchangeType = optionExchange.value
    //const exchangeData = await exchanges[exchangeType].serie
    
    //const labels = exchangeData.map((exchange) => {
      //  return  new Date(exchange.fecha).toISOString().slice(0, 10)
    //})
    //const data = exchangeData.map((exchange) =>{
      //  const value = exchange.valor
        //return Number(value)
    //})
    //const datasets = [
      //  {
        //label: "Moneda",
        //borderColor: "rgb(255, 99, 132)",
        //data
    //    }
    //]
    //return {labels, datasets}
  //}

  //async function renderGrafica(){
  //  const data = await getData(exchanges)
  //  const config = {
  //      type: "line",
  //      data: {
   //         labels: data.labels,
   //         datasets: [{
   //             label: data.datasets[0].label,
     //           borderColor: data.datasets[0].borderColor,
       //         data: data.datasets[0].data
   //         }]
   //     }
   // }
   // const chartElement = document.getElementById("myChart")
   // chartElement.style.backgroundColor = "white"
   // if (myChart) {
     //   myChart.destroy()
    //}
    //myChart = new Chart(chartElement, config)
//}


  


 // buttonExchange.addEventListener("click", async function() {
   // convertClp()
   // await renderGrafica()
  //})
  




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