var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/',
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
  url: 'https://api.parse.com/1/classes/chatterbox/',
  model: Message,

  loadMessages: function() {
    this.fetch({data: { order: '-createdAt'}});
  },

  parse: function(response, options) {
    var results = [];
    for (var i = response.results.length-1; i >= 0; i--) {
      //var id = response.results[i].objectId;
      //if (!(id in app.chats)) {
        //app.chats[id] = response.results[i];
      //chatroom.add(new Message(response.results[i]), {at: 0});
      //}
      results.push(response.results[i]);
    }
    //$('body').prepend(chatroomView.render());
    return results;
  }
});

var MessageView = Backbone.View.extend({
  template: _.template('<div class="chat"> \
                        <div class="username"><%- username %></div> \
                        <div class="message"><%- text %></div> \
                        <div class="chatroom"><%- roomname %></div> \
                        </div>'),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({
  initialize: function () {
    // this.model.on('add', function(event) {

    //   //Grouping messages by username
    //   var username = this.models[0].get('username');
    //   if (username in app.users) { app.users[username].push(this.models[0]); }
    //   else { app.users[username] = [this.models[0]]; }

    //   //Grouping messages by room
    //   var room = this.models[0].get('chatroom');
    //   if (room in app.rooms) { app.rooms[room].push(room); }
    //   else {
    //     app.rooms[room] = [this.models[0]];
    //     app.addRoom(room);
    //   }
    // });
    this.collection.on('sync', this.render, this);
    this.onscreenMessages = {};

  },

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

var chatroomView = new MessagesView({ model:chatroom });

//var roomsView = new MessagesView({ model: chatroom });

//var friendsView = new MessagesView({ model: chatroom });


// YOUR CODE HERE:

var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  chats : {},
  users : {},
  rooms : {},
  userFriends : {}
};

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

// app.fetch = function() {
//     $.ajax({
//       // always use this url
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'GET',
//       contentType: 'application/json',
//       data: {order: 'createdAt'},
//       success: function (data) {
//         console.log('chatterbox: Messages received');
//         for (var i = 0; i < data.results.length; i++) {
//           var id = data.results[i].objectId
//           if (!(id in app.chats)) {
//             app.chats[id] = data.results[i];
//             chatroom.add(new Message(data.results[i]), {at: 0});
//           }
//         }
//         $('body').prepend(chatroomView.render());
//       },
//       error: function (data) {
//         // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to receive messages');
//       }
//     });

// };


app.addRoom = function(room) {
  var $newRoom = $('<div class="chatroom">' + room + '</div>');
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



$(document).ready(function () {
  chatroom.loadMessages();
  //setInterval(chatroom.fetch, 5000);
});
//   app.fetch();
//   $('body').prepend(chatroomView.render());
//   setInterval(app.fetch, 5000);
//   app.init();
// });








