<template>
  <div>
    <h1>Welcome fellow busdriver!</h1>
    <div>Join a game...</div>
    <form v-on:submit="join">
      <input type="text" placeholder="Nickname" name="name" /><br>
      <input type="text" placeholder="Game Code" name="code" /><br>
      <input type="submit" value="Join" /><br>
    </form>
    <div id="error-container"></div>
  </div>
</template>

<script>
import {store} from '../store'

export default {
  name: 'Login',
  methods: {
    join: (e) => {
      e.preventDefault()
      let name = e.target.elements.name.value
      let code = e.target.elements.code.value
      let data = {
        name: name,
        code: code
      }
      store.dispatch('joinGame', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
