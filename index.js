//DB - 0 - install and load lowdb
//require vs input
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

let app = express();

//DB - 1 - connect to the DB
const defaultData = { cubes:[] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

//parser json
app.use(express.json());


app.use(express.static('public'));

//add route to get all cubes
app.get('/allCubes',(request,response)=>{
    // fetch from the lowdb
    db.read()
      .then(()=>{
          let obj = {data: db.data.cubes}
          response.json(obj)
      })
});

//2. add a route on server, that is listening for a post request
app.post('/saveCube',(request,response)=>{
    console.log(request.body);
    let cube = request.body;

    // add value to the DB
    db.data.cubes.push(cube);
    db.write()
      .then(()=>{
          response.json({
            message:"success"
          });
      })
});

app.listen(8000, () => {
    console.log('Listening at http://localhost:8000');
});
