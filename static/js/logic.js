// Storing the url that has the data for earthquakes worldwide over last week
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//Calls the API and creates different markers for individual earthquake
d3.json(url).then(function (data){
    createFeatures(data.features);
});

//Constructs the function that creates the marker at each earthquake 
function createFeatures(features){
    //Loop through each feature
    for (i = 0; i<features.length;i++){
        let feature = features[i];
        depth = feature.geometry.coordinates[2]
        //Set color conditional upon depth
        if (depth < 10){
            colorVar = "#ffffb2"
        }
        else if (depth < 30){
            colorVar = "#feb24c"
        }
        else if (depth < 50){
            colorVar =  "#fed976"
        }
        else if (depth < 70){
            colorVar = "#fd8d3c"
        }
        else if (depth < 90){
            colorVar = "#bd0026"
        }
        else{
            colorVar = "#f03b20" 
        };
    //Creates the circles  
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: 20000*feature.properties.mag,
        color: colorVar, 
        opacity: 0.0,
        fillOpacity: 0.8
    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude:${feature.properties.mag}</p>`).addTo(myMap);
}};

//Creates the street base and the topographical data
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Creates the class of basemaps to control the layer  
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

//Initializing the map
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 3,
    layers: [street]
});

//Adds controls for layer 
L.control.layers(baseMaps).addTo(myMap);

//Tells the html where it should store the legend
let info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(myMap)

//Updates the map legend include the color of desired squares and the information
document.querySelector(".legend").innerHTML = [
    "<p> Depth of Epicenter</p>",
    "<div class='input-color'><input type='text' value='<10 km' /><div class='color-box' style='background-color: #ffffb2;'></div></div>",
    "<div class='input-color'><input type='text' value='11-30 km' /><div class='color-box' style='background-color: #fed976;'></div></div>",
    "<div class='input-color'><input type='text' value='31-50 km' /><div class='color-box' style='background-color: #feb24c;'></div></div>",
    "<div class='input-color'><input type='text' value='51-70 km' /><div class='color-box' style='background-color: #fd8d3c;'></div></div>",
    "<div class='input-color'><input type='text' value='71-90 km' /><div class='color-box' style='background-color: #f03b20;'></div></div>",
    "<div class='input-color'><input type='text' value='90+ km' /><div class='color-box' style='background-color: #bd0026;'></div></div>"
  ].join("")