/*
 * declare map as a global variable
 */
var map;
var url = 'http://api.open-notify.org/iss-now.json';


/*
 * use google maps api built-in mechanism to attach dom events
 */
google.maps.event.addDomListener(window, "load", function () {
    /*
     * create map
     */
    var map = new google.maps.Map(document.getElementById("map_div"), {
        center: new google.maps.LatLng(33.808678, -117.918921),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var marker = createMarker({
        position: new google.maps.LatLng(33.808678, -117.918921),
        map: map,
        icon: "http://www.hta.org/images/gps_satellite_icon-small.png"
    }, "<p>ISS Satellite.</p>");
    /*
     * create infowindow (which will be used by markers)
     */
    var infoWindow = new google.maps.InfoWindow();

    /*
     * marker creater function (acts as a closure for html parameter)
     */
    function createMarker(options, html) {
        var marker = new google.maps.Marker(options);
        if (html) {
            google.maps.event.addListener(marker, "click", function () {
                infoWindow.setContent(html);
                infoWindow.open(options.map, this);
            });
        }
        return marker;
    }
    function getISSPosition() {
        $.ajax({
            url: url,
            success: function (result) {
                var panPoint = new google.maps.LatLng(result.iss_position.latitude, result.iss_position.longitude);
                marker.setPosition(panPoint);
                map.panTo(panPoint);
            }
        });

    }

    setInterval(function () { getISSPosition(); }, 1000);
    /*
     * add markers to map
     */

});