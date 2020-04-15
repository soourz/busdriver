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
    methods: {
        startGame: () => {
            store.dispatch('startGame')
        }
    }
}
</script>

<style>

</style>