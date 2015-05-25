// YOUR CODE HERE:

var app = {
};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  $('#main').on('click', '.username', function () {
    app.addFriend();
  });
  $('#main').on('submit', '.submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    app.handleSubmit();
  });
};

app.send = function(message) {
  $.ajax({
  // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    // roomname: '8th floor',
    // text: message,
    // username: 'not anonymous',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function() {

  $.ajax({
  // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages received');
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages');
    }
  });

};

app.clearMessages = function() {
  $("#chats").empty();
};

app.addMessage = function(message) {
  var $newChat = $("<div class='chat'></div>");
  $newChat.append("<span class='username'>" + message.username + "</span>");
  $newChat.append("<span>" + message.text + "</span>");

  $("#chats").append($newChat);
};


app.addRoom = function(room) {
  var $newRoom = $('<div class=' + room + '>' + room + '</div>');
  $("#roomSelect").append($newRoom);
};

app.addFriend = function () {

};

app.handleSubmit = function () {
  var text = $('#message').val();
  debugger;
  app.send(text);
}

// $(document).ready(function () {

//   app.init();
// });






