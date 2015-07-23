var data = window.data;
var markers = [];

L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q';

var map = L.mapbox.map('map-admin', 'mapbox.streets', {
  attributionControl: false
});

for (var i = 0; i < data.length; ++i) {
  var name = data[i][0];
  var email = data[i][1];
  var phone = data[i][2];
  var address = data[i][3];
  var tier = data[i][4];
  var lat = data[i][5];
  var lng = data[i][6];

  var color = null;

  switch (tier) {
    case 'Upper tier':
      color = '#009933';
      break;
    case 'Middle tier':
      color = '#FFCC00';
      break;
    case 'Lower tier':
      color = '#FF3300';
      break;
  }

  var marker = L.marker(new L.LatLng(lat, lng), {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': color
    }),
  });
  marker.bindPopup('<span class="marker-title">' + name + '</span><br>' + email + '<br>' + phone + '<br>' + address + '<br>' + tier);
  marker.addTo(map);
  markers.push(marker);
}

var group = new L.featureGroup(markers);
map.fitBounds(group.getBounds());
