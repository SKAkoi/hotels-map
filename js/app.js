/* This project uses the KnockoutJS MVVM framework to separate data from the view. 
    The data used in here is generated from a call to Yelp's Fusion API in locations.js
    The following functions are modifications of the code in the course instruction:
        initMap()
        populateInfoWindow()
        makeMarker()
        hideMarker()
    Additionally, special thanks to Karol for the help during my 1 on 1 appointments
*/

var map;

var markers = [];

//Initialise map
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.50948,
            lng: -0.1967388
        },
        zoom: 13,
        mapTypeControl: false
    });

    console.log("initMap");
}

function CreateHotelMarker() {

     // Default icon
    var defaultIcon = makeMarkerIcon('ff4000');
    
    // Highlighted icon when the user hovers over it
    var highlightedIcon = makeMarkerIcon('e7b213');

    // Create info window
    var largeInfowindow = new google.maps.InfoWindow();

    // Loop through our view model locations array
    vm.places().forEach(function(place, i){

        var title = place.title;
        var phone = place.phone; 
        var rating = place.rating;
        var lat = place.location.latitude;
        var lng = place.location.longitude;
        var position = new google.maps.LatLng(lat, lng);
        
        // Create a marker using the elements in our viewmodel array
        var marker = new google.maps.Marker({
            title: title,
            phone: phone,
            rating: rating, 
            position: position,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            map: map,
            id: i
        });

        // Push the marker to the markers array
        markers.push(marker);

        place.marker = marker;

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    
    
    });
   console.log(markers);
}

// Populate an infowindow when a marker is clicked
function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Set Animation on clicked marker
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 850);

        // Create street view variable
        var streetViewService = new google.maps.StreetViewService();

        // Radius for street view
        var radius = 50;


        // If a pano is found for the location, compute the position of the streetview image, 
        // heading, and set the pitch for the panorama
        var getStreetView = function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '<br>' + '<span>Rating: ' + marker.rating + '</span>' + '<br>' + marker.phone + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation, 
                    pov: {
                        heading: heading, 
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>'); 
            }
        };
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position,
            radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
        markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

// ViewModel allows for filtering on a list of places, zoom functionality for clicking on a map
function ViewModel() {
    console.log("ViewModel");
    var self = this;
    self.places = ko.observableArray();
    self.address = ko.observable();
    self.location = ko.observable();
    self.phone = ko.observable();
    self.rating = ko.observable();
    self.title = ko.observable();
    self.id = ko.observable();
    self.markers = ko.observableArray(markers);
    self.filter = ko.observable();
    
    //Filters markers from the search field
    this.listFilter = ko.computed(function() {
        return this.places().filter(function(place) {
            var placematch = !self.filter() || place.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
            var id = Number(place.id);
            if (markers[id]) {
                markers[id].setVisible(placematch);
            }
            if (placematch) {
                return place;
            }
        });
    }, this);
    

    self.zoomIn = function() {
        var id = this.id;
        map.setCenter(markers[id].position);
        map.setZoom(15);
        google.maps.event.trigger(markers[id], 'click');
    };
}

var vm = new ViewModel();
ko.applyBindings(vm);


//Error Handling

function googleError() {
    alert("Google Maps has failed to load. Please check your internet connection and try again.");
}
