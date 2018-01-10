/*
 * declare map as a global variable
 */
const apiUrl =  {
  iss: 'http://api.open-notify.org/iss-now.json',
  astro: 'http://api.open-notify.org/astros.json'
}
let astros = '';
let ISS = {
  marker: '',
  map: ''
}

const image = {
  url: 'assets/iss.svg',
  scaledSize: new google.maps.Size(60, 60), // scaled size
};

const ISSTracker = (function () {
  let addMap = function () {
    google.maps.event.addDomListener(window, "load", function () {
      ISS.map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(33.808678, -117.918921),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      _createMarker();
    });
  }

  /**
   * Create a marker image
   */
  let _createMarker = function () {
    ISS.marker = _handleMarkerEvent({
      position: new google.maps.LatLng(33.808678, -117.918921),
      map: ISS.map,
      icon: image
    }, astros);
  }

  /**
   * Add on click event on the marker to show
   * the Astro who is riding in the ISS
   *
   */
  let _handleMarkerEvent = function (options, html) {
    let infoWindow = new google.maps.InfoWindow();
    let marker = new google.maps.Marker(options);
    if (html) {
      google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return marker;
  }

  /**
   * Get realtime postiion of ISS and update in the marker..
   */
  let getISSPosition = function() {
    $.ajax({
      url: apiUrl.iss,
      success: function (result) {
        let panPoint = new google.maps.LatLng(result.iss_position.latitude, result.iss_position.longitude);
        ISS.marker.setPosition(panPoint);
        ISS.map.panTo(panPoint);
      }
    });
  }

  /**
   * Get the people riding in ISS
   */
  let getAstros = function() {
    fetch(apiUrl.astro).then(function(data){
      return data.json();
    })
    .then(function(data) {
      astros = `<p>Who are riding in ISS?</p><ul>`;
      data.people.forEach(function(each) {
        astros += `<li>${each.name}</li>`;
      });
      astros += '</ul>'
    })
  }

  /**
   * Render Map and track iss realtime
   */
  let render = function() {
    getAstros();
    addMap();
    setInterval(function () {
      getISSPosition();
    }, 1000);
  }
  return {
    render: render
  }
})();