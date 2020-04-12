import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    playerName: '',
    game: {gameMode: 'preparing'},
    messageArray: [],
    nothing: ''
  },
  mutations: {
    UPDATE_GAME(state, game){
      state.game = game
    },
    UPDATE_PLAYER_NAME(state, name){
      state.playerName = name
    },
    NOTHING(state){
      state.nothing = ''
    },
    ADD_MESSAGE(state, messageObj){
      state.messageArray.push(messageObj)
    }
  },
  actions: {
    joinGame({commit}, data){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('joinGame', data)
    },
    sendMessage({commit, state}, message){
      commit('NOTHING')                           // TODO how can i delete this nothing? 
      let code = state.game.code
      let name = state.playerName
      this._vm.$socket.client.emit('newMessage', {message: message, code: code, name: name})
    },
    startGame({commit}){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('startGame')
    },
    spreadingCardsResp({commit}, data){
      commit('NOTING')
      this._vm.$socket.client.emit('spreadingCardsResp', data)
    },
    flippingCardsResp({commit}, data){
      commit('NOTING')
      this._vm.$socket.client.emit('flippingCardsResp', data)
    },
    drivingResp({commit}, data){
      commit('NOTING')
      this._vm.$socket.client.emit('drivingResp', data)
    },
    colorPick({commit}, data){
      commit('NOTHING')  
      this._vm.$socket.client.emit('colorPick', data)
    },
    upperlowerPick({commit}, data){
      commit('NOTHING')  
      this._vm.$socket.client.emit('upperlowerPick', data)
    },
    innerouterPick({commit}, data){
      commit('NOTHING')  
      this._vm.$socket.client.emit('innerouterPick', data)
    },
    socket_gameEntered({commit}, name){
      commit('UPDATE_PLAYER_NAME', name)
      router.push('/room')
    },
    socket_newPlayer({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_leaveGame({commit}){
      commit('UPDATE_GAME', {})
      commit('UPDATE_PLAYER_NAME', '')
    },
    socket_newMessage({commit}, messageObj){
      commit('ADD_MESSAGE', messageObj)
    },
    socket_playerLeft({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_colorPick({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_upperlowerPick({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_innerouterPick({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_showResult({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_correctPlace({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_wrongPlace({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_correctPlaceX({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_correctValue({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_correctValueX({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_wrongValue({commit}, game){
      commit('UPDATE_GAME', game)
    },
  },
  getters: {
    getInGame: state => {
      if (state.playerName !== ''){
        return true
      }else{
        return false
      }
    },
    getName: state => {
      return state.playerName
    }
  }
})
