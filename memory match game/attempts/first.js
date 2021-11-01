// sdfasdf + 54545  = {strings:sdfasdf54545, id = 42}
// [1, 2, ..., 16]
/* card [{
  string: 'asdfasdf' id: '2',
  string: 'asdfasdf' id: '4',
  string: 'asdfasdf' id: '2',
  string: '123sdad' id: '4',


}]

*/
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const createEle = (type, props, ...children) => {
  let ele = document.createElement(type)
  for (let [key, value] of Object.entries(props)) {
    if (key.indexOf('data-') !== -1) {
      ele.setAttribute(key, value)
      delete props[key]
    }
  }
  ele = Object.assign(ele, props);

  for (let child of children) {
    if (typeof child === 'string') {
      const textNode = document.createTextNode(child)
      ele.appendChild(textNode)
    } else {
      ele.appendChild(child)
    }
  }
  return ele
}

const getRandomStrings = (length) => {
  const arrOfRandomStrings = []
  for (i = 0; arrOfRandomStrings.length < length; i++) {
    const randomStr = (Math.random() + 1).toString(36).substring(7);
    arrOfRandomStrings.push(randomStr)
  }  
  return arrOfRandomStrings
  
}

const createImage = (src, data) => {
  const img = new Image()
  img.src='./images/blank.png'
  img.className='item-img'
  img.setAttribute('data-id', data)
  return img;
}

const genRandNumbers = (maxNumberOfImg) => {
  const arrOfRandomNums = []
  for (let i = 0; arrOfRandomNums.length < maxNumberOfImg; i++) {   
    const randInt = parseInt(((Math.random() * maxNumberOfImg -1) + 1).toFixed(0))
    if (arrOfRandomNums.includes(randInt)) {
      continue;
    }else {
      arrOfRandomNums.push(randInt)
    } 
  }
  return arrOfRandomNums;
}

const pushRandomImgEle = (randomNums) => {
  const arrayOfRandomElements = []
  for (let value of randomNums) {
    arrayOfRandomElements.push(createImage('./images/blank.png', value))
  }
  return arrayOfRandomElements
}


class Game {
  
  /**
   * Create New Game
   * @param {Array} randomStrings
   */
  constructor(elements, randomStrings) {
    this.elements = shuffle(elements);
    this.randomStrings = randomStrings
    this.grid = document.querySelector('.grid')
    this.randomNumbers = []
    this.cards = []
    this.arrOfImgSrc = []
    this.answers = {}
  }

  render() {
    for(let ele of this.elements) {
      this.grid.appendChild(ele)
    }
  }

  _generateAnswer() {
    this.randomNumbers = genRandNumbers(16)
  }

  setImgSrc(ele) {
    ele.classList.add('flipped')
    ele.setAttribute('src', `./images/${ele.getAttribute('data-id')}.png`)
  }
  
  choose(item) {
    this.setImgSrc(item)
  }

  init() {
    this.render();
    this._generateAnswer()
    console.log(randomStrings);
    for(let [key, value] of this.randomStrings.entries()) {
      const firstAnswer = {string: value, id: this.randomNumbers[key]}
      const secondAnswer = {string: this.randomStrings[(this.randomStrings.length -1) - key], id: this.randomNumbers[key]}
      this.cards.push(firstAnswer)
      this.cards.push(secondAnswer)
      this.answers[secondAnswer.string + firstAnswer.string] = true;
      this.answers[firstAnswer.string + secondAnswer.string] = true;
    }

    console.log(this.answers);

    document.querySelectorAll('.item-img').forEach((item) => {
      item.addEventListener('click', () => {
        this.choose(item);
      })
    })
  }

}

const randomStrings = getRandomStrings(16)
const imgElements = pushRandomImgEle(randomStrings)

const newGame = new Game(imgElements, randomStrings)
newGame.init()
