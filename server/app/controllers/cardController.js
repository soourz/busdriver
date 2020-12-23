const COLORS = ['diamonds', 'hearts', 'spades', 'clubs']
const VALUES = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']

exports.getNewStack = () => {
    let cards = []
    for (let col in COLORS){
        for(let val in VALUES){
            cards.push({color: COLORS[col], value: VALUES[val]});
        }
    }
    return cards;
}
