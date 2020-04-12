import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    name: '',
    roomData: '',
    gameData: '',
    game: {gameMode: 'preparing'},
    messageArray: [],
    cardTree: [],
    nothing: '',
    shotLog: [],
    driverCards: []
  },
  mutations: {
    UPDATE_GAME(state, game){
      state.game = game
    },
    UPDATE_PLAYER_NAME(state, name){
      state.name = name
    },
    NOTHING(state){
      state.nothing = ''
    },
    ADD_MESSAGE(state, messageObj){
      state.messageArray.push(messageObj)
    },
    UPDATE_CARDTREE(state, card, row){
      state.cardTree.push({card: card, row: row})
    },
    UPDATE_SHOTLOG(state, data){
      state.shotLog.push({from: data.from, to: data.to})
    },
    UPDATE_DRIVER_CARDS(state, data){
      state.driverCards.push({number: data.number, color: data.color, value: data.color})
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
    socket_UPDATE_DRIVER({commit}, data){
      comm
    },
    spreadingCardsResp({commit}, data){
      commit('NOTHING')
      if( data.phase === 'color'){
        this._vm.$socket.client.emit('colorPick', {name: data.name, color: data.pick})
      }else if(data.phase === 'value'){
        this._vm.$socket.client.emit('valuePick', {name: data.name, value: data.pick})
      }else if(data.phase === 'position'){
        this._vm.$socket.client.emit('positionPick', {name: data.name, position: data.pick})
      }else{
        console.log('ERROR IN spreadingCardsResp IN STORE')
      }
    },
    flippingCardsResp({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('flippingCardsResp', data)
    },
    drivingResp({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('drivingResp', data)
    },
    shotTo({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('shotTo', data)
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
    socket_valuePick({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_positionPick({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_flipCards({commit}, game){
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
    socket_updateGame({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_shotTo({commit}, data){
      commit('UPDATE_SHOTLOG', data)
    },
    socket_cardFlipped({commit}, data){
      commit('UPDATE_CARDTREE', {card: data.card, row: data.row})
    }

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
