var express = require('express');
var fs = require('fs');
var request = require('request');//for retrieving html 
var rp = require('request-promise');  // request behaviour defined by options object, next step .then 
var cheerio = require('cheerio');//for navigation around html using jQuery notation
//create an express application
var app     = express();
app.use(express.json());


let inputJSON = fs.readFileSync("jobObj.json");
let jobObj = JSON.parse(inputJSON);
//app.get request for path route /scrape, 
//a callback function sends a response to the browser
//and sends request to url
app.get('/', (req, res) => {
    res.send('<h1>Hey, Welcome to my Job skills finder app!</h1>' + "<h2>"+JSON.stringify(jobObj)+"</h2>")
});

app.put('/jobs/:id', (req, res) => {
    //function for finding job object in the url array
    function findID(c) {
    return c.id === parseInt(req.params.id);
    }
    //find object with matching job id and call it updateUrl
    const updateUrl = jobObj.find(findID);
    updateUrl.url = req.body.url;
    res.send(updateUrl);
    if(!updateUrl) {
        res.status(404).send(`sorry cannot find id ${req.params.id} in the jobObj object`);
    }
});

app.get('/myform', function(req, res){
    
    res.send("<h1>" + `scanning ${jobObj.length} urls for job description text` + "</h1>");
    //make assign input form data to node "url" variable

    //Compnonents for a request counter
    var jobs = new Array; 
    var newJob = new Object;

    var options = {
        uri: "https://www.indeed.co.uk/cmp/Daffodil-IT/jobs/Lead-Junior-Website-Developer-59ea7d446bdf1253?q=Junior+Web+Developer&vjs=3",
        transform: function(body){
            return cheerio.load(body);
        }
    };

        rp(options)
        .then(function ($) {
            $('#job_summary').each(function(){
                    var data = $(this);
                    var textout = data.text();
                    newJob.jobDesc = textout;    
                });

                $('.jobtitle').each(function(){
                    var data = $(this);
                    var jobtitle = data.text();
                    newJob.jobName = jobtitle;
                });
        })
        .then(function(){
            jobs.push(newJob); 
        })
        .then(function() {

            if (newJob.hasOwnProperty("jobName")){
                fs.writeFile('output.json', JSON.stringify(jobs, null, "\t"), function(err){ 
                    if(!err){console.log("output.json file written")}
                }) 
            }
            else console.log("error");
                      
        })                     
})

app.listen(8080, function(){
    console.log('Magic happens on port 8080');
});


exports = module.exports = app;