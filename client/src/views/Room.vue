<template>
  <div class="room">
    <Chat id="chat" />
    <Game />
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from '@/components/Chat.vue'
import Game from '@/components/Game.vue'

export default {
  name: 'Room',
  components: {
    Chat,
    Game
  }
}
</script>

<style scoped>
#chat{
  margin: auto
}
</style>