var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/nintendoScraper", {
  useMongoClient: true
});

// Routes
app.get("/reset", function(req, res) {
  db.Article.remove({}, function(err) { 
      console.log('collection removed') 
    });
});

var howMany =0;
// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) 
{
  howMany = 0;
  // First, we grab the body of the html with request
  axios.get("http://www.nintendolife.com/news/").then(function(response) 
  {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var howMany = 0;
    $("div.item-wrap").each(function(i, element) 
    {
      var result = {};
      var image =$(element).children("div.image").children("a.img").find("img").attr("src");
      var link = $(element).children("div.info").children("div.info-wrap").children("p.heading").children("a.accent-hover").attr("href");
      var title = $(element).children("div.info").children("div.info-wrap").children("p.heading").children("a.accent-hover").children("span.accent-hover").text();
      var text = $(element).children("div.info").children("div.info-wrap").children("p.text").text();
      // Save these results in an object that we'll push into the results array we defined earlier
      result.image = image || "N/A";
      result.title = title || "N/A";
      result.link = "http://www.nintendolife.com/" + link;
      result.story = text || "N/A";
      db.Article.create(result, function(err, data)
      {
        if(err)
        {
            console.log("Something wrong when updating data!");
        }
        else
        {
          howMany++;
          //res.json(data);
        }
      });
    });
  });
  res.send("You've grabbed the newest" + howMany + " articles.")
});

// Route for getting all Articles from the db
app.get("/scraperesults", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({"saved":false})
    .then(function(dbScraped) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbScraped);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({"saved":true})
    .then(function(dbScraped) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbScraped);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/save/:id", function(req, res) {
  console.log("savedit" + req.params.id );
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOneAndUpdate({ _id: req.params.id }, {$set:{saved:true}},{new:true},function(err, dbArticle)
  {
    if(err)
    {
        console.log("Something wrong when updating data!");
    }
    else
    {
      res.json(dbArticle);
    }
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/note/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      
      res.json(dbArticle);
    })
    .catch(function(err) {
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});