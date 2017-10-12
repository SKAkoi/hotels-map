
// Get location data from Yelp via an API call
var yelp_url = 'https://api.yelp.com/v3/businesses/search?term=hotel&latitude=51.513193&longitude=-0.180795';

// Proxy to bypass CORS restriction on Yelp API
var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';

var settings = {
  "async": true,
  "crossDomain": true,
  "url": cors_anywhere_url + yelp_url,
  "method": "GET",
  "headers": {
    "authorization": "Bearer YPapk1tkn7-TcgqndTXSYwFjF54S0NudLnGqVaWVBHk_tR05cKvcrzbHe5XRmPVUANhlkpVxRUUYD2oQd6aWJmbg2dzAKfAjirbvmxdY6HG6amQgaSANiFRVr0DUWXYx",
    "cache-control": "no-cache",
  }
};
console.log("ajaxrequest");

$.ajax(settings).done(function(response) {
	console.log("ajaxrequestsuccess");
	var hotels = response.businesses;

	// Loop through the data and push to our viewmodel places array
	for (var i = 0; i < hotels.length; i++) {

		vm.places.push({
			title: hotels[i].name, 
			location: hotels[i].coordinates,
			phone: hotels[i].phone, 
			rating: hotels[i].rating,
			id: i
		});
	}
	// Create map markers using the data
	CreateHotelMarker();

}).fail(function(response){
	alert("Failed to get Yelp Data. Please reload");
});
