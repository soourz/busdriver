<template>
    <div id="spreading-cards">
      Spreading Cards<br>
      <br>
      
      <div id="your-cards" >
        your cards: {{cards}}

        <div v-for="card in cards" :key="card" class="playingCards fourColours rotateHand">

          <div v-if="card !== 'x'" id="card-cont">

            <div v-if="(card.value === 7) && (card.color==='pik')">
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 8) && (card.color==='pik')">
              <div class="card rank-8 spades">
                <span class="rank">8</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 9) && (card.color==='pik')">
              <div class="card rank-9 spades">
                <span class="rank">9</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 10) && (card.color==='pik')">
              <div class="card rank-10 spades">
                <span class="rank">10</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 11) && (card.color==='pik')">
              <div class="card rank-j spades">
                <span class="rank">J</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 12) && (card.color==='pik')">
              <div class="card rank-q spades">
                <span class="rank">Q</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 13) && (card.color==='pik')">
              <div class="card rank-k spades">
                <span class="rank">K</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 14) && (card.color==='pik')">
              <div class="card rank-a spades">
                <span class="rank">A</span>
                <span class="suit">&spades;</span>
              </div>
            </div>


            <div v-else-if="(card.value === 7) && (card.color==='heart')">
              <div class="card rank-7 hearts">
                <span class="rank">7</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 8) && (card.color==='heart')">
              <div class="card rank-8 hearts">
                <span class="rank">8</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 9) && (card.color==='heart')">
              <div class="card rank-9 hearts">
                <span class="rank">9</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 10) && (card.color==='heart')">
              <div class="card rank-10 hearts">
                <span class="rank">10</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 11) && (card.color==='heart')">
              <div class="card rank-j hearts">
                <span class="rank">J</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 12) && (card.color==='heart')">
              <div class="card rank-q hearts">
                <span class="rank">Q</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 13) && (card.color==='heart')">
              <div class="card rank-k hearts">
                <span class="rank">K</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 14) && (card.color==='heart')">
              <div class="card rank-a hearts">
                <span class="rank">A</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>


            <div v-else-if="(card.value === 7) && (card.color==='caro')">
              <div class="card rank-7 diams">
                <span class="rank">7</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 8) && (card.color==='caro')">
              <div class="card rank-8 diams">
                <span class="rank">8</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 9) && (card.color==='caro')">
              <div class="card rank-9 diams">
                <span class="rank">9</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 10) && (card.color==='caro')">
              <div class="card rank-10 diams">
                <span class="rank">10</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-if="(card.value === 11) && (card.color==='caro')">
              <div class="card rank-j diams">
                <span class="rank">J</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 12) && (card.color==='caro')">
              <div class="card rank-q diams">
                <span class="rank">Q</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 13) && (card.color==='caro')">
              <div class="card rank-k diams">
                <span class="rank">K</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 14) && (card.color==='caro')">
              <div class="card rank-a diams">
                <span class="rank">A</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            
            
            <div v-else-if="(card.value === 7) && (card.color==='cross')">
              <div class="card rank-7 clubs">
                <span class="rank">7</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 8) && (card.color==='cross')">
              <div class="card rank-8 clubs">
                <span class="rank">8</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 9) && (card.color==='cross')">
              <div class="card rank-9 clubs">
                <span class="rank">9</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 10) && (card.color==='cross')">
              <div class="card rank-10 clubs">
                <span class="rank">10</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 11) && (card.color==='cross')">
              <div class="card rank-j clubs">
                <span class="rank">J</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 12) && (card.color==='cross')">
              <div class="card rank-q clubs">
                <span class="rank">Q</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 13) && (card.color==='cross')">
              <div class="card rank-k clubs">
                <span class="rank">K</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(card.value === 14) && (card.color==='cross')">
              <div class="card rank-a clubs">
                <span class="rank">A</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else></div>

          </div>

          <div v-else></div>
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

      <div class="playingCards fourColours rotateHand">
        <div class="card rank-7 spades">
            <span class="rank">7</span>
            <span class="suit">&spades;</span>
        </div>
      </div>
    </div>
</template>

<script>
import {store} from '../../store'

export default {
    name: 'SpreadingCards',
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
  width: 800px;
}
#card-cont{
  float:left
}
  @import '../../assets/CSS-Playing-Cards/cards.css';
</style>