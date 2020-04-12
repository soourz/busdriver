const express = require('express')()
const http = require('http').Server(express)
const io = require('socket.io')(http)

let rooms = []

const CARDS = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]

function getPlayerIndex(roomIndex, name){
    let index = rooms[roomIndex].players.findIndex(obj => obj.name === name)
    return index
}

function flipNewCard(roomIndex, number){
    let cardIndex = Math.floor(Math.random()*CARDS.length)
    let card = rooms[roomIndex].cardsLeft[cardIndex]
    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)
    rooms[roomIndex].flippedCards[number] = card
    if(number < 5){
        rooms[roomIndex].flippedCards[number].row = 1
    }else if(number < 8){
        rooms[roomIndex].flippedCards[number].row = 2
    }else if(number < 10){
        rooms[roomIndex].flippedCards[number].row = 3
    }else{
        rooms[roomIndex].flippedCards[number].row = 4
    }
    return card
}

function flipCards(roomIndex){                                                    //TODO REMOVE FUCKING SHIT CODE

    rooms[roomIndex].gameMode = 'flippingCards'

    io.to(rooms[roomIndex].code).emit('updateGame', rooms[roomIndex])
    
    const INTERVALL_TIME = 3000
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 1), row: 1})
        rooms[roomIndex].flippedCard = 1
    },INTERVALL_TIME)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 2), row: 1})
        rooms[roomIndex].flippedCard = 2
    },INTERVALL_TIME*2)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 3), row: 1})
        rooms[roomIndex].flippedCard = 3
    },INTERVALL_TIME*3)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 4), row: 1})
        rooms[roomIndex].flippedCard = 4
    },INTERVALL_TIME*4)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 5), row: 2})
        rooms[roomIndex].flippedCard = 5
    },INTERVALL_TIME*5)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 6), row: 2})
        rooms[roomIndex].flippedCard = 6
    },INTERVALL_TIME*6)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 7), row: 2})
        rooms[roomIndex].flippedCard = 7
    },INTERVALL_TIME*7)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 8), row: 3})
        rooms[roomIndex].flippedCard = 8
    },INTERVALL_TIME*8)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 9), row: 3})
        rooms[roomIndex].flippedCard = 9
    },INTERVALL_TIME*9)
    setTimeout(() => {
        io.to(rooms[roomIndex].code).emit('cardFlipped', {card: flipNewCard(roomIndex, 10), row: 4})
        rooms[roomIndex].flippedCard = 10
    },INTERVALL_TIME*10)

    evalMostCards(roomIndex)    
}

function evalMostCards(roomIndex){
    let drivers = []
    for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){
        if(rooms[roomIndex].playerCards[i].card3 !== 'x' && rooms[roomIndex].playerCards[i].card3 !== 'x' && rooms[roomIndex].playerCards[i].card3 === 'x'){
            drivers.push(rooms[roomIndex].playerCards[i].name)
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){
            if((rooms[roomIndex].playerCards[i].card3 === 'x' ^ rooms[roomIndex].playerCards[i].card3 === 'x' ^ rooms[roomIndex].playerCards[i].card3 === 'x') &&
            !(rooms[roomIndex].playerCards[i].card3 === 'x' && rooms[roomIndex].playerCards[i].card3 === 'x' && rooms[roomIndex].playerCards[i].card3 === 'x')){
                drivers.push(rooms[roomIndex].playerCards[i].name)
            }
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){
            if((rooms[roomIndex].playerCards[i].card3 !== 'x' ^ rooms[roomIndex].playerCards[i].card3 !== 'x' ^ rooms[roomIndex].playerCards[i].card3 !== 'x') &&
            !(rooms[roomIndex].playerCards[i].card3 !== 'x' && rooms[roomIndex].playerCards[i].card3 !== 'x' && rooms[roomIndex].playerCards[i].card3 !== 'x')){
                drivers.push(rooms[roomIndex].playerCards[i].name)
            }
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){
                drivers.push(rooms[roomIndex].playerCards[i].name)
        }
    }
    if (drivers.length === 1){
        startDrive(roomIndex, drivers)
    }else{
        startPreempt(roomIndex, drivers)
    }
}

function startPreempt(roomIndex, drivers){
    rooms[roomIndex].gameMode = 'preempting'
    rooms[roomIndex].preemptIndex = 0
    rooms[roomIndex].playerTurn = 0
    for(driver of drivers){
        rooms[roomIndex].playerCards = {name: drivers}
    }
    if(cardsLeft.length === 0){
        cardReset(roomindex)
    }
    io.to(roomCode).emit('updateGame')
}

function startDrive(roomIndex){
    rooms[roomIndex].gameMode = 'driving'
    resetPlayerCards(roomIndex, name)

    //TODO
}

function cardToPlayer(roomIndex, name){ // search who calls this function and remove cardno
    let cardIndex = Math.floor(Math.random()*CARDS.length)
    let playerIndex = getPlayerIndex(roomIndex, name)
    let card = rooms[roomIndex].cardsLeft[cardIndex]
    let nextCard = 0

    while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
        nextCard++
    }

    rooms[roomIndex].playerCards[playerIndex][nextCard] === card

    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)

    return card
}

function cardReset(roomIndex){
    rooms[roomIndex].cardsLeft = CARDS
}

function emptyGlasses(roomIndex, victims){ //victims 'all' or 'picker'
    //TODO
}

function initializeRoom(newCode, playerName){
    rooms.push({code: newCode, users: [playerName], roomMode: 'lobby'})
    return rooms.findIndex(x => x.code === newCode)
}

function initializeGame(roomIndex){
    //room features: code, users, roomMode
    rooms[roomIndex].roomMode = 'inGame'
    rooms[roomIndex].gameMode = 'colorPick'

    resetPlayerCards(roomIndex)
    cardReset(roomIndex)

    rooms[roomIndex].players = [].concat(rooms[roomIndex].users)
    rooms[roomIndex].flippedCards = [] //relevant for flipping cards
    rooms[roomIndex].drivers = [] //relevant for preempting and driving
    rooms[roomIndex].preemptingRightWrong = [] //relevant for preempting
    rooms[roomIndex].preemptIndex = 0 //in preempting are we at color, value or position
    rooms[roomIndex].playerTurn = 0 //relevant for preempting

    rooms[roomIndex].driverStreak = 0 //relevant for driving
}

function resetPlayerCards(roomIndex){
    rooms[roomIndex].playerCards = []
    for(player of rooms[roomIndex].players){
        rooms[roomIndex].playerCards[getPlayerIndex] = ['x', 'x', 'x', 'x', 'x', 'x', 'x']
    }}

io.on('connection', socket => {
    let roomCode
    let roomIndex
    let name

    socket.on('joinRoom', data => { //data = {code: '', name: ''}
        roomIndex = rooms.findIndex(room => room.code === data.code)
        name = data.name
        roomCode = data.code
        socket.join(roomCode)

        if (roomIndex !== -1){
            rooms[roomIndex].users.push({name: name, id: socket.id})
            if (rooms[roomIndex].roomMode !== 'lobby'){
                //TODO
            }
        }else{
            roomIndex = initializeRoom(data.code, name)
        }

        io.to(roomCode).emit('updateRoom', rooms[roomIndex]) //IMPL

        console.log(data.name + ' joined ' + roomCode + ' with the index ' + roomIndex)
    }),

    //
    socket.on('newMessage', data => {
        io.to(roomCode).emit('newMessage', {message: data.message, name: data.name})
    }),

    socket.on('shotTo', data => {
        io.to(roomCode).emit('shotTo', {from: data.from, to: data.to})
    }),

    socket.on('gotFlippedCard', () => {
        let cardno
        let playerIndex = getPlayerIndex(roomIndex, name)
        if(rooms[roomIndex].playerCards[playerIndex][0].value === rooms[roomIndex].flippedCards[rooms[roomIndex].flippedCards.length-1].value){
            cardno = 1
            rooms[roomIndex].playerCards[playerIndex][0] = rooms[roomIndex].playerCards[playerIndex][2]
            rooms[roomIndex].playerCards[playerIndex][2] = 'x'
        }else if(rooms[roomIndex].playerCards[playerIndex][1].value === rooms[roomIndex].flippedCards[rooms[roomIndex].flippedCards.length-1].value){
            cardno = 2
            rooms[roomIndex].playerCards[playerIndex][1] = rooms[roomIndex].playerCards[playerIndex][2]
            rooms[roomIndex].playerCards[playerIndex][2] = 'x'
        }else if(rooms[roomIndex].playerCards[playerIndex][2].value === rooms[roomIndex].flippedCards[rooms[roomIndex].flippedCards.length-1].value){
            cardno = 3
            rooms[roomIndex].playerCards[playerIndex][2] = 'x'
        }else{
            cardno = 0
            //TODO WRONG CALL RESPONSE
        }
        if( cardno > 0){
            rooms[roomIndex].playerCards 
            socket.emit('distributeShots', rooms[roomIndex].flippedCards[rooms[roomIndex].flippedCards.length-1].row)
        }
    }),

    socket.on('preemptPick', data => { //data = {name: , pick: }} pick color, value or position
        let playerIndex = getPlayerIndex(roomIndex, name)
        let newCard = cardToPlayer(roomIndex, name)
        if(rooms[roomIndex].playerCards[playersTurn].name === data.name){ //eval and return right or wrong
            if((preemptIndex % 3) === 0){ //every 3 rounds starts with color again
                if(data.pick === newCard.color){
                    //set playersturn +1
                    //preemptingRightWrong[playerIndex] = true
                    //update game
                }else{
                    shotTo
                }
            }else if((preemptIndex % 3) === 1){
                if(pick ){
                    
                }else{
                    shotTo
                }
            }else if((preemptIndex % 3) === 2){
                if(rooms[roomIndex].playerCards[playerIndex].cards[preemptIndex].color === newCard.color){
                    
                }else{
                    shotTo
                }
            }else{
                soc
            }
        }

        if(preemptIndex === drivers.length){
            let driversTempSave = xx//copy drivers array
            for(var i = 0; i<drivers.length; i++){
                if(preemptingRightWrong[ị]){
                    drivers.splice(i,1)
                }
            }

            if(drivers.length === 0){
                drivers = driversTempSave
            }

            if(drivers.length === 1){
                startDrive(roomIndex, driver)
            }else{
                io.to(roomCode).emit('updateGame', rooms[roomIndex])
            }
        }
    }),



    socket.on('driverPick', data => { //data = {name: , pick: } pick options: black, red, higher, lower, inside, outside
    
        let card = cardToPlayer(roomIndex, name)
        let nextCard = 0
        while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
            nextCard++
        }

        if((rooms[roomIndex].driverStreak % 3) === 0){ // => color
            if(data.pick === card.color){
                rooms[roomIndex].driverStreak++
            }else{
                rooms[roomIndex].diverStreak = 0
            }
        }else if((rooms[roomIndex].driverStreak % 3) === 1 ){ // => value
            if(data.pick === 'higher'){
                if(card.value > rooms[roomIndex].playerCards[driverStreak].value){
                    //TODO emit
                    rooms[roomIndex].driverStreak++
                }else{
                    rooms[roomIndex].driverStreak = 0
                }
            }else if(data.pick === 'lower'){
                if(card.value < rooms[roomIndex].playerCards[driverStreak].value){
                    rooms[roomIndex].driverStreak++
                }else{
                    rooms[roomIndex].driverStreak = 0
                }
            }else{
                if(card.value === rooms[roomIndex].playerCards[driverStreak].value){
                    rooms[roomIndex].driverStreak++
                    emptyGlasses(roomIndex, 'all')
                }else{
                    rooms[roomIndex].driverStreak = 0
                    emptyGlasses(roomIndex, 'picker')
                }
            }
        }else if((rooms[roomIndex].driverStreak % 3) === 2 ){ // => position

            let higherCard  //first if else to eval higherCard and lowerCard
            let lowerCard
            if (rooms[roomIndex].playerCards[playerIndex][0].value < rooms[roomIndex].playerCards[playerIndex][1].value){
                higherCard = rooms[roomIndex].playerCards[playerIndex][1]
                lowerCard = rooms[roomIndex].playerCards[playerIndex][0]
            }else{
                higherCard = rooms[roomIndex].playerCards[playerIndex][0]
                lowerCard = rooms[roomIndex].playerCards[playerIndex][1]
            }

            if(data.pick === 'inside'){
                if((card.value > lowerCard.value) && (card.value < higherCard.value)){
                    rooms[roomIndex].driverStreak++
                }else{
                    rooms[roomIndex].driverStreak = 0
                }
            }else if(data.pick ==='outside'){
                if((card.value < lowerCard.value) || (card.value > higherCard.value)){
                    rooms[roomIndex].driverStreak++
                }else{
                    rooms[roomIndex].driverStreak = 0
                }
            }else{
                if((card.value === higherCard) || (card.value === lowerCard.value)){
                    rooms[roomIndex].driverStreak++
                    emptyGlasses('all')
                }else{
                    rooms[roomIndex].driverStreak = 0
                    emptyGlasses(roomIndex, 'picker')
                }
            }
        }else{
            socket.emit('notClientsTurn') //impl
        }
    }),

    //
    socket.on('startGame', () => {
        initializeGame(roomIndex)
        io.to(rooms[roomIndex].code).emit('colorPick', rooms[roomIndex])
    }),

    //INPUT: function activation, data object with color and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card2, playersturn)
    socket.on('colorPick', data => { //data.name and data.code required

        console.log(data)
        if (rooms[roomIndex].cardsLeft.length === 0){
            cardReset(roomIndex)
            //io.to(rooms[roomIndex].code).emit('cardsReseted')             //TODO CARDS RESETTED NOTIFICATION
        }

        let receivedCard = cardToPlayer(roomIndex,name)

        if ((receivedCard.color === 'heart')||(receivedCard.color === 'caro')){
            if (data.color === 'red'){
                io.to(rooms[roomIndex].code).emit('correctColor', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongColor', data.name)
            }
        }else{
            if (receivedCard.color === 'black'){
                io.to(rooms[roomIndex].code).emit('correctColor', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongColor', data.name)
            }
        }

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            io.to(rooms[roomIndex].code).emit('colorPick', rooms[roomIndex])
        }else{
            rooms[roomIndex].gameMode = 'valuePick'
            rooms[roomIndex].playerTurn = 0
            io.to(rooms[roomIndex].code).emit('valuePick', rooms[roomIndex])
        }
    }),

    //INPUT: function activation, data object with upperlower and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card2, playersturn)
    socket.on('valuePick', data => {
        if (rooms[roomIndex].cardsLeft.length === 0){
            cardReset(roomIndex)
            //io.to(rooms[roomIndex].code).emit('cardsReseted')                 //TODO CARDS RESETTED NOTIFICATION
        }
        
        let receivedCard = cardToPlayer(roomIndex,name)

        let playerIndex = getPlayerIndex(roomIndex, name)
        if (data.value === 'higher'){
            if(receivedCard.value > rooms[roomIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[roomIndex].code).emit('updateGame', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongValue', data.name)
            }
        }else if(data.value === 'lower'){
            if(receivedCard.value < rooms[roomIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[roomIndex].code).emit('correctValue', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongValue', data.name)
            }
        }else{
            if(receivedCard.value = rooms[roomIndex].playerCards[playerIndex].card1.value){
                io.to(rooms[roomIndex].code).emit('correctValueX', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongValue', data.name)
            }
        }

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            io.to(rooms[roomIndex].code).emit('valuePick', rooms[roomIndex])
        }else{
            rooms[roomIndex].gameMode = 'positionPick'
            rooms[roomIndex].playerTurn = 0
            io.to(rooms[roomIndex].code).emit('positionPick', rooms[roomIndex])
        }
    }),

    //INPUT: function activation, data object with innerouter and name
    //OUTPUT: players receive changed game object (changes: gameMode, cardsLeft, cards[player].card3, playersturn)
    socket.on('positionPick', data => { // data = {name: , pick: }
        if (rooms[roomIndex].cardsLeft.length === 0){
            cardReset(roomIndex)
            //io.to(rooms[roomIndex].code).emit('cardsReseted')
        }
        let receivedCard = cardToPlayer(roomIndex,name)

        let playerIndex = getPlayerIndex(roomIndex,name)
        let card1
        let card2
        if (rooms[roomIndex].playerCards[playerIndex][0].value < rooms[roomIndex].playerCards[playerIndex][1].value){
            card1 = rooms[roomIndex].playerCards[playerIndex].card1
            card2 = rooms[roomIndex].playerCards[playerIndex].card2
        }else{
            card1 = rooms[roomIndex].playerCards[playerIndex].card2
            card2 = rooms[roomIndex].playerCards[playerIndex].card1
        }

        if (data.pick === 'inside'){
            if((receivedCard.value > card1.value) && (receivedCard.value < card2.value)){
                io.to(rooms[roomIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongPlace', data.name)
            }
        }else if(data.pick ==='outside'){
            if((receivedCard.value < card1.value) || (receivedCard.value > card2.value)){
                io.to(rooms[roomIndex].code).emit('correctPlace', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongPlace', data.name)
            }
        }else{
            if((receivedCard.value === card1.value) || (receivedCard.value === card2.value)){
                io.to(rooms[roomIndex].code).emit('correctPlaceX', data.name)
            }else{
                io.to(rooms[roomIndex].code).emit('wrongPlaceX', data.name)
            }
        }

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            io.to(rooms[roomIndex].code).emit('positionPick', rooms[roomIndex])
        }else{
            rooms[roomIndex].gameMode = 'flippingCards'
            rooms[roomIndex].playerTurn = 0
            flipCards(roomIndex)
        }
    }),

    socket.on('disconnect', () => { //TODO remove room after players left

    })
})

http.listen(3000, () => {
    console.log('listening at :3000 ...')
})


/*
    vue create asked for use history mode for router... (requires proper server setup for index fallback in production)

    only accept functions if players turn and game mode right

    double names

    special feature... we got some shots stacked... did everybody drink? 3 players have to approve
*/