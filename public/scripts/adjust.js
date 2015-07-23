var address = window.data.address;
var lat = window.data.lat;
var lng = window.data.lng;

L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q';

var map = L.mapbox.map('map-adjust', 'mapbox.streets', {
  attributionControl: false
}).setView([lat, lng], 16);

var marker = L.marker(new L.LatLng(lat, lng), {
  draggable: true
});

marker.on('move', function() {
  var position = marker.getLatLng();
  $('#lat').val(position.lat);
  $('#lng').val(position.lng);
});

marker.bindPopup(address);
marker.addTo(map);
