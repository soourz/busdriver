<template>
    <div id="flipping-cards">

      <div id="flipped-cards" >
        flipped Cards:
        <div v-for="card in flippedCards" :key="card" class="playingCards fourColours rotateHand">
          <div v-if="card !== 'x'" id="card-cont">
            <Card v-bind:value="card.value" v-bind:color="card.color" />
          </div>
          <div v-else>
          </div>
        </div>
      </div>
      
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

      <button @click="cardDeploy">I Got!</button>

      <div v-if="shotsToShare > 0">
        Shot to:
        <div v-for="player in players" v-bind:key="player">
            <button @click="shotTo(player.name)">{{ player.name }}</button>
        </div>
      </div>
      <div v-else>
          No shots to share
      </div>
    </div>
</template>

<script>
import {store} from '../../store'
import Card from './Card.vue'

export default {
    name: 'FlippingCards',
    components:{
      Card
    },
    data: function(){
        return{
            shotsToShare: 0
        }
    },
    computed: {
        name(){
            return store.state.name
        },
        game(){
            return store.state.game
        },
        players(){
            return this.game.players
        },
        flippedCards(){
            return this.game.flippedCards
        },
        playerCards(){
            return this.game.playerCards
        },
        cards(){
            let index = this.game.players.findIndex(obj => obj.name === this.name)
            return this.game.playerCards[index]
        },
    },
    methods: {
        cardDeploy: function(){
            let lastCard = 0
            while(this.flippedCards[lastCard+1] !== 'x'){
                lastCard++
            }
            
            let cards = this.cards

            for(var i = 0; i<cards.length; i++){
                if(cards[i].value === this.flippedCards[lastCard].value){
                    if(lastCard < 4){
                        this.shotsToShare += 1
                    }else if(lastCard < 7){
                        this.shotsToShare += 2
                    }else if(lastCard < 9){
                        this.shotsToShare += 3
                    }else{
                        this.shotsToShare += 4
                    }
                }
            }
        },
        shotTo: function(to){
            store.dispatch('shotTo', {from: this.name, to: to, count: 1})
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
#flipped-cards{
    margin: auto;
    height: 120px;
    width: 750px;
}
</style>