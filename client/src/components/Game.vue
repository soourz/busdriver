<template>
  <div id="game">
    GameMode: {{ gameMode }}
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
    },
    gameMode: function(){

    },
    game: function(){
      console.log('gamewatcher exec')
      if (this.player === this.players[this.playersTurn]){
        if(this.gameMode === 'colorPick'){
          document.getElementById('action').innerHTML = '<button @click="PickBlack">Black</button><button @click="PickRed">Red</button>'
        }else if(this.gameMode === 'upperlowerPick'){
          document.getElementById('action').innerHTML = '<button @click="PickUpper">Upper</button><button @click="PickLower">Lower</button><button @click="PickUpperLowerX">X</button>'
        }else if(this.gameMode === 'innerouterPick'){
          document.getElementById('action').innerHTML = '<button @click="PickOuter">Outer</button><button @click="PickInner">Inner</button><button @click="PickInnerOuterX">x</button>'
        }else if(this.gameMode === 'showResult'){
          document.getElementById('action').innerHTML = 'result'
        }else if(this.gameMode === 'preparing'){
          document.getElementById('action').innerHTML = '<button @click="startGame">Start</button>'
        }
      }else if(this.gameMode === 'preparing'){
        document.getElementById('action').innerHTML = '<button @click="startGame">Start</button>'
      }else{
        document.getElementById('action').innerHTML = this.game.players[this.game.playersTurn]
      }
    }
  },
  methods: {
    newMessage: (e) => {
      e.preventDefault()
      let message = e.target.elements.message.value
      store.dispatch('sendMessage', message)
    },
    startGame: () => {
      store.dispatch('startGame')
    },
    PickBlack: () => {
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
