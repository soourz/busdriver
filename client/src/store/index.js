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
    game: {roomMode: 'lobby', gameMode: 'preaparing'},

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
    }
  },


  actions: {
    //OUTGOING SOCKET CALLS
    sendMessage({commit, state}, message){
      commit('NOTHING')                           // TODO how can i delete this nothing? 
      let name = state.name
      this._vm.$socket.client.emit('newMessage', {message: message, name: name})
    },
    joinGame({commit}, data){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('joinRoom', data)
    },
    startGame({commit}){
      commit('NOTHING')                           // TODO how can i delete this nothing?
      this._vm.$socket.client.emit('startGame')
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
    gotFlippedCard({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('gotFlippedCard', data)
    },
    preemptPick({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('preemptPick', data)
    },
    driverPick({commit}, data){
      commit('NOTHING')
      this._vm.$socket.client.emit('driverPick', data)
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
      if (state.name !== ''){
        return true
      }else{
        return false
      }
    }
  }
})
