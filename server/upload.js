var formidable = Meteor.require('formidable');
var http = Npm.require('http');
var sys  = Npm.require('sys');

var connectHandlers, connect;
connectHandlers = WebApp.connectHandlers;
	
WebApp.connectHandlers.stack.splice(0,0,{
	route: '/upload',
	handle: function (req, res, next) {
		if (req.method === 'POST') {
			var form = new formidable.IncomingForm();
			form.uploadDir =  '.';
			form.parse(req, function (err, fields, files) {
				res.writeHead(200, {'content-type': 'text/plain'});
				res.write('received upload:\n\n');
				res.end(sys.inspect({fields: fields, files: files}));
				
				// fields: from form
				// files has path, name, type
			});
			return;
		}
		// show a message when a user visits /upload
		res.writeHead(200, {'content-type': 'text/html'});
		res.end('OK');
	},
});
