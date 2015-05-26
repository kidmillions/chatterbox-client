// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {

};
app.send = function(message) {
  $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.dir(data);
      var messagesList = [];
      _.each(data, function(message) {
        var newMessage = new Message(message.username, message.text, message.roomname);
        console.dir(newMessage);
        messagesList.push(newMessage);
      });
      return messagesList;
    },
    error: function(data) {
      console.error('chatterbox: Failed to get messages');
    }
  });
};
