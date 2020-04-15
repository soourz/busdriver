<template>
    <div id="preempting">
      preempting
      <br><br>
      preempters: {{drivers}}
      <br><br>
      your cards: {{cards}}
      <br><br>

      <template v-if="(innerIndex % 3) === 0">
        ColorPick
        <div v-if="drivers[playerTurn] === name">
          <button @click="preemptPick('black')">Black</button>
          <button @click="preemptPick('red')">Red</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="(innerIndex % 3) === 1">
        upperlowerPick
        <div v-if="drivers[playerTurn] === name">
          <button @click="preemptPick('higher')">Higher</button>
          <button @click="preemptPick('lower')">Lower</button>
          <button @click="preemptPick('x')">X</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="(innerIndex % 3) === 2">
        innerouterpick
        <div v-if="drivers[playerTurn] === name">
          <button @click="preemptPick('inside')">Inside</button>
          <button @click="preemptPick('outside')">Outside</button>
          <button @click="preemptPick('x')">x</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

    </div>
</template>

<script>
import {store} from '../../store'

export default {
    name: 'SpreadingCards',
    computed: {
        game(){
            return store.state.game
        },
        innerIndex(){
            return this.game.innerIndex
        },
        name(){
            return store.state.name
        },
        playerTurn(){
            return this.game.playerTurn
        },
        cards(){
            let index = this.game.players.findIndex(obj => obj.name === this.name)
            return this.game.playerCards[index]
        },
        drivers(){
            return this.game.drivers
        }
    },
    methods: {
        preemptPick: function(pick){
            store.dispatch('preemptPick', {name: this.name, pick: pick})
        }
    }
}
</script>

<style>

</style>