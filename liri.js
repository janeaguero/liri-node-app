var keys = require("./keys.js");
var Twitter = require("twitter");
var spotifyAPI = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new spotifyAPI({
  id: "34e84d93de6a4650815e5420e0361fd3",
  secret: "5162cd8b5cf940f48702dffe096c2acb"
});

var artistNames = function(artist) {
  return artist.name;
};

var getSpotify = function(songName) {
  if (songName === undefined) {
    songName = "Despacito";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Oh dear, you made an error: " + err + ", try better next time!");
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        break;
      }
    }
  );
};

var getTweets = function() {
  var client = new Twitter(keys);

  var params = {
    screen_name: "GOOD_kanyewest"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};

var getMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "The Big Lebowski";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=40e9cece";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
    }
  });
};

var doItLiri = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var array = data.split(",");

    if (array.length === 2) {
      pick(array[0], array[1]);
    }
    else if (array.length === 1) {
      pick(array[0]);
    }
  });
};

var pick = function(caseData, functionData) {
  switch (caseData) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      getSpotify(functionData);
      break;
    case "movie-this":
      getMovie(functionData);
      break;
    case "do-it-liri":
      doItLiri();
      break;
    default:
      console.log("Here's what I found on Wikipedia:");
      console.log('https://en.wikipedia.org/wiki/Rickroll');
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);