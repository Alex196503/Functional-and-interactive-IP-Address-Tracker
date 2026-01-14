document.addEventListener(('DOMContentLoaded'),async()=>{
let response = await fetch('https://api.ipify.org?format=json');
let data = await response.json();
let ipAdressParagraph = document.querySelector('#paragraph-Ip');
let ispParagraph = document.querySelector('#paragraph-Isp');
let timeZoneParagraph = document.querySelector('#paragraph-timeZone');
let locationParagraph = document.querySelector('#paragraph-Location');
let form = document.querySelector('form');
let input = document.querySelector('input');
ipAdressParagraph.innerHTML = data.ip;
let request = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_j7ubDUYF6fizgxrPAxSKCOAMEfesT&ipAddress=${data.ip}`);
let data2 = await request.json();
let {isp} = data2;
let {location:{timezone}} = data2;
let {location:{city, region, postalCode, lat, lng}} = data2;
ispParagraph.innerHTML = isp;
ipAdressParagraph.textContent = data.ip;
timeZoneParagraph.innerHTML = `UTC ${timezone}`;
locationParagraph.textContent = `${region}, ${city} ${postalCode} `;
let array = [lat, lng];


var map = L.map('map').setView(array, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let myIcon = L.icon({
    iconUrl:'images/icon-location.svg',
    iconSize:[40,50],
    iconAnchor:[22,50],
    popupAnchor:[-3,75]
});
var marker = L.marker(array,{icon : myIcon}).addTo(map);
marker.bindPopup(`<h3 class="text-primary">Hello! This is where you are right now!</h3>`);
var popup = L.popup();
function displayPopUp(eveniment)
{
    popup.setLatLng(eveniment.latlng)
         .setContent(`You clicked the map at:${eveniment.latlng.toString()}`)
         .openOn(map)
}
map.addEventListener(('click'),(e)=>{
    displayPopUp(e);
})
   form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(input.value ==='')
    {
        window.alert('Please introduce a value!');
        return;
    }
    await bringMeData();
   })
   async function bringMeData()
   {
    try{
    let req = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_j7ubDUYF6fizgxrPAxSKCOAMEfesT&domain=${input.value}`);
    let data = await req.json();
    let IpAddress = data.ip;
    ipAdressParagraph.textContent = IpAddress;
    let ISP = data.isp;
    ispParagraph.textContent = ISP;
    let {location:{timezone}} = data;
    timeZoneParagraph.textContent = `UTC ${timezone}`;     
    let {location:{region}} = data;
    let {location:{city}} = data;
    let {location:{postalCode}} = data;
    locationParagraph.textContent = `${region}, ${city} ${postalCode} `;
    let longitudine = data.location.lng;
    let latitudine = data.location.lat;
    let array = [latitudine, longitudine];
    map.setView(array, 13);
    marker.setLatLng(array);
    
    }catch(Error)
    {
        console.log('Something bad occured:' + Error);
    }
   }
})