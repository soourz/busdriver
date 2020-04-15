const express = require('express')()
const http = require('http').Server(express)
const io = require('socket.io')(http)


// CONSTANTS
const CARDS = [{color: 'heart', value: 7},{color: 'heart', value: 8},{color: 'heart', value: 9},{color: 'heart', value: 10},{color: 'heart', value: 11},{color: 'heart', value: 12},{color: 'heart', value: 13},{color: 'heart', value: 14},{color: 'pik', value: 7},{color: 'pik', value: 8},{color: 'pik', value: 9},{color: 'pik', value: 10},{color: 'pik', value: 11},{color: 'pik', value: 12},{color: 'pik', value: 13},{color: 'pik', value: 14},{color: 'cross', value: 7},{color: 'cross', value: 8},{color: 'cross', value: 9},{color: 'cross', value: 10},{color: 'cross', value: 11},{color: 'cross', value: 12},{color: 'cross', value: 13},{color: 'cross', value: 14},{color: 'caro', value: 7},{color: 'caro', value: 8},{color: 'caro', value: 9},{color: 'caro', value: 10},{color: 'caro', value: 11},{color: 'caro', value: 12},{color: 'caro', value: 13},{color: 'caro', value: 14}]


// CENTRAL ROOMS ARRAY - CONTAINS ALL DATA
let rooms = []


// ROOM FUNCTIONS
function initializeRoom(newCode, userObj){
    console.log('initializeRoom')
    rooms.push({code: newCode, users: [userObj], roomMode: 'lobby', gameMode: 'preparing'})
    return rooms.findIndex(room => room.code === newCode)
}


// GAME FUNCTIONS
function initializeGame(roomIndex){
    console.log('initializeGame')

    //room features: code, users, roomMode
    rooms[roomIndex].roomMode = 'inGame'
    rooms[roomIndex].gameMode = 'colorPick'

    rooms[roomIndex].players = JSON.parse(JSON.stringify(rooms[roomIndex].users))
    rooms[roomIndex].playerTurn = 0 //relevant for everything
    rooms[roomIndex].flippedCards = ['x','x','x','x','x','x','x','x','x','x'] //relevant for flipping cards
    rooms[roomIndex].drivers = [] //relevant for preempting and driving
    rooms[roomIndex].innerIndex = 0 //in preempting and driving are we at color, value or position
    rooms[roomIndex].preemptingRightWrong = [] //relevant for preempting

    resetPlayerCards(roomIndex)
    resetCardStack(roomIndex)
}

function startFlipCards(roomIndex){  //TODO remove shit code
    console.log('startFlipCards')

    rooms[roomIndex].gameMode = 'flippingCards'
    rooms[roomIndex].innerIndex = 0


    updateGame(roomIndex)

    const INTERVALL_TIME = 500

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
    setTimeout(() => {
        rooms[roomIndex].drivers = getDrivers(roomIndex)

        if (rooms[roomIndex].drivers.length === 1){
            startDrive(roomIndex, rooms[roomIndex].drivers)
        }else{
            startPreempt(roomIndex, rooms[roomIndex].drivers)
        }
    },INTERVALL_TIME*11)
}

function startPreempt(roomIndex, drivers){
    console.log('startPreempt')
    rooms[roomIndex].gameMode = 'preempting'
    rooms[roomIndex].innerIndex = 0
    rooms[roomIndex].playerTurn = 0
    rooms[roomIndex].preemptingRightWrong = []
    
    resetPlayerCards(roomIndex)
    resetCardStack(roomIndex)

    updateGame(roomIndex)
}

function startDrive(roomIndex){
    rooms[roomIndex].gameMode = 'driving'
    rooms[roomIndex].innerIndex = 0
    rooms[roomIndex].playerTurn = 0

    resetPlayerCards(roomIndex)
    resetCardStack(roomIndex)

    updateGame(roomIndex)
}


// GAME PICKS
// function cardPick(roomIndex, name, pick){
//     if (innerIndex === 0){

//     }else if(innerIndex === 1){

//     }else if(innerIndex === 2){

//     }
// }

function colorPick(roomIndex, name, color){
    console.log('colorPick')
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let receivedCard = cardToPlayer(roomIndex,name)
    let result

    if ((receivedCard.color === 'heart') || (receivedCard.color === 'caro')){
        if (color !== 'red'){
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }else{
            result = true
        }
    }else{
        if (color !== 'black'){
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }else{
            result = true
        }
    }
    return result
}

function valuePick(roomIndex, name, value){
    console.log('valuePick')
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let playerIndex = getUserIndex(roomIndex, name)
    let nextCard = 0
    while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
        nextCard++
    }

    let receivedCard = cardToPlayer(roomIndex,name)
    let result

    if (value === 'higher'){
        if(receivedCard.value > rooms[roomIndex].playerCards[playerIndex][nextCard-1].value){
            result = true
        }else{
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }
    }else if(value === 'lower'){
        if(receivedCard.value < rooms[roomIndex].playerCards[playerIndex][nextCard-1].value){
            result = true
        }else{
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }
    }else{
        if(receivedCard.value = rooms[roomIndex].playerCards[playerIndex][nextCard-1].value){
            result = true
        }else{
            shotTo(roomIndex, {from: 'game', to: name, count: 100})
            result = false
        }
    }
    return result
}

function positionPick(roomIndex, name, position){
    console.log('positionPick')

    let playerIndex = getUserIndex(roomIndex,name)

    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let nextCard = 0
    while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
        nextCard++
    }

    let receivedCard = cardToPlayer(roomIndex,name)

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
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }
    }else if(position === 'outside'){
        if((receivedCard.value < card1.value) || (receivedCard.value > card2.value)){
            result = true
        }else{
            shotTo(roomIndex, {from: 'game', to: name, count: 1})
            result = false
        }
    }else{
        if((receivedCard.value === card1.value) || (receivedCard.value === card2.value)){
            result = true
        }else{
            shotTo(roomIndex, {from: 'game', to: name, count: 100})
            result = false
        }
    }
    return result
}


// GAME FUNCTIONS UTILS
function flipNewCard(roomIndex){
    console.log('flipNewCard')
    if (rooms[roomIndex].cardsLeft.length === 0){
        resetCardStack(roomIndex)
    }

    let nextCard = 0
    
    while (rooms[roomIndex].flippedCards[nextCard] !== 'x'){
        nextCard++
    }

    let cardIndex = Math.floor(Math.random()*rooms[roomIndex].cardsLeft.length)
    let card = rooms[roomIndex].cardsLeft[cardIndex]

    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)

    rooms[roomIndex].flippedCards[nextCard] = card

    return card
}

function cardToPlayer(roomIndex, name){ // search who calls this function and remove cardno

    let cardIndex = Math.floor(Math.random()*rooms[roomIndex].cardsLeft.length)
    let playerIndex = getUserIndex(roomIndex, name)
    let card = rooms[roomIndex].cardsLeft[cardIndex]
    let nextCard = 0
    while (rooms[roomIndex].playerCards[playerIndex][nextCard] !== 'x'){
        nextCard++
    }
    rooms[roomIndex].playerCards[playerIndex][nextCard] = JSON.parse(JSON.stringify(card)) //anonymous error... maybe async?

    rooms[roomIndex].cardsLeft.splice(cardIndex, 1)

    return card
}

function resetPlayerCards(roomIndex){
    console.log('resetPlayerCards')
    rooms[roomIndex].playerCards = []
    for(var i = 0; i < rooms[roomIndex].players.length; i++){
        rooms[roomIndex].playerCards[getUserIndex(roomIndex, rooms[roomIndex].players[i].name)] = ['x', 'x', 'x', 'x', 'x', 'x', 'x']
    }
}

function resetCardStack(roomIndex){
    console.log('resetCardStack')
    rooms[roomIndex].cardsLeft = JSON.parse(JSON.stringify(CARDS))
}

function getUserIndex(roomIndex, name){
    let index = rooms[roomIndex].users.findIndex(user => user.name === name)
    return index
}

function getDrivers(roomIndex){
    //uses playerCards - writes to drivers

    function xor(a,b,c){
        if(a && b && c){
          return false //You have to make an exception for all conditions being true
         }
        return ((a && !b && !c) || (!a && b && !c) || (!a && !b && c) || (a && b && c))
    }

    console.log('getDrivers')

    let drivers = []

    for(var i = 0; i<rooms[roomIndex].playerCards.length; i++){ //copy players that got 3 cards to drivers
        if((rooms[roomIndex].playerCards[i][0] !== 'x') && (rooms[roomIndex].playerCards[i][1] !== 'x') && (rooms[roomIndex].playerCards[i][2] === 'x')){
            drivers.push(rooms[roomIndex].players[i].name)
        }
    }

    if (drivers.length === 0){
        
        for(var i = 0; i<rooms[roomIndex].playerCards.length; i++){ //copy players that got 2 cards to drivers

            if(((rooms[roomIndex].playerCards[i][0] === 'x') ^ (rooms[roomIndex].playerCards[i][1] === 'x') ^ (rooms[roomIndex].playerCards[i][2] === 'x')) &&
            !((rooms[roomIndex].playerCards[i][0] === 'x') && (rooms[roomIndex].playerCards[i][1] === 'x') && (rooms[roomIndex].playerCards[i][2] === 'x'))){
                drivers.push(rooms[roomIndex].players[i].name)
            }
        }
    }
    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length; i++){ //copy players that got 1 cards to drivers
            
            if(((rooms[roomIndex].playerCards[i][0] !== 'x') ^ (rooms[roomIndex].playerCards[i][1] !== 'x') ^ (rooms[roomIndex].playerCards[i][2] !== 'x')) &&
            !((rooms[roomIndex].playerCards[i][0] !== 'x') && (rooms[roomIndex].playerCards[i][1] !== 'x') && (rooms[roomIndex].playerCards[i][2] !== 'x'))){
                drivers.push(rooms[roomIndex].players[i].name)
            }
        }
    }

    if (drivers.length === 0){
        for(var i = 0; i<rooms[roomIndex].playerCards.length; i++){ //copy all players to drivers
                drivers.push(rooms[roomIndex].players[i].name)
        }
    }

    return drivers
}

//TODO function get last card of the array


// EMIT FUNCTIONS
function updateRoom(roomIndex){

}

function updateGame(roomIndex){
    console.log('updateGame')
    io.to(rooms[roomIndex].code).emit('updateGame', rooms[roomIndex]) //IMPL
}

function shotTo(roomIndex, data){ //data = {from: , to: , count: }
    //count = 100 when x was correct

    io.to(rooms[roomIndex].code).emit('shotTo', {from: data.from, to: data.to, count: data.count}) //IMPL
}


io.on('connection', socket => {
    let roomCode
    let roomIndex
    let name

    // ROOM FEATURES
    socket.on('joinRoom', data => { //data = {code: '', name: ''}
        console.log('socket joinRoom')
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
            roomIndex = initializeRoom(data.code, {name: name, id: socket.id})
        }

        //updateRoom(roomIndex) TODO
        updateGame(roomIndex)

        socket.emit('roomEntered', name) //IMPL

        console.log(data.name + ' joined ' + roomCode + ' with the index ' + roomIndex)
    }),

    //
    socket.on('newMessage', data => { //TODO add unique message id
        io.to(roomCode).emit('newMessage', {message: data.message, name: data.name}) //IMPL
    }),

    socket.on('startGame', () => {
        initializeGame(roomIndex)
        updateGame(roomIndex)
    }),

    socket.on('disconnect', () => { //TODO remove room after players left

    })


    // GAME FEATURES
    socket.on('shotTo', data => { //data = {from: , to: , count: }
        console.log('socket shotTo')
        shotTo({from: data.from, to: data.to, count: data.count})
    }),


    // GAME PICKS
    socket.on('colorPick', data => { //data = {name: , color: }
    //OUTPUT: players receive changed game object
    //(changes: gameMode, cardsLeft, cards[player].card2, playerTurn)

        colorPick(roomIndex, name, data.color) //deals card

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

        valuePick(roomIndex, name, data.value)

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

        positionPick(roomIndex, name, data.pick)

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
        let playerIndex = getUserIndex(roomIndex, name)
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

        if(rooms[roomIndex].players[rooms[roomIndex].playerTurn].name === data.name){  //check if players turn
            if((rooms[roomIndex].innerIndex % 3) === 0){ //every 3 rounds starts with color again
                rooms[roomIndex].preemptingRightWrong[rooms[roomIndex].playerTurn] = colorPick(roomIndex, name, data.pick)
            }else if((rooms[roomIndex].innerIndex % 3) === 1){
                rooms[roomIndex].preemptingRightWrong[rooms[roomIndex].playerTurn] = valuePick(roomIndex, name, data.pick)
            }else if((rooms[roomIndex].innerIndex % 3) === 2){
                rooms[roomIndex].preemptingRightWrong[rooms[roomIndex].playerTurn] = positionPick(roomIndex, name, data.pick)
            }

            if((rooms[roomIndex].playerTurn+1) === rooms[roomIndex].drivers.length){ //if all drivers picked evaluate loosers
                let driversTempSave = JSON.parse(JSON.stringify(rooms[roomIndex].drivers))
                for(var i = 0; i<rooms[roomIndex].drivers.length; i++){
                    if(rooms[roomIndex].preemptingRightWrong[i]){
                        rooms[roomIndex].drivers.splice(i,1)
                    }
                }
    
                if(rooms[roomIndex].drivers.length === 0){
                    rooms[roomIndex].drivers = driversTempSave
                    rooms[roomIndex].innerIndex++
                }else if(rooms[roomIndex].drivers.length === 1){
                    startDrive(roomIndex, rooms[roomIndex].drivers[0]) //change to driving mode
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
        console.log('socket driverPick')
        if(rooms[roomIndex].drivers[rooms[roomIndex].playerTurn] === data.name){  //check if players turn
            if((rooms[roomIndex].innerIndex % 3) === 0){ //every 3 rounds starts with color again
                if(colorPick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                    resetPlayerCards(roomIndex)
                }
            }else if((rooms[roomIndex].innerIndex % 3) === 1){
                if(valuePick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                    resetPlayerCards(roomIndex)
                }
            }else if((rooms[roomIndex].innerIndex % 3) === 2){
                if(positionPick(roomIndex, name, data.pick)){
                    rooms[roomIndex].innerIndex++
                }else{
                    rooms[roomIndex].innerIndex = 0
                    resetPlayerCards(roomIndex)
                }
            }

            if(rooms[roomIndex].innerIndex > 4){
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

    check for same name
*/