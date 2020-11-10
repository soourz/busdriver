<template>


<div>
          <div id="card-cont" class="playingCards fourColours rotateHand">
              <div class="card" :class="'rank-'+value+' '+color">
                <span class="rank">{{value}}</span>
                <span class="suit" v-html="'&'+color+';'"></span>
              </div>
            </div>
 </div>
</template>

<script>

export default {
    name: 'Card_perf',
    props: {
        value: Number,
        color: String
    }
}
</script>

<style>
#card-cont{
  float:left
}
@import '../../assets/cards/cards.css';
</style>