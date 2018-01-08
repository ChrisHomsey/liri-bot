require("dotenv").config();
var fs = require('fs');

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require('twitter')
var client = new Twitter(keys.twitter);

var request = require('request');

var myTweets = function(){
	var params = {screen_name: 'liri_ch'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  	if (!error) {
	  		console.log("=======================================");
			console.log("Hey Liri, Read My Tweets");
			console.log("=======================================");
	    	
			for (var i=0; i < 20; i++){
	    		console.log(tweets[i].text);
	    		console.log(tweets[i].created_at);
	    		console.log("=======================================");
	    	}
	  	}else{
	  		console.log(error);
	  	}
	});
}

var spotifyThisSong = function(title){
	if(!title){
		title = 'Ace of Base - The Sign';
	}

	spotify
			.search({ type: 'track', query: title })
			.then(function(response) {
				console.log("=======================================");
				console.log("Hey Liri, Spotify this Song.");
				console.log("=======================================");
				console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
				console.log("Title: " + response.tracks.items[0].name);
				console.log("URL: " + response.tracks.items[0].href);
				console.log("Album: " + response.tracks.items[0].album.name);
			})
			.catch(function(err) {
				console.log(err);
		});
}

var movieThis = function(requested){
	request("https://www.omdbapi.com/?t=" + requested + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
		if (error){
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			
		}
		console.log("=======================================");
		console.log("Hey Liri, Movie This.");
		console.log("=======================================");
		var movie = JSON.parse(body);
		console.log('Title: ' + movie.Title);
		console.log('Release Year: ' + movie.Year);
		console.log('IMDB Rating: ' + movie.imdbRating);
		console.log('Rotten Tomatoes Rating: ' + movie.Ratings[1].Value);
		console.log('Country Produced: ' + movie.Country);
		console.log('Language: ' + movie.Language);
		console.log('Plot: ' + movie.Plot);
		console.log('Actors: ' + movie.Actors);

	});
}

function runCommand(command, requested){
	switch (command){
		case 'my-tweets':
			myTweets();
			break;
		case 'spotify-this-song':
			spotifyThisSong(requested);
			break;
		case 'movie-this':
			movieThis(requested);
			break;
		case 'do-what-it-says':
			fs.readFile('./random.txt', 'utf8', function(err, data){
				data = data.split(",");
				command = data[0];
				requested = data[1];
				runCommand(command, requested);
			});
	}
}

runCommand(process.argv[2], process.argv[3]);
