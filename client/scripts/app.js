// YOUR CODE HERE:

var app = {

};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.allRooms = {};

app.init = function() {
  $('#main').on('click', '.username', function (event) {
    app.addFriend($(this).val());
  });
  $('form').submit(function (event) {
    //event.preventDefault();
    event.stopPropagation();
    app.handleSubmit();
  });
  $('#roomSelect').on('click', '.chatroom', function (event) {
    var selector = $(this).text();
    $('.chat').hide();
    $('#chats').find('.'+selector).parent().show();

  })
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

      for (var key in app.allRooms) {
        app.addRoom(key);
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
  $("#roomSelect").empty();
};

app.addMessage = function(message) {
  var $newChat = $("<div class='chat'></div>");
  //if (message.username && message.username.match(/.*[<>&'"].*/)) { message.username = 'invalid'; }
  var username = _.escape(message.username);
  $newChat.append("<span class='username'>" + username + "</span>");

  //if (message.text && message.text.match(/.*[<>&'"].*/)) { message.text = 'invalid'; }
  var words = _.escape(message.text);
  $newChat.append("<span class='words'>" + words + "</span>");

  //if (message.roomname && message.roomname.match(/.*[<>&'"].*/)) { message.roomname = 'invalid'; }
  var roomname = _.escape(message.roomname);
  $newChat.append("<span class="+ roomname + ">" + roomname + "</span>");
  app.allRooms[roomname] = roomname;


  $("#chats").append($newChat);
};


app.addRoom = function(room) {
  var $newRoom = $('<div class="chatroom ' + room + '">' + room + '</div>');
  $("#roomSelect").append($newRoom);
};

app.addFriend = function (name) {
  var $newFriend = $("<div class='friend'>"+ name + "</div>");

  $("#friendList").append($newFriend);
};

app.handleSubmit = function () {

  var message = {};
  message.text = $('#message').val();
  message.roomname = $('.currentRoom').val();
  message.username = location.search.slice(10);


  app.send(message);
}

// app.showMessages = function () {
//   app.clearMessages();

//   for (var i = 0; i < app.messages.results.length; i++) {
//     app.addMessage(app.messages.results[i]);
//   }
// }

$(document).ready(function () {

  app.fetch();
  setInterval(app.fetch, 10000);
  // app.showMessages();
  app.init();
});






