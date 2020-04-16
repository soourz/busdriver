<template>
  <div id="shotLog">
      <div id="shots">
        <div v-for="shotObj in shotArray" :key="shotObj.from + shotObj.to">
        {{ shotObj.count }} shots from {{ shotObj.from }} to {{ shotObj.to }}
        </div>
      </div>
  </div>
</template>

<script>
import {store} from '../../store'

export default {
  name: 'Game',
  computed: {
    shotArray(){
      return store.state.shotLog
    }
  },
  watch:{
    shotArray: async function(){             //TODO set message ids for unique keys in the array
      await setTimeout(200)                                       //FIND ANOTHER SOLUTION FOR THIS SHIT
      var objDiv = document.getElementById("shots");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #shots{
        height:100px;
        width: 500px;
        overflow-y: scroll;
        text-align: left;
        margin: auto;
        border: 1px solid rgb(163, 163, 163);
    }
</style>
