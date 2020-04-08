const express = require('express')()
const http = require('http').Server(express)
const io = require('socket.io')(http)

let rooms = []

io.on('connection', socket => {
    let gameIndex
    let name

    //INPUT: function activation, data object with code and name
    socket.on('joinGame', data => {
        gameIndex = rooms.findIndex(x => x.code === data.code)
        name = data.name
        socket.join(data.code)
        if (gameIndex !== -1){
            if (rooms[gameIndex] === 'preparing'){
                rooms[gameIndex].players.push(data.name)
            }else{
                socket.emit('gameAlreadyStarted')
            }
        }else{
            rooms.push({code: data.code, players: [data.name], gameMode: 'preparing'})
            gameIndex = rooms.findIndex(x => x.code === data.code)
            rooms[gameIndex].cardsLeft = [{color: 'heart', value: '7'},{color: 'heart', value: '8'},{color: 'heart', value: '9'},{color: 'heart', value: '10'},{color: 'heart', value: 'J'},{color: 'heart', value: 'Q'},{color: 'heart', value: 'K'},{color: 'heart', value: 'A'},{color: 'pik', value: '7'},{color: 'pik', value: '8'},{color: 'pik', value: '9'},{color: 'pik', value: '10'},{color: 'pik', value: 'J'},{color: 'pik', value: 'Q'},{color: 'pik', value: 'K'},{color: 'pik', value: 'A'},{color: 'cross', value: '7'},{color: 'cross', value: '8'},{color: 'cross', value: '9'},{color: 'cross', value: '10'},{color: 'cross', value: 'J'},{color: 'cross', value: 'Q'},{color: 'cross', value: 'K'},{color: 'cross', value: 'A'},{color: 'caro', value: '7'},{color: 'caro', value: '8'},{color: 'caro', value: '9'},{color: 'caro', value: '10'},{color: 'caro', value: 'J'},{color: 'caro', value: 'Q'},{color: 'caro', value: 'K'},{color: 'caro', value: 'A'}]
        }
        console.log(data.name + ' joined ' + data.code + ' with the index ' + gameIndex)
        socket.emit('gameEntered', data.name)
        io.to(data.code).emit('newPlayer', rooms[gameIndex])
    }),

    //
    socket.on('newMessage', data => {
        io.to(data.code).emit('newMessage', {message: data.message, name: data.name})
    }),

    //
    socket.on('startGame', () => {
        rooms[gameIndex].gameMode = 'colorPick'
        rooms[gameIndex].playerTurn = 0
        rooms[gameIndex].cardsLeft = [{color: 'heart', value: '7'},{color: 'heart', value: '8'},{color: 'heart', value: '9'},{color: 'heart', value: '10'},{color: 'heart', value: 'J'},{color: 'heart', value: 'Q'},{color: 'heart', value: 'K'},{color: 'heart', value: 'A'},{color: 'pik', value: '7'},{color: 'pik', value: '8'},{color: 'pik', value: '9'},{color: 'pik', value: '10'},{color: 'pik', value: 'J'},{color: 'pik', value: 'Q'},{color: 'pik', value: 'K'},{color: 'pik', value: 'A'},{color: 'cross', value: '7'},{color: 'cross', value: '8'},{color: 'cross', value: '9'},{color: 'cross', value: '10'},{color: 'cross', value: 'J'},{color: 'cross', value: 'Q'},{color: 'cross', value: 'K'},{color: 'cross', value: 'A'},{color: 'caro', value: '7'},{color: 'caro', value: '8'},{color: 'caro', value: '9'},{color: 'caro', value: '10'},{color: 'caro', value: 'J'},{color: 'caro', value: 'Q'},{color: 'caro', value: 'K'},{color: 'caro', value: 'A'}]
        for(player in rooms[gameIndex].players){
            rooms[gameIndex].cards.push({name: player})
        }
        io.to(rooms[gameIndex].code).emit('colorPick', rooms[gameIndex])
    }),

    //INPUT: function activation, data object with color and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card2, playersturn)
    socket.on('colorPick', data => {
        if (rooms[gameIndex].cardsLeft.length === 0){
            rooms[gameIndex].cardsLeft = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]
            io.to(rooms[gameIndex].code).emit('cardsReseted')
        }
        let x
        do {
            x = Math.floor(Math.random()*32)
        } while (rooms[gameIndex].cardsLeft[x] === -1)
        let color
        if ((rooms[gameIndex].cardsLeft[x].color === 'heart')||(rooms[gameIndex].cardsLeft[x].color === 'heart')){
            color = 'red'
        }else{
            color = 'black'
        }
        if (data.color === color){
            io.to(rooms[gameIndex].code).emit('correctColor', data.name)
        }else{
            io.to(rooms[gameIndex].code).emit('wrongColor', data.name)
        }
        let playerIndex = rooms[gameIndex].cards.findIndex(y => y.name === data.name)
        rooms[gameIndex].cards[playerIndex].card1 = rooms[gameIndex].cardsLeft[x]
        rooms[gameIndex].cardsLeft.splice(x,1)

        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players[(playerTurn+1)] !== -1){
            rooms[gameIndex].playerTurn++
            io.to(rooms[gameIndex].code).emit('colorPick', rooms[gameIndex])
        }else{
            rooms[gameIndex].gameMode = 'upperlowerPick'
            rooms[gameIndex].playerTurn = 0
            io.to(rooms[gameIndex].code).emit('upperlowerPick', rooms[gameIndex])
        }
    }),

    //INPUT: function activation, data object with upperlower and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card2, playersturn)
    socket.on('upperlowerPick', data => {
        if (rooms[gameIndex].cardsLeft.length === 0){
            rooms[gameIndex].cardsLeft = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]
            io.to(rooms[gameIndex].code).emit('cardsReseted')
        }
        let x
        do {
            x = Math.floor(Math.random()*32)
        } while (rooms[gameIndex].cardsLeft[x] === -1)

        let playerIndex = rooms[gameIndex].cards.findIndex(y => y.name === data.name)
        if (data.upperlower === 'upper'){
            if(rooms[gameIndex].cardsLeft[x].value > rooms[gameIndex].cards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValue', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }else if(data.upperlower ==='lower'){
            if(rooms[gameIndex].cardsLeft[x].value < rooms[gameIndex].cards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValue', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }else{
            if(rooms[gameIndex].cardsLeft[x].value = rooms[gameIndex].cards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValueX', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }
        rooms[gameIndex].cards[playerIndex].card2 = rooms[gameIndex].cardsLeft[x]
        rooms[gameIndex].cardsLeft.splice(x,1)
        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players[(playerTurn+1)] !== -1){
            rooms[gameIndex].playerTurn++
            io.to(rooms[gameIndex].code).emit('upperlowerPick', rooms[gameIndex])
        }else{
            rooms[gameIndex].gameMode = 'innerouterPick'
            rooms[gameIndex].playerTurn = 0
            io.to(rooms[gameIndex].code).emit('innerouterPick', rooms[gameIndex])
        }
    }),

    //INPUT: function activation, data object with innerouter and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card3, playersturn)
    socket.on('innerouterPick', data => {
        if (rooms[gameIndex].cardsLeft.length === 0){
            rooms[gameIndex].cardsLeft = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]
            io.to(rooms[gameIndex].code).emit('cardsReseted')
        }
        let x
        do {
            x = Math.floor(Math.random()*32)
        } while (rooms[gameIndex].cardsLeft[x] === -1)

        let playerIndex = rooms[gameIndex].cards.findIndex(y => y.name === data.name)
        let card1
        let card2
        if (rooms[gameIndex].cards[playerIndex].card1.value < rooms[gameIndex].cards[playerIndex].card2.value){
            card1 = rooms[gameIndex].cards[playerIndex].card1
            card2 = rooms[gameIndex].cards[playerIndex].card2
        }else{
            card1 = rooms[gameIndex].cards[playerIndex].card2
            card2 = rooms[gameIndex].cards[playerIndex].card1
        }
        if (data.innerouter === 'inner'){
            if((rooms[gameIndex].cardsLeft[x].value > card1.value) && (rooms[gameIndex].cardsLeft[x].value < card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlace', data.name)
            }
        }else if(data.upperlower ==='outer'){
            if((rooms[gameIndex].cardsLeft[x].value < card1.value) || (rooms[gameIndex].cardsLeft[x].value > card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlace', data.name)
            }
        }else{
            if((rooms[gameIndex].cardsLeft[x].value === card1.value) || (rooms[gameIndex].cardsLeft[x].value === card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlaceX', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlace', data.name)
            }
        }
        rooms[gameIndex].cards[playerIndex].card3 = rooms[gameIndex].cardsLeft[x]
        rooms[gameIndex].cardsLeft.splice(x,1)
        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players[(playerTurn+1)] !== -1){
            rooms[gameIndex].playerTurn++
            io.to(rooms[gameIndex].code).emit('innerouterPick', rooms[gameIndex])
        }else{
            rooms[gameIndex].gameMode = 'result'
            rooms[gameIndex].playerTurn = 0
            io.to(rooms[gameIndex].code).emit('showResult', rooms[gameIndex])
        }
    }),


    socket.on('disconnect', () => {
        try{
            console.log(gameIndex)
            const index = rooms[gameIndex].players.indexOf(name)

            if (index !== -1) {
                rooms[gameIndex].players.splice(index, 1);
            }
        }catch(err){
            console.log(err)
        }
        //TODO remove room after players left
    })
})

http.listen(3000, () => {
    console.log('listening at :3000 ...')
})


/*
    vue create asked for use history mode for router... (requires proper server setup for index fallback in production)




*/