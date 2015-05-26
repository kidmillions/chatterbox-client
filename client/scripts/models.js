var Message = Backbone.Model.extend({
  // initialize: function(username, text, roomname) {
  //   this.set('username', username);
  //   this.set('text', text);
  //   this.set('roomname', roomname);
  // }

});


var MessageView = Backbone.View.extend({
  render: function() {
    var htmlOld = '<div class="message">' +
    + "<span class='username'>" + _.escape(this.model.get('username')) + ":</span>" +
    + "<span class='message'>" + _.escape(this.model.get('text')) + ":</span>"
    + '</div>';

    var html = "<div class='message'>";
    html+= "<span class='username'>" + _.escape(this.model.get('username')) + "</span>:";
    html+= "<span class='text'>" + _.escape(this.model.get('text')) + "</span>";

    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
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

//app.messages = new Messages(app.fetch());
