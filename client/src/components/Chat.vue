<template>
  <div id="chat">
    Name: {{ name }} Room: {{ game.code }}
    <div id="players">
      <div v-for="user in users" :key="user.id">
        {{ user.name }}
      </div>
    </div>
    <div id="messages">
      <div v-for="messageObj in messageArray" :key="messageObj.message + messageObj.name">
        <small>{{ messageObj.name}}:</small> {{ messageObj.message }} 
      </div>
    </div>
    <div id="newMessage">
      <form v-on:submit="newMessage">
        <input type="text" placeholder="Message" name="message" />
        <input type="submit" value="newMessage" /><br>
      </form>
    </div>
  </div>
</template>

<script>
import {store} from '../store' 

export default {
  name: 'Chat',
  computed: {
    name(){
      return store.state.name
    },
    messageArray(){
      return store.state.messageArray
    },
    users(){
      return store.state.game.users
    },
    game(){
      return store.state.game
    }
  },
  watch:{
    messageArray: async function(){             //TODO set message ids for unique keys in the array
      await setTimeout(200)                                       //FIND ANOTHER SOLUTION FOR THIS SHIT
      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  },
  methods: {
    newMessage: (e) => {
      e.preventDefault()
      let message = e.target.elements.message.value
      store.dispatch('sendMessage', message)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#players{
  position: absolute;
  height: 145px;
  width: 180px;
  top: 20px;
  left: 400px;

  border: 1px solid rgb(163, 163, 163);
}
#messages{
  height:145px;
  width: 380px;
  overflow-y: scroll;
  position: absolute;
  top: 20px;
  left: 20px;
  text-align: left;

  border: 1px solid rgb(163, 163, 163);
}
#newMessage{
  width: 600px;
  position: absolute;
  bottom: 0;
  left: 0;
}
#chat{
  height:200px;
  width: 600px;
  position: relative;
  border: 1px solid rgb(163, 163, 163);
}
</style>
