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

function showSaved(data)
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
    myHTML += "<a href='#' data-id='" + data[i]._id + "' class='btn btn-default'>Comment</a>";
    myHTML += "<a href='#' data-id='" + data[i]._id + "' class='btn btn-danger'>Delete Article</a></div></div>";
    $("#main").append(myHTML);
    //.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].image +data[i].link + data[i].story + "<br />" + "</p>");
  };
};

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
};

// Whenever someone views saved articles
$(document).on("click", "#saved-link", function() 
{
  // Now make an ajax call for the Articles
  $.ajax({
    method: "GET",
    url: "/saved"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      showSaved(data);
      });
});

// Whenever someone views scraped articles
$(document).on("click", "#home-but", function() 
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
});

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

// add a new note to an article
$(document).on("click", ".btn-success", function() 
{
  $.ajax({
    method: "GET",
    url: "/save/" + $(this).data("id") 
  })
    // With that done, add the note information to the page
    .then(function(data){
      getNewArticles();
    });
});

function showNotesModal(data)
{$("#note-section").empty();
  var myHTML = "<div><h5> Notes: </h5></div>";
  if(data.note.length)
  {
    for (var i = 0; i < data.note.length; i++)
    {
      console.log(data.note[i]);
      myHTML += "<div class='border border-light'>"
      myHTML += "<div class='anotetitle text-white'><p>" + data.note[i].title + "</p></div>";
      myHTML += "<div class='anotebody text-white'><p>" + data.note[i].body + "</p></div>";
      myHTML += "<a href='#' data-id='" + data.note[i]._id + "' class='btn btn-warn'>Delete Note</a></div></div></div>";
    }
  }
  else
  {
    myHTML += "<div><h5> No notes posted yet </h5></div>";
  }
  myHTML += "<div><form>"; // send the form to update a note
  myHTML += "<div class='form-group row'>";
  myHTML += "<label for='title'>Title:</label>";
  myHTML += "<input type 'text' class='form-control' id='notetitle' placeholder='Title' name='notetitle' required></div>";
  myHTML += "<div class='form-group row'>";
  myHTML += "<label for='description'>Add a note:</label>";
  myHTML += "<textarea class='form-control' id='notebody' rows='4' name='notebody' required></textarea></div>";
  myHTML += "<input type='submit' value='Add New Note' id='addNote' data-id='" + data._id + "'></form><div>";
  $("#note-section").html(myHTML);
}

var currentID;

//view the notes
$(document).on('click', '.btn-default', function() 
{
  // Empty the notes from the note section
  
  var modal = $("#noteIt");
  modal.modal();
  // Now make an ajax call for the Article
  currentID = $(this).data("id");
  $.ajax({
    method: "GET",
    url: "/note/" + $(this).data("id") 
  })
    // With that done, add the note information to the page
    .then(function(data){
    showNotesModal(data)});
});

//add a note
$(document).ready(function() 
{
  $("#addNote").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
  // Empty the notes from the note section
  var modal = $("#noteIt");
  modal.modal();
  var thisID = $(this).data("id");
  console.log($("#notetitle").val());
  console.log($("#notebody").val());
  console.log(document.getElementById("notebody").val());
  // Now make an ajax call for the Articles
  $.ajax({
    method: "POST",
    url: "/save-note/" +  thisID,
    data: {
      // Value taken from title input
      title: $("#notetitle").val(),
      // Value taken from note textarea
      body: $("#notebody").val(),
    }
  })
    // With that done, add the note information to the page
    .then(
      $.ajax({
        method: "GET",
        url: "/note/" + currentID
      }))
    // With that done, add the note information to the page
    .then(function(data){
    showNotesModal(data)});
  });
});

//delete a note
$(document).on('click', '.btn-warn', function() 
{
  // Empty the notes from the note section
  $("#note-section").empty();
  var modal = $("#noteIt");
  modal.modal();
  // Now make an ajax call for the Articles
  $.ajax({
    method: "GET",
    url: "/delete/" + $(this).data("id") 
  })
    // With that done, add the note information to the page
    .then(
      $.ajax({
        method: "GET",
        url: "/note/" + currentID
      }))
    // With that done, add the note information to the page
    .then(function(data){
    showNotesModal(data)});
});