// let express = require('express');

//DB - 0 - install and load lowdb
//require vs input
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

let app = express();


//DB - 1 - connect to the DB

const defaultData = { moodTrackerData:[] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

//parser json
app.use(express.json());

let moodTracker = [];

// app.get('/', function (request, response) {
//   response.send('This is the main page');
// });

//2. add a route on server, that is listening for a post request

app.post('/moodTypes',(request,response)=>{
    console.log(request.body);
    let currentDate = Date();
    let obj = {
        date: currentDate,
        mood: request.body.mood
    }
    // coffeeTracker.push(obj);
    // console.log(coffeeTracker);

    //DB - 2 - add value to the DB
    db.data.moodTrackerData.push(obj);
    db.write()
    .then(()=>{
        response.json({task:"success"});
    })
})

app.use('/', express.static('public'));

app.listen(8000, () => {
    console.log('Listening at localhost:8000');
});

//add route to get all mood track info
app.get('/getMood',(request,response)=>{
    // let obj = {data: moodTracker};

    //DB - 3 - fetch from the DB

    db.read()
        .then(()=>{
            let obj = {data: db.data.moodTrackerData}
            response.json(obj)
        })
})