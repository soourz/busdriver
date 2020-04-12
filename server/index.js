const express = require('express')()
const http = require('http').Server(express)
const io = require('socket.io')(http)

let rooms = []

const CARDS = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]

function getPlayerIndex(roomIndex, name){
    let index = rooms[roomIndex].playerCards.findIndex(obj => obj.name === name)
    return index
}

function cardToPlayer(roomIndex, name, cardno){
    let cardIndex = Math.floor(Math.random()*CARDS.length)
    let playerIndex = getPlayerIndex(roomIndex, name)
    let card = rooms[roomIndex].cardsLeft[cardIndex]
    if(cardno === 1){
        rooms[roomIndex].playerCards[playerIndex].card1 = card
    }else if(cardno === 2){
        rooms[roomIndex].playerCards[playerIndex].card2 = card
    }else{
        rooms[roomIndex].playerCards[playerIndex].card3 = card
    }

    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)

    return card
}

function cardReset(gameIndex){
    rooms[gameIndex].cardsLeft = CARDS
}

function initializeRoom(newCode, playerName){
    rooms.push({code: newCode, players: [playerName], gameMode: 'preparing'})
    return rooms.findIndex(x => x.code === newCode)
}

function initializeGame(gameIndex){
    rooms[gameIndex].gameMode = 'colorPick'
    rooms[gameIndex].playerTurn = 0
    rooms[gameIndex].playerCards = []
    for(player of rooms[gameIndex].players){
        rooms[gameIndex].playerCards.push({name: player, card1: 'x', card2: 'x', card3: 'x'})
    }
    cardReset(gameIndex)
}

io.on('connection', socket => {
    let gameIndex
    let name

    //INPUT: function activation, data object with code and name
    socket.on('joinGame', data => {
        gameIndex = rooms.findIndex(x => x.code === data.code)
        name = data.name
        socket.join(data.code)
        if (gameIndex !== -1){
            if (rooms[gameIndex].gameMode === 'preparing'){
                rooms[gameIndex].players.push(name)
            }else{
                socket.emit('gameAlreadyStarted')
            }
        }else{
            gameIndex = initializeRoom(data.code, name)
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
        initializeGame(gameIndex)
        io.to(rooms[gameIndex].code).emit('colorPick', rooms[gameIndex])
    }),

    //INPUT: function activation, data object with color and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card2, playersturn)
    socket.on('colorPick', data => { //data.name and data.code required
        if (rooms[gameIndex].cardsLeft.length === 0){
            cardReset(gameIndex)
            //io.to(rooms[gameIndex].code).emit('cardsReseted')             //TODO CARDS RESETTED NOTIFICATION
        }

        let receivedCard = cardToPlayer(gameIndex,name,1)

        if ((receivedCard.color === 'heart')||(receivedCard.color === 'caro')){
            if (data.color === 'red'){
                io.to(rooms[gameIndex].code).emit('correctColor', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongColor', data.name)
            }
        }else{
            if (receivedCard.color === 'black'){
                io.to(rooms[gameIndex].code).emit('correctColor', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongColor', data.name)
            }
        }

        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players.length-1 > playerTurn){
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
            cardReset(gameIndex)
            //io.to(rooms[gameIndex].code).emit('cardsReseted')                 //TODO CARDS RESETTED NOTIFICATION
        }
        
        let receivedCard = cardToPlayer(gameIndex,name,2)

        let playerIndex = getPlayerIndex(gameIndex, name)
        if (data.upperlower === 'upper'){
            if(receivedCard.value > rooms[gameIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValue', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }else if(data.upperlower === 'lower'){
            if(receivedCard.value < rooms[gameIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValue', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }else{
            if(receivedCard.value = rooms[gameIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[gameIndex].code).emit('correctValueX', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongValue', data.name)
            }
        }

        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players.length-1 > playerTurn){
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
        console.log('1  ')
        if (rooms[gameIndex].cardsLeft.length === 0){
            cardReset(gameIndex)
            //io.to(rooms[gameIndex].code).emit('cardsReseted')
        }
        let receivedCard = cardToPlayer(gameIndex,name,3)

        let playerIndex = getPlayerIndex(gameIndex,name)
        let card1
        let card2
        if (rooms[gameIndex].playerCards[playerIndex].card1.value < rooms[gameIndex].playerCards[playerIndex].card2.value){
            card1 = rooms[gameIndex].playerCards[playerIndex].card1
            card2 = rooms[gameIndex].playerCards[playerIndex].card2
        }else{
            card1 = rooms[gameIndex].playerCards[playerIndex].card2
            card2 = rooms[gameIndex].playerCards[playerIndex].card1
        }

        if (data.innerouter === 'inner'){
            if((receivedCard.value > card1.value) && (receivedCard.value < card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlace', data.name)
            }
        }else if(data.upperlower ==='outer'){
            if((receivedCard.value < card1.value) || (receivedCard.value > card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlace', data.name)
            }
        }else{
            if((receivedCard.value === card1.value) || (receivedCard.value === card2.value)){
                io.to(rooms[gameIndex].code).emit('correctPlaceX', data.name)
            }else{
                io.to(rooms[gameIndex].code).emit('wrongPlaceX', data.name)
            }
        }

        let playerTurn = rooms[gameIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[gameIndex].players.length-1 > playerTurn){
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

    change gameIndex everywhere to roomIndex


*/