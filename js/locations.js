
// Get location data from Yelp via an API call
var yelp_url = 'https://api.yelp.com/v3/businesses/search?term=hotel&latitude=51.513193&longitude=-0.180795';

// Proxy to bypass CORS restriction
var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';

var locations = [];

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
	for (var i = 0; i < hotels.length; i++) {

		vm.places.push({
			title: hotels[i].name, 
			location: hotels[i].coordinates,
			phone: hotels[i].phone, 
			rating: hotels[i].rating,
			id: i
		});
	}
	CreateHotelMarker();

}).fail(function(response){
	alert("Failed to get Yelp Data. Please reload");
});




/*
var locations = [
	{
		name: 'Park Grand London Lancaster Gate', 
		address: '14-16 Craven Hill, Lancaster Gate, London W2 3DU, England',
		coords: {lat: 51.513193, lng: -0.180795},
		city: 'London', 
		id: '0'
	}, 
	{
		name: 'Park Plaza Westminster Bridge', 
		address: '200 Westminster Bridge Road, London SE1 7UT, England', 
		coords: {lat: 51.500957, lng: -0.116686}, 
		city: 'London', 
		id: '1'
	}, 
	{
		name: 'Hilton London Paddington', 
		address: '146 Praed St, London W2 1EE, England',
		coords: {lat: 51.51587, lng: -0.190208}, 
		city: 'London', 
		id: '2'
	}, 
	{
		name: 'The Nadler Kensington', 
		address: '25 Courtfield Gardens, Kensington, London, England', 
		coords: {lat: 51.493106, lng: -0.190208}, 
		city: 'London', 
		id: '3'
	}, 
	{
		name: 'Rosewood London', 
		address: '252 High Holborn, London WC1V 7EN, England',
		coords: {lat: 51.517330, lng: -0.118097}, 
		city: 'London', 
		id: '4'
	}
];
*/