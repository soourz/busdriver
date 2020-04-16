<template>
          <div id="card-cont" class="playingCards fourColours rotateHand">
            <div v-if="(value === 7) && (color==='pik')">
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 8) && (color==='pik')">
              <div class="card rank-8 spades">
                <span class="rank">8</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 9) && (color==='pik')">
              <div class="card rank-9 spades">
                <span class="rank">9</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 10) && (color==='pik')">
              <div class="card rank-10 spades">
                <span class="rank">10</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 11) && (color==='pik')">
              <div class="card rank-j spades">
                <span class="rank">J</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 12) && (color==='pik')">
              <div class="card rank-q spades">
                <span class="rank">Q</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 13) && (color==='pik')">
              <div class="card rank-k spades">
                <span class="rank">K</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div v-else-if="(value === 14) && (color==='pik')">
              <div class="card rank-a spades">
                <span class="rank">A</span>
                <span class="suit">&spades;</span>
              </div>
            </div>


            <div v-else-if="(value === 7) && (color==='heart')">
              <div class="card rank-7 hearts">
                <span class="rank">7</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 8) && (color==='heart')">
              <div class="card rank-8 hearts">
                <span class="rank">8</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 9) && (color==='heart')">
              <div class="card rank-9 hearts">
                <span class="rank">9</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 10) && (color==='heart')">
              <div class="card rank-10 hearts">
                <span class="rank">10</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 11) && (color==='heart')">
              <div class="card rank-j hearts">
                <span class="rank">J</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 12) && (color==='heart')">
              <div class="card rank-q hearts">
                <span class="rank">Q</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 13) && (color==='heart')">
              <div class="card rank-k hearts">
                <span class="rank">K</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>
            <div v-else-if="(value === 14) && (color==='heart')">
              <div class="card rank-a hearts">
                <span class="rank">A</span>
                <span class="suit">&hearts;</span>
              </div>
            </div>


            <div v-else-if="(value === 7) && (color==='caro')">
              <div class="card rank-7 diams">
                <span class="rank">7</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 8) && (color==='caro')">
              <div class="card rank-8 diams">
                <span class="rank">8</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 9) && (color==='caro')">
              <div class="card rank-9 diams">
                <span class="rank">9</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 10) && (color==='caro')">
              <div class="card rank-10 diams">
                <span class="rank">10</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-if="(value === 11) && (color==='caro')">
              <div class="card rank-j diams">
                <span class="rank">J</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 12) && (color==='caro')">
              <div class="card rank-q diams">
                <span class="rank">Q</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 13) && (color==='caro')">
              <div class="card rank-k diams">
                <span class="rank">K</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            <div v-else-if="(value === 14) && (color==='caro')">
              <div class="card rank-a diams">
                <span class="rank">A</span>
                <span class="suit">&diams;</span>
              </div>
            </div>
            
            
            <div v-else-if="(value === 7) && (color==='cross')">
              <div class="card rank-7 clubs">
                <span class="rank">7</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 8) && (color==='cross')">
              <div class="card rank-8 clubs">
                <span class="rank">8</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 9) && (color==='cross')">
              <div class="card rank-9 clubs">
                <span class="rank">9</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 10) && (color==='cross')">
              <div class="card rank-10 clubs">
                <span class="rank">10</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 11) && (color==='cross')">
              <div class="card rank-j clubs">
                <span class="rank">J</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 12) && (color==='cross')">
              <div class="card rank-q clubs">
                <span class="rank">Q</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 13) && (color==='cross')">
              <div class="card rank-k clubs">
                <span class="rank">K</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else-if="(value === 14) && (color==='cross')">
              <div class="card rank-a clubs">
                <span class="rank">A</span>
                <span class="suit">&clubs;</span>
              </div>
            </div>
            <div v-else></div>
          </div>
</template>

<script>

export default {
    name: 'Card',
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
@import '../../assets/CSS-Playing-Cards/cards.css';
</style>