import * as functions from 'firebase-functions'
import db from './db'

import * as mongoose from "mongoose"
let dbURI = "mongodb://abc:abc@ds163672.mlab.com:63672/test-db";
mongoose.connect(dbURI);


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

// http example
export const webhook = functions.https.onRequest((req, res) => {

    console.log("req: ", req);
    console.log("req.body: ", req.body);

    MyModel.find({ $text: { $search: req.body.result.resolvedQuery } })
        // .skip(20)
        // .limit(10)
        .exec((err, data: [{ question: String, answer: String }]) => {
            if (!err) {
                console.log("data: ", data);
                res.send({
                    displayText: data[0].answer,
                    speech: data[0].answer
                })
            } else {
                console.log("err: ", err);
                res.send("error");
            }
        });

});


