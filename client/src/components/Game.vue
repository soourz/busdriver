<template>
  <div id="game">
    <div id='mode'>
    GameMode: {{ gameMode }}
    </div>


      <SpreadingCards v-if="gameMode === 'preparing'"></SpreadingCards>

    <!-- <template v-if="gameMode === 'preparing'">
      preparing
      <button @click="startGame">Start</button>
    </template>

    <template v-else-if="gameMode === 'colorPick'">
      ColorPick
      <div v-if="players[playersTurn] === player">
        <button @click="PickBlack">Black</button>
        <button @click="PickRed">Red</button>
      </div>
      <div v-else>
        Not your turn
      </div>

    </template>

    <template v-else-if="gameMode === 'upperlowerPick'">
      upperlowerPick
      <div v-if="players[playersTurn] === player">
        <button @click="PickUpper">Upper</button>
        <button @click="PickLower">Lower</button>
        <button @click="PickUpperLowerX">X</button>
      </div>
      <div v-else>
        Not your turn
      </div>
    </template>

    <template v-else-if="gameMode === 'innerouterPick'">
      innerouterpick
      <div v-if="players[playersTurn] === player">
      <button @click="PickOuter">Outer</button>
      <button @click="PickInner">Inner</button>
      <button @click="PickInnerOuterX">x</button>
      </div>
      <div v-else>
        Not your turn
      </div>
    </template>

    <template v-else-if="gameMode === 'flipping'">
    </template>

    <template v-else-if="gameMode === 'driving'">
      driving
      <div v-if="players[playersTurn] === player">
      <button @click="PickOuter">Outer</button>
      <button @click="PickInner">Inner</button>
      <button @click="PickInnerOuterX">x</button>
      </div>
      <div v-else>
        Not your turn
      </div>
    </template>

    <template v-else>
      Error
    </template> -->

    <div id="action"></div>
  </div>
</template>

<script>
import {store} from '../store'
import SpreadingCards from '@/components/SpreadingCards.vue'

export default {
  name: 'Game',
  components:{
    SpreadingCards
  },
  computed: {
    player(){
      return store.state.playerName
    },
    playersTurn(){
      return store.state.game.playerTurn
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
    PickRed: function(){
      store.dispatch('colorPick', {name: this.player, color: 'red'})
    },
    PickInner: function(){
      store.dispatch('innerouterPick', {name: this.player, innerouter: 'inner'})
    },
    PickOuter: function(){
      store.dispatch('innerouterPick', {name: this.player, innerouter: 'outer'})
    },
    PickUpper: function(){
      store.dispatch('upperlowerPick', {name: this.player, upperlower: 'upper'})
    },
    PickLower: function(){
      store.dispatch('upperlowerPick', {name: this.player, upperlower: 'lower'})
    },
    PickInnerOuterX: function(){
      store.dispatch('innerouterPick', {name: this.player, innerouter: 'x'})
    },
    PickUpperLowerX: function(){
      store.dispatch('upperlowerPick', {name: this.player, upperlower: 'x'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
