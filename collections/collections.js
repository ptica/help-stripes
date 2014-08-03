Stripes = new Meteor.Collection('stripes');
Frames  = new Meteor.Collection('frames');
Strings = new Meteor.Collection('strings');

var imageStore = new FS.Store.FileSystem("images", {});

Images = new FS.Collection("images", { stores: [imageStore] });
