const express = require('express')()
const http = require('http').Server(express)
const io = require('socket.io')(http)


// CONSTANTS
const CARDS = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]


// CENTRAL ROOMS ARRAY - CONTAINS ALL DATA
let rooms = []


// ROOM FUNCTIONS
function initializeRoom(newCode, playerName){
    rooms.push({code: newCode, users: [playerName], roomMode: 'lobby'})
    return rooms.findIndex(x => x.code === newCode)
}


// GAME FUNCTIONS
function initializeGame(roomIndex){
    //room features: code, users, roomMode
    rooms[roomIndex].roomMode = 'inGame'
    rooms[roomIndex].gameMode = 'colorPick'

    resetPlayerCards(roomIndex)
    resetCardStack(roomIndex)

    rooms[roomIndex].players = JSON.parse(JSON.stringify(rooms[roomIndex].users))
    rooms[roomIndex].playerTurn = 0 //relevant for everything
    rooms[roomIndex].flippedCards = ['x','x','x','x','x','x','x','x','x','x'] //relevant for flipping cards
    rooms[roomIndex].drivers = [] //relevant for preempting and driving
    rooms[roomIndex].innerIndex = 0 //in preempting are we at color, value or position
    rooms[roomIndex].preemptingRightWrong = [] //relevant for preempting
    rooms[roomIndex].driverStreak = 0 //relevant for driving
}

function startFlipCards(roomIndex){  //TODO remove shit code

    rooms[roomIndex].gameMode = 'flippingCards'

    io.to(rooms[roomIndex].code).emit('updateGame', rooms[roomIndex])
    
    const INTERVALL_TIME = 3000
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*2)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*3)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*4)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*5)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*6)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*7)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*8)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*9)
    setTimeout(() => {
        flipNewCard(roomIndex)
        updateGame(roomIndex)
    },INTERVALL_TIME*10)

    rooms[roomIndex].drivers = getDrivers(roomIndex)

    if (drivers.length === 1){
        startDrive(roomIndex, drivers)
    }else{
        startPreempt(roomIndex, drivers)
    }
}

function startPreempt(roomIndex, drivers){
    rooms[roomIndex].gameMode = 'preempting'
    rooms[roomIndex].innerIndex = 0
    rooms[roomIndex].playerTurn = 0
    
    resetPlayerCards[roomIndex]
    resetCardStack(roomindex)

    updateGame(roomIndex)
}

function startDrive(roomIndex){
    rooms[roomIndex].gameMode = 'driving'
    rooms[roomIndex].innerIndex = 0
    rooms[roomIndex].playerTurn = 0

    resetPlayerCards(roomIndex)
    resetCardStack(roomindex)

    updateGame(roomIndex)
}


// GAME PICKS
//function cardPick(roomIndex, name, pick){ // TODO RELEVANT?

function colorPick(roomIndex, name, color){
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let receivedCard = cardToPlayer(roomIndex,name)
    let result

    if ((receivedCard.color === 'heart') || (receivedCard.color === 'caro')){
        if (color !== 'red'){
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = true
        }else{
            result = false
        }
    }else{
        if (color !== 'black'){
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = true
        }else{
            result = false
        }
    }
    updateGame(rooms[roomIndex])
    return result
}

function valuePick(roomIndex, name, value){
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let receivedCard = cardToPlayer(roomIndex,name)
    let playerIndex = getPlayerIndex(roomIndex, name)
    let result

    if (value === 'higher'){
        if(receivedCard.value > rooms[roomIndex].playerCards[playerIndex][0].value){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 1})
            result = false
        }
    }else if(value === 'lower'){
        if(receivedCard.value < rooms[roomIndex].playerCards[playerIndex][0].value){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 1})
            result = false
        }
    }else{
        if(receivedCard.value = rooms[roomIndex].playerCards[playerIndex][0].value){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 100})
            result = false
        }
    }
    updateGame(roomIndex)
    return result
}

function positionPick(roomIndex, name, position){
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let nextCard = 0
    while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
        nextCard++
    }

    let receivedCard = cardToPlayer(roomIndex,name)

    let playerIndex = getPlayerIndex(roomIndex,name)

    let card1
    let card2
    if (rooms[roomIndex].playerCards[playerIndex][nextCard-2].value < rooms[roomIndex].playerCards[playerIndex][nextCard-1].value){
        card1 = rooms[roomIndex].playerCards[playerIndex][nextCard-2]
        card2 = rooms[roomIndex].playerCards[playerIndex][nextCard-1]
    }else{
        card1 = rooms[roomIndex].playerCards[playerIndex][nextCard-1]
        card2 = rooms[roomIndex].playerCards[playerIndex][nextCard-2]
    }

    if (position === 'inside'){
        if((receivedCard.value > card1.value) && (receivedCard.value < card2.value)){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 1})
            result = false
        }
    }else if(position === 'outside'){
        if((receivedCard.value < card1.value) || (receivedCard.value > card2.value)){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 1})
            result = false
        }
    }else{
        if((receivedCard.value === card1.value) || (receivedCard.value === card2.value)){
            result = true
        }else{
            shotTo(roomIndex, {from: game, to: name, count: 100})
            result = false
        }
    }
    updateGame(roomIndex)
    return result
}


// GAME FUNCTIONS UTILS
function flipNewCard(roomIndex){
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let nextCard = 0
    
    while (rooms[roomIndex].flippedCards[nextCard] !== 'x'){
        nextCard++
    }

    let cardIndex = Math.floor(Math.random()*CARDS.length)
    let card = rooms[roomIndex].cardsLeft[cardIndex]

    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)

    rooms[roomIndex].flippedCards[nextCard] = card

    return card
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

function resetPlayerCards(roomIndex){
    rooms[roomIndex].playerCards = []
    for(var i = 0; i < rooms[roomIndex.players.length]; i++){
        rooms[roomIndex].playerCards[getPlayerIndex(roomIndex, player.name)] = ['x', 'x', 'x', 'x', 'x', 'x', 'x']
    }
}

function resetCardStack(roomIndex){
    rooms[roomIndex].cardsLeft = JSON.parse(JSON.stringify(CARDS))
}

function getPlayerIndex(roomIndex, name){
    let index = rooms[roomIndex].players.findIndex(obj => obj.name === name)
    return index
}

function getDrivers(roomIndex){
    //uses playerCards - writes to drivers

    let drivers = []

    for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){ //copy players that got 3 cards to drivers
        if(rooms[roomIndex].playerCards[i][0] !== 'x' && rooms[roomIndex].playerCards[i][1] !== 'x' && rooms[roomIndex].playerCards[i][2] === 'x'){
            drivers.push(rooms[roomIndex].players[i].name)
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){ //copy players that got 2 cards to drivers
            if((rooms[roomIndex].playerCards[i][2] === 'x' ^ rooms[roomIndex].playerCards[i][2] === 'x' ^ rooms[roomIndex].playerCards[i][2] === 'x') &&
            !(rooms[roomIndex].playerCards[i][2] === 'x' && rooms[roomIndex].playerCards[i][2] === 'x' && rooms[roomIndex].playerCards[i][2] === 'x')){
                drivers.push(rooms[roomIndex].players[i].name)
            }
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){ //copy players that got 1 cards to drivers
            if((rooms[roomIndex].playerCards[i][2] !== 'x' ^ rooms[roomIndex].playerCards[i][2] !== 'x' ^ rooms[roomIndex].playerCards[i][2] !== 'x') &&
            !(rooms[roomIndex].playerCards[i][2] !== 'x' && rooms[roomIndex].playerCards[i][2] !== 'x' && rooms[roomIndex].playerCards[i][2] !== 'x')){
                drivers.push(rooms[roomIndex].players[i].name)
            }
        }
    }

    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length-1; i++){ //copy all players to drivers
                drivers.push(rooms[roomIndex].players[i].name)
        }
    }

    return drivers
}

//TODO function get last card of the array


// EMIT FUNCTIONS
function updateRoom(roomIndex){
    io.to(rooms[roomIndex].code).emit('updateRoom', rooms[roomIndex]) //IMPL
}

function updateGame(roomIndex){
    io.to(rooms[roomIndex].code).emit('updateGame', rooms[roomIndex]) //IMPL
}

function shotTo(roomIndex, data){ //data = {from: , to: , count: }
    //count = 100 when x was correct

    io.to(roomCode).emit('shotTo', {from: data.from, to: data.to, count: data.count})
}


io.on('connection', socket => {
    let roomCode
    let roomIndex
    let name

    // ROOM FEATURES
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

        socket.emit('roomEntered', name) //IMPL
        updateRoom(roomIndex)

        console.log(data.name + ' joined ' + roomCode + ' with the index ' + roomIndex)
    }),

    //
    socket.on('newMessage', data => {
        io.to(roomCode).emit('newMessage', {message: data.message, name: data.name})
    }),

    socket.on('startGame', () => {
        initializeGame(roomIndex)
        updateGame(roomIndex)
    }),

    socket.on('disconnect', () => { //TODO remove room after players left

    })


    // GAME FEATURES
    socket.on('shotTo', data => { //data = {from: , to: , count: }
        shotTo({from: data.from, to: data.to, count: data.count})
    }),


    // GAME PICKS
    socket.on('colorPick', data => { //data = {name: , color: }
    //OUTPUT: players receive changed game object
    //(changes: gameMode, cardsLeft, cards[player].card2, playerTurn)

        colorPick(roomIndex, name, data.color) //deals card and updates game

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            updateGame(roomIndex)
        }else{
            rooms[roomIndex].gameMode = 'valuePick'
            rooms[roomIndex].playerTurn = 0
            updateGame(roomIndex)
        }
    }),

    socket.on('valuePick', data => { //data = {name: , value: higher/lower} 
    //OUTPUT: players receive changed game object
    //(changes: gameMode, cardsLeft, cards[player].card2, playerTurn)

        positionPick(roomIndex, name, data.value)

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            updateGame(roomIndex)
        }else{
            rooms[roomIndex].gameMode = 'positionPick'
            rooms[roomIndex].playerTurn = 0
            updateGame(roomIndex)
        }
    }),

    socket.on('positionPick', data => { // data = {name: , pick: inside/outside}
    //OUTPUT: players receive changed game object
    //(changes: gameMode, cardsLeft, playerCards, playerTurn)

        valuePick(roomIndex, name, data.pick)

        let playerTurn = rooms[roomIndex].playerTurn // TODO: SET THIS TO BEGINNING AND REMOVE INDEXOF PLAYER
        if (rooms[roomIndex].players.length-1 > playerTurn){
            rooms[roomIndex].playerTurn++
            updateGame(roomIndex)
        }else{
            rooms[roomIndex].gameMode = 'flippingCards'
            rooms[roomIndex].playerTurn = 0
            updateGame(roomIndex)
            startFlipCards(roomIndex)
        }
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
            socket.emit('distributeShots', rooms[roomIndex].flippedCards[rooms[roomIndex].flippedCards.length-1].row) //IMPL
        }
    }),

    socket.on('preemptPick', data => { //data = {name: , pick: }} pick color, value or position

        if(rooms[roomIndex].drivers[playerTurn].name === data.name){  //check if players turn
            if((rooms[roomIndex].innerIndex % 3) === 0){ //every 3 rounds starts with color again
                preemptingRightWrong[playerTurn] = colorPick(roomIndex, name, data.pick)
            }else if((rooms[roomIndex].innerIndex % 3) === 1){
                preemptingRightWrong[playerTurn] = valuePick(roomIndex, name, data.pick)
            }else if((rooms[roomIndex].innerIndex % 3) === 2){
                preemptingRightWrong[playerTurn] = positionPick(roomIndex, name, data.pick)
            }

            if((playerTurn+1) === drivers.length){ //if all drivers picked evaluate loosers
                let driversTempSave = JSON.parse(JSON.stringify(rooms[roomIndex].drivers))
                for(var i = 0; i<drivers.length; i++){
                    if(preemptingRightWrong[ị]){
                        drivers.splice(i,1)
                    }
                }
    
                if(drivers.length === 0){
                    drivers = driversTempSave
                    rooms[roomIndex].innerIndex++
                }else if(drivers.length === 1){
                    startDrive(roomIndex, driver) //change to driving mode
                }else{
                    rooms[roomIndex].innerIndex++
                    updateGame(roomIndex)
                }
            }else{ //next driver has to pick
                rooms[roomIndex].playerTurn += 1
                updateGame(roomIndex)
            }
        }else{
            //TODO react on not players turn
        }
    }),

    socket.on('driverPick', data => { //data = {name: , pick: } pick options: black, red, higher, lower, inside, outside

        if(rooms[roomIndex].drivers[playerTurn].name === data.name){  //check if players turn
            if((innerIndex % 3) === 0){ //every 3 rounds starts with color again
                if(colorPick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                }
            }else if((innerIndex % 3) === 1){
                if(valuePick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                }
            }else if((innerIndex % 3) === 2){
                if(positionPick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                }
            }

            if(innerIndex === 4){
                rooms[roomIndex].gameMode = 'result'
            }

            updateGame(roomIndex)
        }else{
            //TODO react on not players turn
        }
    })
})


http.listen(3000, () => {
    console.log('listening at :3000 ...')
})


/*
    split backend into multiple files

    vue create asked for use history mode for router... (requires proper server setup for index fallback in production)

    only accept socket calls if its the callers turn and the right game mode

    special feature... we got some shots stacked... did everybody drink? 3 players have to approve


*/