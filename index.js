
//Sols are days of each cycle on mars



//can change from demo 
const API_KEY = 'DEMO_KEY'
const API_URL= 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0'



const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather')

//getting the date
const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentTempHighElement = document.querySelector('[data-current-temp-high]')
const currentTempLowElement = document.querySelector('[data-current-temp-low]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionText = document.querySelector('[data-wind-direction-text]')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]')

//Previous sols e.g. date template
const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')


const unitToggle =document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const imperialRadio = document.getElementById('fah')

//For showing previous weather 
previousWeatherToggle.addEventListener('click', () => {
	previousWeather.classList.toggle('show-weather')
})

let selectedSolIndex

getWeather().then(sols => {
	// as the last sol e.g. current date is the last one on the list
    selectedSolIndex = sols.length -1 
		displaySelectedSol(sols)
		displayPreviousSols(sols)
		updateUnits()


          //setting the toggle to moe from faranhight to celcious  
		unitToggle.addEventListener('click', () => {
			let metricUnits = !isMetric()
			metricRadio.checked = metricUnits
			imperialRadio.checked = !metricUnits
			displaySelectedSol(sols)
			displayPreviousSols(sols)
			//to update the change
			updateUnits()

		})

metricRadio.addEventListener('change', () => {
	displaySelectedSol(sols)
	displayPreviousSols(sols)
	updateUnits()
	})

	imperialRadio.addEventListener('change', () => {
		displaySelectedSol(sols)
		displayPreviousSols(sols)
		updateUnits()
	})
})






//printing to html
function displaySelectedSol(sols){
	const selectedSol = sols[selectedSolIndex]
	currentSolElement.innerText = selectedSol.sol
	currentDateElement.innerText = displayDate(selectedSol.date)
	currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp)
	currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp)
	windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed)
	// as arrow isnt text i will have to style it 
	//using string interprelating to turn it into a degree value
	windDirectionArrow.style.setProperty('--direction',	` ${selectedSol.windDirectionDegrees}deg`) 
	windDirectionText.innerText = selectedSol.windDirectionCardinal
}


//with this function i am placing all the data to a template it will come up as seven as in the json responce we only get the last 7 days
function displayPreviousSols(sols) {
	previousSolContainer.innerHTML = ''
	//will clone previoius sols 
	sols.forEach((solData, index) => {
		const solContainer = previousSolTemplate.content.cloneNode(true)
		solContainer.querySelector('[data-sol]').innerText = solData.sol
		solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
		solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
		solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
		//this will display that date on teh main page
		solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
			selectedSolIndex = index 
			displaySelectedSol(sols)
		})
		previousSolContainer.appendChild(solContainer)
	})
}



//function not working

//setting what the date and day will look like
function displayDate(date) {
	return date.toLocaleDateString(
		//set default so will set the language based on the persons browser
		undefined,
		{ day: 'numeric', month: 'long' }
	)
}

//Temp function for changing cel to far equation plus rounding
function displayTemperature(temperature) {
	let returnTemp = temperature
	if (!isMetric()) {

			returnTemp = temperature * (9 / 5) + 32;
		// this equation was wrong returnTemp = (temperature - 32) * (5 / 9)
	}
	//rounding the temp
	return Math.round(returnTemp)
}
	
//speed function converting speed plus rounding
function displaySpeed(speed) {
	let returnSpeed = speed
	if(!isMetric()){
		returnSpeed = speed / 1.609
	}
	//rounding the speed
	return Math.round(returnSpeed)
}


//this function is to get all the specific data that i will need 
function getWeather(){
	return fetch(API_URL)
	.then(res => res.json())
	.then(data => {
		const{
			//now i am destrustoring the data 
			sol_keys,
			validity_checks,
			...solData

		} = data 
		console.log(solData)
		return Object.entries(solData).map(([sol, data]) => {
			return {
				//getting the data from json file(The temp is already in celcious) 
				sol: sol,
				maxTemp: data.AT.mx,
				minTemp: data.AT.mn,
				windSpeed: data.HWS.av,
				windDirectionDegrees: data.WD.most_common.compass_degrees,
				windDirectionCardinal:  data.WD.most_common.compass_point,
				date: new Date(data.First_UTC)
				

			}
			
		})
		
	})
}


//setting the units
function updateUnits(){
	const speedUnits = document.querySelectorAll('[data-speed-unit')
	const tempUnits = document.querySelectorAll('[data-temp-unit')
	speedUnits.forEach(unit => {
		unit.innerText = isMetric() ? 'kph' : 'mph'
			})

			tempUnits.forEach(unit => {
				unit.innerText = isMetric() ? 'C' : 'F'
				})
}


//this will allow the toggle to move from cel to far
function isMetric() {
	return metricRadio.checked

}