import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export const store = new Vuex.Store({


  state: {
    nothing: '',

    // ROOM
    name: '',
    messageArray: [],
    game: {roomMode: 'lobby'},

    // GAME
    shotLog: []
  },


  mutations: {
    NOTHING(state){
      state.nothing = ''
    },

    // ROOM
    UPDATE_PLAYER_NAME(state, name){
      state.name = name
    },
    ADD_MESSAGE(state, messageObj){
      state.messageArray.push(messageObj)
    },

    // GAME
    UPDATE_GAME(state, game){
      state.game = game
    },
    UPDATE_SHOTLOG(state, data){
      state.shotLog.push({from: data.from, to: data.to, count: data.count})
    },
    UPDATE_DRIVER_CARDS(state, data){
      state.driverCards.push({number: data.number, color: data.color, value: data.color})
    }
  },


  actions: {
    //OUTGOING SOCKET CALLS
    sendMessage({commit, state}, message){
      commit('NOTHING')                           // TODO how can i delete this nothing? 
      let code = state.game.code
      let name = state.playerName
      this._vm.$socket.client.emit('newMessage', {message: message, code: code, name: name})
    },
    joinGame({commit}, data){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('joinGame', data)
    },
    startGame({commit}){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('startGame')
    },
    socket_UPDATE_DRIVER({commit}, data){   //TODO
      commit('NOTHING')
    },
    spreadingCardsResp({commit}, data){ //TODO change spreading cards to cardpick
      commit('NOTHING')
      if( data.phase === 'color'){
        this._vm.$socket.client.emit('colorPick', {name: data.name, color: data.pick})
      }else if(data.phase === 'value'){
        this._vm.$socket.client.emit('valuePick', {name: data.name, value: data.pick})
      }else if(data.phase === 'position'){
        this._vm.$socket.client.emit('positionPick', {name: data.name, position: data.pick})
      }
    },
    cardPick({commit}, data){
      this._vm.$socket.client.emit('cardPick', data)
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
      this._vm.$socket.client.emit('shotTo', {from: data.from, to: data.to, count: data.count}) //TODO update count
    },

    //INCOMING SOCKET CALLS

    //ROOM FEATURES
    socket_newMessage({commit}, messageObj){
      commit('ADD_MESSAGE', messageObj)
    },
    socket_updateRoom({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_roomEntered({commit}, name){
      commit('UPDATE_PLAYER_NAME', name)
      router.push('/room')
    },

    //GAME FEATURES
    socket_updateGame({commit}, game){
      commit('UPDATE_GAME', game)
    },
    socket_shotTo({commit}, data){
      commit('UPDATE_SHOTLOG', data)
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
