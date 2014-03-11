$id = function (id) {
	return document.getElementById(id);
}

Output = function (msg) {
	var m = $id("messages");
	m.innerHTML = msg + m.innerHTML;
}

parseFile = function(file) {
	console.log(file);
	if (file.type.indexOf('image') == 0) {
		var reader = new FileReader();
		reader.onload = function(e) {
			Output("<p><strong>" + file.name + ":</strong><br />" + '<img src="' + e.target.result + '" /></p>' );
		}
		reader.readAsDataURL(file);
	}
}
Template.html5uploader.events({
	'change #fileselect': function (event, template) {
		// fetch FileList object
		var files = event.target.files || event.dataTransfer.files;
		
		// process all File objects
		for (var i=0, f; f=files[i]; i++) {
			console.log("Found a file");
			parseFile(f);
		}
	},
	'dragover #filedrag': function (event, template) {
		// this is needed, don't know why?
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	},
	'drop #filedrag': function (event, template) {
		event.stopPropagation();
		event.preventDefault();
		var files = event.dataTransfer.files;
		
		// process all File objects
		for (var i=0, f; f=files[i]; i++) {
			console.log("Found a file");
			parseFile(f);
		}
	}
});