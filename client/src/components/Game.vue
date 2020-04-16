<template>
  <div id="game">


    <Preparing v-if="gameMode === 'preparing'" />

    <SpreadingCards v-else-if="(gameMode === 'colorPick') || (gameMode === 'valuePick') || (gameMode === 'positionPick')" />

    <FlippingCards v-else-if="gameMode === 'flippingCards'" />

    <Preempt v-else-if="gameMode === 'preempting'" />

    <Driving v-else-if="gameMode === 'driving'" />

    <Result v-else-if="gameMode === 'result'" />

    <div v-else>
      error
    </div>

    <ShotLog />

    <div id="action"></div>
  </div>
</template>

<script>
import {store} from '../store'
import Preparing from '@/components/Busfahrer/Preparing.vue'
import SpreadingCards from '@/components/Busfahrer/SpreadingCards.vue'
import FlippingCards from '@/components/Busfahrer/FlippingCards.vue'
import Preempt from '@/components/Busfahrer/Preempt.vue'
import Driving from '@/components/Busfahrer/Driving.vue'
import Result from '@/components/Busfahrer/Result.vue'
import ShotLog from '@/components/Busfahrer/ShotLog.vue'

export default {
  name: 'Game',
  components:{
    Preparing,
    SpreadingCards,
    FlippingCards,
    Preempt,
    Driving,
    Result,
    ShotLog
  },
  computed: {
    gameMode(){
      return store.state.game.gameMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
