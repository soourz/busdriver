<template>
  <div class="home">
      <p> Moin  </p>
      <div id="card">
      <Card v-bind:value="8" v-bind:color="'spades'" />
      </div>
    <div id="card-cont" class="playingCards fourColours rotateHand">
          <div class="card rank-8 spades">
                <span class="rank">8</span>
                <span class="suit">&spades;</span>
              </div>
      </div>
  </div>
</template>

<script>
import Card from "../components/Busfahrer/Card_perf.vue";

export default {
   name: 'Design',
    components: {
      Card
    }
}
</script>

<style>
@import '../assets/cards/cards.css';
</style>
