var Message = Backbone.Model.extend({
  // initialize: function(username, text, roomname) {
  //   this.set('username', username);
  //   this.set('text', text);
  //   this.set('roomname', roomname);
  // }

});

var MessageView = Backbone.View.extend({
  render: function() {
    var isFriend = app.friends.findWhere({'username': this.model.get('username')});

    var usernameSpan = isFriend ? "<span class='username friend'>" : "<span class='username'>";

    var html = "<div class='message'>";
    html+= usernameSpan + _.escape(this.model.get('username')) + "</span>:";
    html+= "<span class='text'>" + _.escape(this.model.get('text')) + "</span>";

    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  query: '',
  parse: function(data) {

    //pass the collection rooms to the room model
    return data.results;
  }
});

var MessagesView = Backbone.View.extend({
  initialize: function (){
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    var html = '<div>' + '</div>';
    this.$el.html(html);
    this.$el.find('div').append(this.collection.map(function(message) {
      var messageDate = new Date(message.get('createdAt'));

      if(messageDate >= app.cutoff) {
        var messageView = new MessageView({model: message});
        return messageView.render();
      }
    }));
    return this.$el;
  }
});

var Friend = Backbone.Model.extend({
  initialize: function(username) {
    this.set('username', username);
  }
});

var Friends = Backbone.Collection.extend({
  model: Friend
});

var FriendsView = Backbone.View.extend({
  initialize: function (){
    this.model.on('change', this.render, this);
  },
  render: function() {
    var html = '<ul>' + '</ul>';
    this.$el.html(html);
    this.$el.find('ul').append(this.model.map(function(friend) {
      return '<li>' + friend.get('username') + '</li>';
    }));
    return this.$el;
  }
});

var Room = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox'
  ,defaults: {
    roomname: 'lobby',
    name: 'lobby'
  }
  // initialize: function(name) {
  //   this.set('name', name);
  // }
});

var roomList = [];

var Rooms = Backbone.Collection.extend({
  model: Room,
  url: 'https://api.parse.com/1/classes/chatterbox',
  getRooms: function() {
    this.fetch();
  },
  parse: function(response) {
    var rooms = [];
    for (var i = 0; i < response.results.length; i++) {
      if(roomList.indexOf(response.results[i].roomname) === -1) {
         rooms.push({ roomname: response.results[i].roomname });
         roomList.push(response.results[i].roomname);
       }
    }
    return rooms;
  }
});

var RoomView = Backbone.View.extend({
  template: _.template('<li><%=roomname%></li>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
})


var RoomsView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    //this.collection.forEach(this.renderRoom, this);
    var context = this;
    this.$el.append(this.collection.map(function(room) {
      var roomView = new RoomView({model: room});
      return roomView.render();
    }));
    return this.$el;
  },
  renderRoom: function() {
    var roomView = new RoomView({model: Room});
    this.$el.append(roomView.render());
  }
});




