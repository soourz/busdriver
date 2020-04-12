<template>
    <div id="preempting">

      {{name}} picks color
      <br><br>
      your cards: {{cards}}
      <br><br>

      <template v-if="gameMode === 'colorPick'">
        ColorPick
        <div v-if="players[playerTurn] === player">
          <button @click="spreadingCardsResp('color', player, 'black')">Black</button>
          <button @click="spreadingCardsResp('color', player, 'red')">Red</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="gameMode === 'valuePick'">
        upperlowerPick
        <div v-if="players[playerTurn] === player">
          <button @click="spreadingCardsResp('value', player, 'higher')">Higher</button>
          <button @click="spreadingCardsResp('value', player, 'lower')">Lower</button>
          <button @click="spreadingCardsResp('value', player, 'x')">X</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="gameMode === 'positionPick'">
        innerouterpick
        <div v-if="players[playerTurn] === player">
        <button @click="spreadingCardsResp('position', player, 'inside')">Inside</button>
        <button @click="spreadingCardsResp('position', player, 'outisde')">Outside</button>
        <button @click="spreadingCardsResp('position', player, 'x')">x</button>
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
        player(){
            return store.state.playerName
        },
        playerTurn(){
            return store.state.game.playerTurn
        },
        gameMode(){
            return store.state.game.gameMode
        },
        cards(){
            return store.state.driverCards
        }
    },
    methods: {
        spreadingCardsResp: (phase, name, pick) => {
            store.dispatch('spreadingCardsResp', {phase: phase, name: name, pick: pick})
        }
    }
}
</script>

<style>

</style>