<template>
    <div id="preempting">
    preempting
    <br><br>
    driver: {{drivers}}
    <br><br>
    your cards: {{cards}}
    <br><br>

    <template v-if="(innerIndex % 3) === 0">
        ColorPick
        <div v-if="drivers[0] === name">
            <button @click="driverPick('black')">Black</button>
            <button @click="driverPick('red')">Red</button>
        </div>
        <div v-else>
            Not your turn
        </div>
    </template>

    <template v-else-if="(innerIndex % 3) === 1">
        upperlowerPick
        <div v-if="drivers[0] === name">
        <button @click="driverPick('higher')">Higher</button>
        <button @click="driverPick('lower')">Lower</button>
        <button @click="driverPick('x')">X</button>
        </div>
        <div v-else>
            Not your turn
        </div>
    </template>

    <template v-else-if="(innerIndex % 3) === 2">
        innerouterpick
        <div v-if="drivers[0] === name">
            <button @click="driverPick('inside')">Inside</button>
            <button @click="driverPick('outside')">Outside</button>
            <button @click="driverPick('x')">x</button>
        </div>
        <div v-else>
            Not your turn
        </div>
    </template>
    </div>
</template>

<script>
import {store} from '../../store'

export default {
    name: 'Driving',
    computed: {
        game(){
            return store.state.game
        },
        innerIndex(){
            return this.game.innerIndex
        },
        name(){
            return store.state.name
        },
        cards(){
            let index = this.game.players.findIndex(obj => obj.name === this.name)
            return store.state.game.playerCards[index]
        },
        drivers(){
            return this.game.drivers
        }
    },
    methods: {
        driverPick: function(pick){
            store.dispatch('driverPick', {name: this.name, pick: pick})
        }
    }
}
</script>

<style>

</style>