var express = require('express');
var fs = require('fs');
var request = require('request');//for retrieving html 
var cheerio = require('cheerio');//for navigation around html using jQuery notation
//create an express application
var app     = express();

var jobObj = [
    {
    id:1, 
    url:"https://www.indeed.co.uk/cmp/Daffodil-IT/jobs/Lead-Junior-Website-Developer-59ea7d446bdf1253?q=Junior+Web+Developer&vjs=3"
    }, 
    {
    id:2, 
    url:"https://www.indeed.co.uk/cmp/Crush-Design/jobs/Middleweight-Web-Developer-541331b7885c03cf?q=Web+Developer&vjs=3"
    },
    {
    id:3,
    url:"https://www.indeed.co.uk/cmp/Monigold-Solutions/jobs/Graduate-Web-Software-Engineer-a5787dc322c0ca36?q=Web+Developer&vjs=3"
    },
    {
    id:4,
    url:"https://www.indeed.co.uk/cmp/ZOO-DIGITAL-GROUP-PLC/jobs/Web-Developer-5cdde1c3b0b7b8d0?q=Web+Developer&vjs=3"
    },
    {
    id:5,
    url:"https://www.indeed.co.uk/viewjob?jk=9cc3d8c637c41067&q=Web+Developer&l=Sheffield&tk=1cf5di52e9u0ocam&from=web&vjs=3"
    }
];



//app.get request for path route /scrape, 
//a callback function sends a response to the browser
//and sends request to url
app.get('/', (req, res) => {
    res.send('Hey, Welcome to my Job skills finder app!');
});

app.put('/jobs/:id', (req, res) => {
    //function for finding job object in the url array
    function findID(c) {
    return c.id === parseInt(req.params.id);
    }
    //find object with matching job id and call it updateUrl
    const updateUrl = jobObj.find(findID);
    console.log(updateUrl);

    if(!updateUrl) {
        res.send(`sorry cannot find id ${req.params.id} in the jobObj object`);
    }
    
    updateUrl.url = req.body.url;
    res.send(upateUrl);
});

app.get('/myform', function(req, res){
    res.send('Check your console!');
    //res.send(`scanning ${url.length} urls for job description text`);
    //make assign input form data to node "url" variable


    
    //request from url parameter 1 = url, parameter 2 is a callback function
    // that takes 3 parameters an error, response status code and html
    //create an array of objects, set scraped text as jobDesc item in array
    var jobs = [{
    jobName: "",
    jobDesc: ""
    },
    {
    jobName: "",
    jobDesc: ""
    },
    {
    jobName: "",
    jobDesc: ""
    },
    {
    jobName: "",
    jobDesc: ""
    },
    {
    jobName: "",
    jobDesc: ""
    }]
    ;
    
    for (let i=0; i<url.length; i++){
        
        //request module to retrieve url 
        request(url[i].url, function(error, response, html){
            //if no error in request, load body of url
            if(!error){
                //gives us jQuery functionality on loaded html
                var $ = cheerio.load(html);
                
                
                $('#job_summary').each(function(){
                    var data = $(this);
                    var textout = data.text();
                    jobs[i].jobDesc = textout;
                    
                });
                
                $('.jobtitle').each(function(){
                    var data = $(this);
                    var jobtitle = data.text();
                    jobs[i].jobName = jobtitle;
                })
            }
            fs.writeFile('output.json', JSON.stringify(jobs, null, "\t"), function(err){   
            })  
        
            
        })     
    }
    console.log("output.json file written!");
         
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