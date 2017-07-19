var express = require("express");
var mongoose = require("mongoose");



var schema = new mongoose.Schema({
    question: String,
    answer: String
});
schema.index({ question: 'text' });
//multi field index
//schema.index({ question: 'text', 'profile.something': 'text' });

//Or if you want to include all string fields in the index, use the '$**' wildcard:
// schema.index({'$**': 'text'});

var MyModel = mongoose.model("faq", schema);

// write value:
//
// var newEntry = new MyModel({
//     question: "what is your name",
//     answer: "my name is Ada"
// })
// newEntry.save();

var app = express();

app.use("/webhook", function (req, res, next) {

    console.log("request: ", req);

    MyModel.find({ $text: { $search: req.query.q } })
        // .skip(20)
        // .limit(10)
        .exec(function (err, data) {
            if (!err) {
                console.log("data: ", data);
                res.send(data)
            } else {
                console.log("err: ", err);
                res.send("error");
            }
        });
})

app.use('/abc',function (req, res, next) {
    res.send("abc working");
});

app.listen(3000, function () {
    console.log("listening to 3000");
})

/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = "mongodb://abc:abc@ds163672.mlab.com:63672/test-db";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////