Template.stripes_list.helpers({
	stripes: function () {
		return Stripes.find();
	}
});

Template.current_stripe.helpers({
	stripe: function () {
		return Stripes.findOne({_id: Session.get('current_stripe')});
	} 
});

Template.stripe.helpers({
	is_selected: function () {
		if (Session.get('current_stripe') == this._id) {
			return 'is_selected';
		}
		return '';
	}
});

Template.stripes_list.events({
	'click #add-stripe' : function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		bootbox.prompt("Title?", function(title) {
			if (title === null) {
			} else {
				var id = Stripes.insert({
					title: title
				});
				Session.set('current_stripe', id);
			}
		});
	},
	'click .stripe': function (e) {
		Session.set('current_stripe', this._id);
	}
});

Template.current_stripe.events({
	'click #add-frame': function(e) {
		e.preventDefault();
		
	}
});