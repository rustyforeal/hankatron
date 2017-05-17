var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  var form = new formidable.IncomingForm();
  form.multiples = true;

  form.uploadDir = path.join('/', 'xxxxxxxxx');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() {
    res.end('success');
  });

  form.parse(req);

});


app.get('/getfiles', function(req,res){
  var file_location = "/xxxxxxxx"
  fs.readdir(file_location, function (err, files) {
	if (err) {
		throw err;
	}
    	data = [];
	for (var j = 0; j<files.length; j++) {
		data.push(files[j]);
	}
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data));

});
});


app.post('/rundigga', function(req, res) {
	console.log('python invoke request received');
	res.connection.setTimeout(0); // this could take a while
	var post_form = new formidable.IncomingForm();
	post_form.parse(req, function (err, fields, files) {
		file_to_process = "xxxxxxx" + Object.keys(fields)[0];
		console.log(file_to_process);
		var python = require('child_process').spawn(
     			'python',
			     ["/digga.py", file_to_process]
			);
		var output = "";
		python.stdout.on('data', function(data){ output += data });
		python.on('close', function(code){ 
       		if (code !== 0) {
           		return res.send(JSON.stringify(code)); 
      		}
       		return res.end('success');
		});
	});
});


app.get('/getresults', function(req,res) {
	var results_location = "/DOMAINREPORT"
	fs.readdir(results_location, function (err, files) {
		if (err) {
			throw err;
		}
		results = [];
		for (var i = 0; i<files.length; i++) {
			results.push(files[i]);
		}
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(results));

	});

});


app.get('/downfile', function(req,res) {
	console.log('file download request received');
	client_request = req._parsedUrl.query;
	var file = "/DOMAINREPORT/" + client_request;
	console.log(file);
	res.download(file);	 
});

var server = app.listen(8080, function(){
  console.log('Server listening on port 8080');
});
