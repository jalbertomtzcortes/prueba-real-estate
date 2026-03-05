import React, { useEffect, useState } from "react";
import API from "../services/api";
import ChartRenderer from "./ChartRenderer";

function BIChat() {

const [step,setStep] = useState(1);
const [cities,setCities] = useState([]);
const [selectedCities,setSelectedCities] = useState([]);
const [startDate,setStartDate] = useState("");
const [endDate,setEndDate] = useState("");
const [chartType,setChartType] = useState("");
const [chart,setChart] = useState(null);

useEffect(()=>{

API.get("/cities").then(res=>{
setCities(res.data);
});

},[]);


const selectCity = (city)=>{

if(selectedCities.length < 2){

setSelectedCities([...selectedCities,city]);

}

if(selectedCities.length + 1 === 2){

setStep(2);

}

};


const generateChart = async ()=>{

const res = await API.post("/generate-chart",{

cities:selectedCities,
startDate,
endDate,
chartType

});

setChart(res.data);

};


return (

<div style={{padding:"20px"}}>

<h2>Business Intelligence</h2>

{step === 1 && (

<div>

<h3>Selecciona 2 ciudades</h3>

{cities.map(c=>(
<button key={c.city} onClick={()=>selectCity(c.city)}>
{c.city}
</button>
))}

</div>

)}


{step === 2 && (

<div>

<h3>Selecciona fecha inicio</h3>

<input
type="date"
onChange={e=>setStartDate(e.target.value)}
/>

<h3>Selecciona fecha fin</h3>

<input
type="date"
onChange={e=>setEndDate(e.target.value)}
/>

<button onClick={()=>setStep(3)}>
Continuar
</button>

</div>

)}


{step === 3 && (

<div>

<h3>Selecciona tipo de gráfico</h3>

<button onClick={()=>setChartType("bar")}>
Bar Chart
</button>

<button onClick={()=>setChartType("line")}>
Line Chart
</button>

<button onClick={()=>setChartType("pie")}>
Pie Chart
</button>

<button onClick={generateChart}>
Generar gráfico
</button>

</div>

)}

<ChartRenderer chart={chart}/>

</div>

);

}

export default BIChat;