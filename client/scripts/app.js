var Message = Backbone.Model.extend({

  initialize: function(message) {
    this.set({'message': _.escape(message.text),
      'username': _.escape(message.username),
      'chatroom': _.escape(message.roomname),
      'id':message.objectId});
  },

  defaults: {
    'username': 'anonymous',
    'chatroom': 'general'
  }
});

var Messages = Backbone.Collection.extend({

  model: Message
});

var MessagesView = Backbone.View.extend({
  initialize: function () {},

  render: function () {
    var html = [
      "<div id='main'>",
        "<h1>chatterbox</h1>",
        "<div id='chats'></div>",
        "<div id='friendList'></div>",
        "<div id='roomSelect'></div>",
      "</div>"
    ].join('');

    this.$el.html(html);
    this.$el.find('#chats').append(this.model.map(function(message) {
      var $newChat = $("<div class='chat'></div>");

      $newChat.append("<span class='username'>" + message.get('username') + "</span>");

      $newChat.append("<span class='message'>" + message.get('message') + "</span>");

      $newChat.append("<span class='chatroom'>" + message.get('chatroom') + "</span>");

      return $newChat;
    }));
    return this.$el;
  }
});

var chatroom = new Messages();




// YOUR CODE HERE:

var app = {

};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.chats= {};
app.allRooms = {};
app.userFriends = {};

app.init = function() {

  //Add friend
  // $('#main').on('click', '.username', function (event) {
  //   var selector = $(this).text();
  //   $('#chats').find('div').css({'background-color': '#eee'});
  //   $('#chats').find('.'+selector).parent().css({'background-color': '#ff7'});

  //   if (!($(this).text() in app.userFriends)) {
  //     app.userFriends[$(this).text()] = $(this).text();
  //     app.addFriend($(this).text());
  //   }
  // });

  //Message submission
  $('form').submit(function (event) {
    //event.preventDefault();
    event.stopPropagation();
    app.handleSubmit();
  });


  // //Selecting rooms
  // $('#roomSelect').on('click', '.chatroom', function (event) {
  //   var selector = $(this).text();
  //   debugger;
  //   $('.chat').hide();
  //   $('#chats').find('.'+selector).parent().show();
  // })
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
        //app.clearMessages();
        //chatroom.reset(null);
        for (var i = 0; i < data.results.length; i++) {
          var id = data.results[i].objectId
          if (!(id in app.chats)) {
            app.chats[id] = data.results[i];
            chatroom.add(new Message(data.results[i]));
          }
        }
        // for (var key in app.allRooms) {
        //   app.addRoom(key, roomnum);
        //   roomnum++
        // }
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


app.addRoom = function(room, num) {
  var $newRoom = $('<div class="chatroom ' + num + '">' + room + '</div>');
  $("#roomSelect").append($newRoom);
};

app.addFriend = function (name) {
  var $newFriend = $("<div class='friend'>" + name + "</div>");


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
  var chatroomView = new MessagesView({ model:chatroom });
  setInterval(app.fetch, 5000);
  // app.showMessages();
  app.init();
  $('body').prepend(chatroomView.render());
  setInterval(function () {
    $('body').prepend(chatroomView.render());
  }, 5000);
});








