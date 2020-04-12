<template>
    <div id="flipping-cards">
      Flipping Cards
      {{cardTree}}<br>
      <br>

      your cards: {{cards}}
      <br><br>

      <button @click="cardDeploy">I Got!</button>
      {{ nomessage}}

      <div v-if="shotsToShare > 0">
          Shot to:
        <div v-for="player in players" v-bind:key="player">
            <button @click="shotTo(player)">{{ player }}</button>
        </div>
      </div>
      <div v-else>
          No shots to share
      </div>
    </div>
</template>

<script>
import {store} from '../../store'

export default {
    name: 'FlippingCards',
    data: function(){
        return{
            shotsToShare: 0,
            nomessage: ''
        }
    },
    computed: {
        players(){
            return store.state.game.players
        },
        player(){
            return store.state.playerName
        },
        cardTree(){
            return store.state.cardTree
        },
        playerCards(){
            return store.state.game.playerCards
        },
        playerIndex(){
            return store.state.game.playerCards.findIndex(obj => obj.name === this.player)
        },
        cards(){
            return this.playerCards[this.playerIndex]
        }
    },
    methods: {
        cardDeploy: function(){
            if((this.cards.card1.vaue === this.cardTree[this.cardTree.length-1].card.value) ||
            (this.cards.card2.value === this.cardTree[this.cardTree.length-1].card.vaue) || 
            (this.cards.card3.value === this.cardTree[this.cardTree.length-1].card.value)){
                this.shotsToShare += this.cardTree[this.cardTree.length-1].card.row
            }else{
                this.nomessage ='no, Idiot'
            }
        },
        shotTo: function(name){
            store.dispatch('shotTo', {from: this.player, to: name})
        }
    }
}
</script>

<style>

</style>