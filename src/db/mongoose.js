const mongoose = require('mongoose')
const uri = "Mongodb url";

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
        uri,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

  } catch (e) {
    console.log("could not connect");
  }
