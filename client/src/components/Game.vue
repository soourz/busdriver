<template>
  <div id="game">


    <Preparing v-if="gameMode === 'preparing'" />

    <SpreadingCards v-else-if="(gameMode === 'colorPick') || (gameMode === 'valuePick') || (gameMode === 'positionPick')" />

    <FlippingCards v-else-if="gameMode === 'flippingCards'" />

    <Driving v-else-if="gameMode === 'driving'" />

    <div v-else>
      error
    </div>

    <!-- <template v-if="gameMode === 'preparing'">
      preparing
      <button @click="startGame">Start</button>
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
import Preparing from '@/components/Busfahrer/Preparing.vue'
import SpreadingCards from '@/components/Busfahrer/SpreadingCards.vue'
import FlippingCards from '@/components/Busfahrer/FlippingCards.vue'
import Driving from '@/components/Busfahrer/Driving.vue'

export default {
  name: 'Game',
  components:{
    Preparing,
    SpreadingCards,
    FlippingCards,
    Driving
  },
  computed: {
    gameMode(){
      return store.state.game.gameMode
    }
  },
  methods: {
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
