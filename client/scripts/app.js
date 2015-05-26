// YOUR CODE HERE:

var app = {

};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  $('#main').on('click', '.username', function () {
    app.addFriend($(this).val());
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
      app.clearMessages();
      for (var i = 0; i < data.results.length; i++) {

        app.addMessage(data.results[i]);
      }
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
  if (message.username && message.username.match(/.*[<>&'"].*/)) { message.username = 'invalid'; }
  $newChat.append("<span class='username'>" + message.username + "</span>");

  if (message.text && message.text.match(/.*[<>&'"].*/)) { message.text = 'invalid'; }
  $newChat.append("<span class='words'>" + message.text + "</span>");

  if (message.roomname && message.roomname.match(/.*[<>&'"].*/)) { message.roomname = 'invalid'; }
  $newChat.append("<span class='roomname'>" + message.roomname + "</span>");

  $("#chats").append($newChat);
};


app.addRoom = function(room) {
  var $newRoom = $('<div class=' + room + '>' + room + '</div>');
  $("#roomSelect").append($newRoom);
};

app.addFriend = function (name) {
  var $newFriend = $("<div class='friend'>"+ name + "</div>");

  $("#friendList").append($newFriend);
};

app.handleSubmit = function () {
  var text = $('#message').val();
  debugger;
  app.send(text);
}

// app.showMessages = function () {
//   app.clearMessages();

//   for (var i = 0; i < app.messages.results.length; i++) {
//     app.addMessage(app.messages.results[i]);
//   }
// }

$(document).ready(function () {

  app.fetch();
  // app.showMessages();
  app.init();
});






