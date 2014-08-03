var MY = {};

Template.current_stripe.helpers({
	stripe: function () {
		return Stripes.findOne({_id: Session.get('current_stripe')});
	},
	frames: function () {
		var i = 1;
		return Frames.find({stripe_id: this._id}, {sort:[['created_on', 'asc']]}).map(function(doc, index, cursor) {
			if (doc.index > 0) {
				i = doc.index;
			}
			var new_doc = _.extend(doc, {index: i});
			i++;
			return new_doc;
		});
	}
});

Template.current_stripe.events({
	'click #delete-stripe': function (e) {
		e.stopPropagation();
		e.preventDefault();
		Stripes.remove(this._id);
	},


	'dragenter .new-frame': function (e) {
		e.stopPropagation();
		e.preventDefault();
		e.dropEffect = 'link';
		$(e.target).closest('.new-frame').addClass('active_drop_zone');
	},
	'dragleave .new-frame': function (e) {
		e.stopPropagation();
		e.preventDefault();
		$(e.target).closest('.new-frame').removeClass('active_drop_zone');
	},
	'dragover .new-frame': function (e) {
		e.stopPropagation();
		e.preventDefault();
	},
	'drop .new-frame': function (e) {
		e.stopPropagation();
		e.preventDefault();
		e = e.originalEvent;
		var stripe = this;
		var image_url = e.dataTransfer.getData("url") || e.dataTransfer.getData("text/uri-list");
		var html = e.dataTransfer.getData("text/html");
		var image_id = e.dataTransfer.getData("text/image_id");
		var frame = {};
		frame.stripe_id = stripe._id;
		frame.image_id  = image_id;
		frame.created_on = new Date().getTime();
		var frame_id = Frames.insert(frame);

		Session.set('current_frame', frame_id);
	},
	'click .frame': function (e) {
		//setTimeout(function () {Session.set('current_frame', this._id)}, 400);
		Session.set('current_frame', this._id);
	},

	// moving BACKGROUND
	'mousedown img.background': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = e.x;
		e.target.dragstartY = e.y;
	},
	'mousemove img.background': function (e) {
		e = e.originalEvent;
		if (e.target.dragstartX) {
			delta_x = e.x - e.target.dragstartX;
			delta_y = e.y - e.target.dragstartY;
			$(e.target).animate({top:'+='+delta_y, left:'+='+delta_x}, 0);
			$(e.target).data('left', $(e.target).css('left'));
			$(e.target).data('top',  $(e.target).css('top'));

			e.target.dragstartX = e.x;
			e.target.dragstartY = e.y;
		}
	},
	'mouseup img.background': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = null;
		e.target.dragstartY = null;
	},

	// moving ARROW BOX
	'dblclick .arrow_box': function (e) {
		Frames.update(this._id, {$set: {arrow_css:'display:none'}});
	},

	'mousedown .arrow_box': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = e.x;
		e.target.dragstartY = e.y;
	},
	'mousemove .arrow_box': function (e) {
		e = e.originalEvent;
		if (e.target.dragstartX) {
			delta_x = e.x - e.target.dragstartX;
			delta_y = e.y - e.target.dragstartY;
			$(e.target).animate({height:'-='+delta_y, left:'+='+delta_x}, 0);

			e.target.dragstartX = e.x;
			e.target.dragstartY = e.y;
		}
	},
	'mouseup .arrow_box': function (e) {
		e.target.dragstartX = null;
		e.target.dragstartY = null;
		Frames.update(this._id, {$set: {arrow_css:e.target.style.cssText}});
	},

	// moving INDEX badge
	'dblclick .index': function (e) {
		e = e.originalEvent;
		e.stopPropagation();
		e.preventDefault();
		//Frames.update(this._id, {$set: {index:1}});
		Frames.update(this._id, {$set: {index:parseInt($(e.target).text(),10)+1}});
	},
	'mousedown .index': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = e.x;
		e.target.dragstartY = e.y;
	},
	'mousemove .index': function (e) {
		e = e.originalEvent;
		if (e.target.dragstartX) {
			delta_x = e.target.dragstartX - e.x;
			delta_y = e.y - e.target.dragstartY;
			$(e.target).animate({bottom:'-='+delta_y, right:'+='+delta_x}, 0);

			e.target.dragstartX = e.x;
			e.target.dragstartY = e.y;
		}
	},
	'mouseup .index': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = null;
		e.target.dragstartY = null;
		Frames.update(this._id, {$set: {index_css:e.target.style.cssText}});
	},

	// moving TOOLTIP string
	'dblclick .string': function (e) {
		e = e.originalEvent;
		e.stopPropagation();
		e.preventDefault();
		Strings.remove(this._id);
	},
	'mousedown .string': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = e.x;
		e.target.dragstartY = e.y;
	},
	'mousemove .string': function (e) {
		e = e.originalEvent;
		if (e.target.dragstartX) {
			delta_x = e.target.dragstartX - e.x;
			delta_y = e.y - e.target.dragstartY;
			$(e.target).animate({bottom:'-='+delta_y, left:'-='+delta_x}, 0);

			e.target.dragstartX = e.x;
			e.target.dragstartY = e.y;
		}
	},
	'mouseup .string': function (e) {
		e = e.originalEvent;
		e.target.dragstartX = null;
		e.target.dragstartY = null;
		Strings.update(this._id, {$set: {string_css:e.target.style.cssText}});
	},


	'wheel img.background': function (e) {
		e = e.originalEvent;
		var $target = $(e.target);
		$target.css('max-width', 'none');
		var settings = {};
		settings.zoom = 0.05;
		var deltaY = -e.wheelDelta;
		var width  = $target.data('width')  || $target.width();
		var height = $target.data('height') || $target.height();

		var old_left = $target.data('left') || 0;
		var old_top  = $target.data('top') || 0;

		var offsetParent = $target.parent().offset();
		var offsetX = e.pageX - offsetParent.left;
		var offsetY = e.pageY - offsetParent.top;

		var bgCursorX = offsetX - old_left;
		var bgCursorY = offsetY - old_top;
		var bgRatioX = bgCursorX/width;
		var bgRatioY = bgCursorY/height;
		//console.log(e);
		//console.log(offsetX, (offsetX-old_left)/width, width);
		//console.log('bgCursorX:' + bgCursorX + ' next iter:' + (bgCursorX*1.05));


		// Update the bg size by constant px increments/decrements
		if (deltaY < 0) {
			// zoom in / top of the weel turned to me
			width += width*settings.zoom;
			height += height*settings.zoom;
		} else {
			width -= width*settings.zoom;
			height -= height*settings.zoom;
		}

		// Take the percent offset and apply it to the new size:
		var left = offsetX - (width * bgRatioX);
		var top  = offsetY - (height * bgRatioY);

		e.target.style.height = height + 'px';
		e.target.style.width  = width + 'px';
		e.target.style.top  = top + 'px';
		e.target.style.left  = left + 'px';

		$target.data('left', left);
		$target.data('top', top);
		$target.data('width', width);
		$target.data('height', height);
	}
});

Template.frame.helpers({
	is_selected: function () {
		if (Session.get('current_frame') == this._id) {
			return 'is_selected';
		}
		return '';
	},
	image: function () {
		return Images.findOne({_id: this.image_id});
	},
	strings: function () {
		return Strings.find({frame_id: this._id});
	}
});

Template.current_stripe.rendered = function() {
	document.title = 'HELP';

	// GLOBAL!!! keyboard actions
	$(window).on('keydown', function(e) {
		if ($('.bootbox').length) return;
		if (!Session.get('current_frame')) return;

		if (e.which == 'D'.charCodeAt(0)) {
			e.stopImmediatePropagation();
			e.preventDefault();

			if (Session.get('current_frame')) {
				Frames.remove(Session.get('current_frame'));
				Session.set('current_frame', {});
			}
		}
		if (e.which == 'T'.charCodeAt(0)) {
			e.stopImmediatePropagation();
			e.preventDefault();

			if (Session.get('current_frame')) {
				bootbox.prompt("Tooltip text?", function(title) {
					if (title === null) {
					} else {
						var id = Strings.insert({
							frame_id: Session.get('current_frame'),
							title: title
						});
					}
				});
			}
		}
		if (e.which == 'L'.charCodeAt(0)) {
			e.stopImmediatePropagation();
			e.preventDefault();

			if (Session.get('current_frame')) {
				var created_on = Frames.findOne();
				var current = Frames.findOne(Session.get('current_frame'),{created_on:1, stripe_id:1});
				console.log(current);
				var previous = Frames.findOne({created_on: {$lt: current.created_on}, stripe_id:current.stripe_id}, {sort:[['created_on', 'desc']], limit: 1});
				console.log(previous);
				Frames.update(Session.get('current_frame'), {$set: {created_on: previous.created_on-1}});
			}
		}
	});
};

Template.frame.rendered = function () {
	// css changes observer
	var MutationObserver = window.WebKitMutationObserver;
	MY.image_observer = new MutationObserver(_.debounce(function(mutations) {
		var mutation = mutations.pop();
		if (mutation.attributeName == 'id') return;
		//if (mutation.type != 'attributes')
		if (mutation.target.tagName == 'IMG') {
			Frames.update(Session.get('current_frame'), {$set: {image_css:mutation.target.style.cssText}});
			//console.log('new', mutation.target.style.cssText);
		}
	}, 400));

	var config = { attributes: true, childList: false, characterData: false, attributeOldValue: false, attributeFilter: ['style'] };
	MY.image_observer.observe(this.find('img.background'), config);


};
