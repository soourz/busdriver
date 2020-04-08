<template>
  <div id="game">
    GameMode: {{ gameMode }}
    <div v-if="gameMode === 'preparing'">
      preparing
      <button @click="startGame">Start</button>
    </div>
    <div v-else-if="gameMode === 'colorPick'">
      colorPick
      <button @click="PickBlack">Black</button>
      <button @click="PickRed">Red</button>
    </div>
    <div v-else-if="type === 'upperlowerPick'">
      upperlowerPick
      <button @click="PickUpper">Upper</button>
      <button @click="PickLower">Lower</button>
      <button @click="PickUpperLowerX">X</button>
    </div>
    <div v-else-if="type === 'innerouterPick'">
      upperlowerPick
      <button @click="PickOuter">Outer</button>
      <button @click="PickInner">Inner</button>
      <button @click="PickInnerOuterX">x</button>
    </div>
    <div v-else>
      Error
    </div>
    <div id="action"></div>
  </div>
</template>

<script>
import {store} from '../store'

export default {
  name: 'Game',
  computed: {
    player(){
      return store.state.playerName
    },
    playersTurn(){
      return store.state.game.players[store.state.game.playersTurn]
    },
    cardsLeft(){
      return store.state.game.cardsLeft.length
    },
    gameMode(){
      return store.state.game.gameMode
    },
    players(){
      return store.state.game.players
    }
  },
  watch:{
    messageArray: async function(){
      await setTimeout(200)                                       //FIND ANOTHER SOLUTION FOR THIS SHIT
      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  },
  methods: {
    newMessage: (e) => { //TODO set message ids for unique keys in the array
      e.preventDefault()
      let message = e.target.elements.message.value
      store.dispatch('sendMessage', message)
    },
    startGame: () => {
      store.dispatch('startGame')
    },
    PickBlack: function(){
      store.dispatch('colorPick', {name: this.player, color: 'black'})
    },
    PickRed: () => {
      store.dispatch('colorPick', {name: this.player, color: 'red'})
    },
    PickInner: () => {
      store.dispatch('innerouterPick', {name: this.player, innerouter: 'inner'})
    },
    PickOuter: () => {
      store.dispatch('innerouterPick', {name: this.player, innerouter: 'outer'})
    },
    PickUpper: () => {
      store.dispatch('innerouterPick', {name: this.player, upperlower: 'upper'})
    },
    PickLower: () => {
      store.dispatch('upperlowerPick', {name: this.player, upperlower: 'lower'})
    },
    PickInnerOuterX: () => {
      store.dispatch('upperlowerPick', {name: this.player, innerouter: 'x'})
    },
    PickUpperLowerX: () => {
      store.dispatch('upperlowerPick', {name: this.player, upperlower: 'x'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
