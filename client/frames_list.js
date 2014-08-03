Template.frames_list.events = {
	'click #delete-frame': function (e) {
		e.stopPropagation();
		e.preventDefault();
		console.log(this);
		//Images.remove(this._id);

	},
	'click': function (e) {
		Session.set('current_image', this._id);

	},
	/* draggin image to a strip*/
	'dragstart .frame_thumb': function (e) {
		e = e.originalEvent;
		e.dataTransfer.setData('text/image_id', this._id);
	},

	/* dropping an imported image */
	'dragenter': function (e) {
		e.stopPropagation();
		e.preventDefault();
		$(e.target).find('.drop_zone').addClass('drop_zone-hover');
	},
	'dragover': function (e) {
		$(e.target).find('.drop_zone').addClass('drop_zone-hover');
		e.stopPropagation();
		e.preventDefault();
	},
	'drop': function (e) {
		e.stopPropagation();
		e.preventDefault();

		var files = e.originalEvent.dataTransfer.files;

		for (var i = 0, f; f = files[i]; i++) {
			var file_id = Images.insert(f, function (err, fileObj) {
			});
		}
	}
};

Template.image_list.images = function () {
	return Images.find({}, {sort:[['uploadAt', 'desc']]});
};
