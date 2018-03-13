// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

function showArticles(data)
{console.log("data length: " + data.length);
  // Empty the notes from the note section
  $("#main").empty();
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var myHTML = "<div class='card' style='width: 70rem;'> <div class='card-body'>";
    myHTML += "<h5 class='card-title'>" + data[i].title + "</h5>";
    myHTML += "<img style='border:1px solid gray;width:150px;height:100px; float:right' src=" + data[i].image +">";
    myHTML += "<p class='card-text'>" + data[i].story+ "</p>";
    myHTML += "<a href='" + data[i].link + "'" +"class='btn btn-primary' target='_blank'>View Article</a>";
    myHTML += "<a href='#' data-id='" + data[i]._id + "' class='btn btn-success'>Save Article</a></div></div>";
    $("#main").append(myHTML);
    //.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].image +data[i].link + data[i].story + "<br />" + "</p>");
  };
}

function getNewArticles()
{
  // Now make an ajax call for the Articles
  $.ajax({
    method: "GET",
    url: "/scraperesults"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      showArticles(data)
    });
}

// Whenever someone scrapes
$(document).on("click", "#scrapeButton", function() 
{
  // Empty the notes from the note section
  $("#scrape-status").empty();
  // Now make an ajax call for the Articles
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      $("#scrape-status").text(data);
      getNewArticles();
      });
});

// Whenever someone saves
$(document).on("click", ".btn-success", function() 
{
  // Empty the notes from the note section
  $.ajax({
    method: "GET",
    url: "/save/" + $(this).data("id") 
  })
    // With that done, add the note information to the page
    .then(function(data){
      console.log(data);
      getNewArticles();
    });
});