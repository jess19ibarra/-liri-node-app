require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var action = process.argv[2];
var value = process.argv.slice(3).join(" ");

switch (action) {
    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "concert-this":
        concertThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
};

// gets song name and puts it into the spotify API
function spotifyThisSong() {
    console.log(input)
    if (!input) { input = "The Sign By Ace of Base" }

    spotify.search({
        type: 'track',
        query: value
    }, function (err, data) {
        if (err) {
            return console.log('There was an Error: ' + err);
        }
        console.log("\n");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Song URL: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album Name: " + data.tracks.items[0].album.name);
    });
};

// gets artist name and finds nearest concert
function concertThis() {
    axios
        .get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Time of Event: " + moment(response.data[0].venue.datetime).format("MM/DD/YYYY"));
        })
        .catch(function (error) {
            console.log(error);
        });
}

// gets movie info from OMDB
function movieThis() {
    if (value === "") {
        value = "Mr. Nobody"
    };

    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(url).then(
        function (response) {

            console.log("Movie Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Languages: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

        }).catch(function (error) {
            console.log(error);
        });

};

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        data = data.split(",");
        value = data[1];
        spotifyThisSong();
    });
}