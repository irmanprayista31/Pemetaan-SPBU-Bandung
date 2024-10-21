const map = L.map('map').setView([-6.9147, 107.6098], 12); // Bandung coordinates

// Add OpenStreetMap tiles as the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markersLayer, gasStationsData;
const loadingSpinner = document.querySelector('.loading');

// Load GeoJSON data
fetch('data/export.geojson')
  .then((response) => response.json())
  .then((data) => {
    gasStationsData = data;
    loadingSpinner.style.display = 'none';
    displayMarkers(data);
  })
  .catch(() => {
    loadingSpinner.innerText = 'Failed to load data';
  });

function displayMarkers(data) {
  markersLayer = L.geoJSON(data, {
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || 'Unnamed Gas Station';
      const ref = feature.properties.ref || 'Address not available';
      layer.bindPopup(`<b>${name}</b><br>${ref}`);
    }
  }).addTo(map);
}

document.getElementById('search-btn').addEventListener('click', () => {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  filterGasStations(searchText);
});

function filterGasStations(searchText) {
  if (markersLayer) map.removeLayer(markersLayer);
  const filteredData = {
    type: 'FeatureCollection',
    features: gasStationsData.features.filter(feature => 
      (feature.properties.name || '').toLowerCase().includes(searchText)
    )
  };
  displayMarkers(filteredData);
}
