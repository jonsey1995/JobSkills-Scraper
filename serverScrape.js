var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');//for retrieving html 
var cheerio = require('cheerio');//for navigation around html using jQuery notation
//create an express application
var app     = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());
app.use(express.json());

var jobObj = [
    {
    id:1, 
    url:"https://www.indeed.co.uk/cmp/Daffodil-IT/jobs/Lead-Junior-Website-Developer-59ea7d446bdf1253?q=Junior+Web+Developer&vjs=3",
    }, 
    {
    id:2, 
    url:"https://www.indeed.co.uk/cmp/Crush-Design/jobs/Middleweight-Web-Developer-541331b7885c03cf?q=Web+Developer&vjs=3",
    },
    {
    id:3,
    url:"https://www.indeed.co.uk/cmp/Monigold-Solutions/jobs/Graduate-Web-Software-Engineer-a5787dc322c0ca36?q=Web+Developer&vjs=3",
    },
    {
    id:4,
    url:"https://www.indeed.co.uk/cmp/ZOO-DIGITAL-GROUP-PLC/jobs/Web-Developer-5cdde1c3b0b7b8d0?q=Web+Developer&vjs=3",
    },
    {
    id:5,
    url:"https://www.indeed.co.uk/viewjob?jk=9cc3d8c637c41067&q=Web+Developer&l=Sheffield&tk=1cf5di52e9u0ocam&from=web&vjs=3",
    }
];


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
    function scrapeFinished(){console.log("all websites scraped!");};
    var itemsProcessed = 0;   

    jobObj.forEach(function(item){
        var newJob = new Object;
        request(item.url, function(err, res, html){

            if(!err){

                var $ = cheerio.load(html);
                
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

                
                itemsProcessed++;
                console.log(item.url + " scraped");  
                
                if(itemsProcessed === jobObj.length){
                scrapeFinished();

                fs.writeFile('output.json', JSON.stringify(jobs, null, "\t"), function(err){ 
                if(!err){console.log("output.json file written")}
                })
                }
            }      
        })
        jobs.push(newJob);           
    })

    
})

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function










app.listen(8080, function(){
    console.log('Magic happens on port 8080');
});


exports = module.exports = app;