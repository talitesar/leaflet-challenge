// Store url endpoint as constant
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Use url to request data and put the features part into a function to create the map
d3.json(url).then(data=>{
    createMap(data.features)
})

// Define a function to create the map
function createMap(earthquakeData) {

    // Store the data input as a variable
    var earthquakes = earthquakeData.map(row =>row)
    
    // Create the Leaflet map, stored as "myMap"
    var myMap = L.map("map", {
        center: [36, -115],
        zoom: 6
    });

    // Add the title layer to the map with the map view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);

    // Loop through the earthquake data
    for (let i=0;i<earthquakes.length;i++){

        // Create a color scale associated with the depth of the earthquake and store the appropriate color for each earthquake
        let color = ""
        if (earthquakes[i].geometry.coordinates[2] <= 10){
            color = "#80ff00"
        }
        else if (earthquakes[i].geometry.coordinates[2] <= 30){
            color = "#bfff00"
        }
        else if (earthquakes[i].geometry.coordinates[2] <= 50){
            color = "#ffff00"
        }
        else if (earthquakes[i].geometry.coordinates[2] <= 70){
            color = "#ffbf00"
        }
        else if (earthquakes[i].geometry.coordinates[2] <= 90){
            color = "#ff8000"
        }
        else {color = "#ff4000"}

        // Add a circle marker for each earthquake using latitude and longitude, and bind a popup with more information
        L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            color: "black",
            fillColor: color,
            // Adjust the radius.
            radius: (earthquakes[i].properties.mag) *15000
          }).bindPopup(`<h3>${earthquakes[i].properties.place}</h3><hr><p>${new Date(earthquakes[i].properties.time)}</p>`).addTo(myMap);
    }

    // Create a legend in the bottomright corner
    var legend = L.control({ position: "bottomright" });

    // Define a function to add each layer of the legend
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");

        // Add the text for the legend and a square showing the different colors using bootstrap class "bi bi-square-fill"
        div.innerHTML +="<h4>Earthquake Depth</h4>"
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #80ff00"></span> -10-10</span><br>';
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #bfff00"></span> 11-30</span><br>';
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #ffff00"></span> 31-50</span><br>';
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #ffbf00"></span> 51-70</span><br>';
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #ff8000"></span> 71-90</span><br>';
        div.innerHTML += '<span class="bi bi-square-fill" style="color: #ff4000"></span> 90+</span><br>';
        return div; 
    };
    
    // Add the legend to the map
    legend.addTo(myMap);
}