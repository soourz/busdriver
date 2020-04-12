<template>
    <div id="preparing">
      preparing
      <button @click="startGame">Start</button>
    </div>
</template>

<script>
import {store} from '../../store'

export default {
    name: 'Preparing',
    computed: {
        players(){
            return store.state.game.players
        },
        player(){
            return store.state.playerName
        },
    },
    methods: {
        startGame: () => {
            store.dispatch('startGame')
        }
    }
}
</script>

<style>

</style>