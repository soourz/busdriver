<template>
    <div id="spreading-cards">
      Spreading Cards
      
      <br><br>
      
      <div id="your-cards" >
        your cards:
        <div v-for="card in cards" :key="card" class="playingCards fourColours rotateHand">
          <div v-if="card !== 'x'" id="card-cont">
            <Card v-bind:value="card.value" v-bind:color="card.color" />
          </div>
          <div v-else>
          </div>
        </div>
      </div>

      <br><br>

      <template v-if="gameMode === 'colorPick'">
        ColorPick
        <div v-if="players[playerTurn].name === name">
          <button @click="spreadingCardsResp('color', name, 'black')">Black</button>
          <button @click="spreadingCardsResp('color', name, 'red')">Red</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="gameMode === 'valuePick'">
        upperlowerPick
        <div v-if="players[playerTurn].name === name">
          <button @click="spreadingCardsResp('value', name, 'higher')">Higher</button>
          <button @click="spreadingCardsResp('value', name, 'lower')">Lower</button>
          <button @click="spreadingCardsResp('value', name, 'x')">X</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

      <template v-else-if="gameMode === 'positionPick'">
        innerouterpick
        <div v-if="players[playerTurn].name === name">
        <button @click="spreadingCardsResp('position', name, 'inside')">Inside</button>
        <button @click="spreadingCardsResp('position', name, 'outside')">Outside</button>
        <button @click="spreadingCardsResp('position', name, 'x')">x</button>
        </div>
        <div v-else>
          Not your turn
        </div>
      </template>

    </div>
</template>

<script>
import {store} from '../../store'
import Card from './Card.vue'

export default {
    name: 'SpreadingCards',
    components: {
      Card
    },
    computed: {
        players(){
            return store.state.game.players
        },
        name(){
            return store.state.name
        },
        playerTurn(){
            return store.state.game.playerTurn
        },
        gameMode(){
            return store.state.game.gameMode
        },
        playerCards(){
            return store.state.game.playerCards
        },
        cards(){
            let index = this.players.findIndex(obj => obj.name === this.name)
            return this.playerCards[index]
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
#your-cards{
  margin: auto;
  height: 120px;
  width: 210px;
}
#card-cont{
  float:left
}
  @import '../../assets/cards/cards.css';
</style>