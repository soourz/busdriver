<template>
    <div id="driving">

      {{driver}} is driving
      <br><br>
      your cards: {{cards}}
      <br><br>

      <template v-if="status === 'watcher'">
        Watching
      </template>

      <template v-else>
          Driving
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