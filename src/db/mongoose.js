const mongoose = require('mongoose')
const uri = "mongodb+srv://hesam:ofTEWwGZvUozOFCa@cluster0.my7gil9.mongodb.net/?retryWrites=true&w=majority";

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
        uri,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

  } catch (e) {
    console.log("could not connect");
  }
