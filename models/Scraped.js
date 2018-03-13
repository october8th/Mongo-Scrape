var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ScrapedSchema = new Schema({
  // `iamge` is required and of type String
  image: {
    type: String,
    required: true
  },
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Scraped = mongoose.model("Scraped", ScrapedSchema);

// Export the Article model
module.exports = Scraped;
