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
    return data.results;
  }
});

var MessagesView = Backbone.View.extend({
  initialize: function (){
    this.model.on('change', this.render, this);
  },
  render: function() {
    var html = '<div>' + '</div>';
    this.$el.html(html);
    this.$el.find('div').append(this.model.map(function(message) {
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
