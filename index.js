//Node.js Webserver more infos at julianzillner.de
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// Port 
var port = 8080;
// Output Colors
var WHITE = '\033[39m';
var RED = '\033[91m';
var GREEN = '\033[32m';


http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    var contentTypesByExtension = {
        '.html': 'text/html',
        '.css':  'text/css',
        '.js':   'text/javascript',
        '.json': 'text/json',
        '.svg':  'image/svg+xml'
    };

    fs.exists(filename, function (exists) {
        if (!exists) {
            console.log(RED + 'FAIL: ' + filename);
            filename = path.join(process.cwd(), '/public/404.html');
        } else if (fs.statSync(filename).isDirectory()) {
            console.log(GREEN + 'FLDR: ' + WHITE + filename);
            filename += '/public/index.html';
        }

        fs.readFile(filename, 'binary', function (err, file) {
            console.log(GREEN + 'FILE: ' + WHITE + filename);
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

        
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) {
                headers['Content-Type'] = contentType;
            }

            response.writeHead(200, headers);
            response.write(file, 'binary');
            response.end();
        });

    });

}).listen(parseInt(port, 10));


console.log(WHITE + 'Webserver is now running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');
//At the public folder, you have a file with the name 404.html, in this file you can programm your 404 error page. 