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

const randomStr = () => (Math.random() + 1).toString(36).substring(7);


const createImage = () => {
  const img = new Image();
  img.src = `./images/blank.png`;
  img.className = 'item-img';
  return img;
}

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

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

/**
 * Generate an array Random Numbers
 * @param {number} max - Qty of random numbers generated
 */

const generateRandomImgSources = (max, numberOfImages) => {
  const arrayOfRandInt = []
  while (arrayOfRandInt.length < numberOfImages) {
    const randInt = (parseInt(Math.random() * max) + 1)
    console.log(randInt);
    if (arrayOfRandInt.indexOf(`./images/${randInt}.png`) !== -1) {
      //... do nothing
    } else {
      arrayOfRandInt.push(`./images/${randInt}.png`);
    }
  }
  return arrayOfRandInt;
}

//Card

class Card {
  constructor(otherPair, imgSrc, element, onClicked) {
    this.otherPair = otherPair;
    this.element = element.firstChild,
    this.imgSrc = imgSrc;
    this.element.addEventListener('click', () => onClicked(this));
  }

  _flip() {
    this.element.classList.add('disabled', 'flipped')
    this.element.setAttribute('src', this.imgSrc)
  }

  _unFlip(){
    setTimeout(() => {
      this.element.classList.remove('disabled', 'flipped')
      this.element.setAttribute('src', defaultImg)
    }, 1000)
  }

  handler(result) {
    this._flip()
    if (result === true) {
      this.element.parentElement.classList.add('correct')
      return true;
    } else {
      this._unFlip()
      this.element.parentElement.classList.add('wrong')
      return false;
    }
  }

}

const grid = document.getElementById('grid')
const gameStatus = document.getElementById('status')
const restartBtn = document.getElementById('restart')
const defaultImg = `./images/blank.png`

// GAME

class Game {

  constructor(max) {
    this.cards = [];
    this.max = max || 16;
    this.choices = [];
    this.images = generateRandomImgSources(49, this.max / 2);
    this.rightAnswers = 0;
  }

  _render() {
    this.cards.forEach((card) => {
      grid.appendChild(card.element.parentElement)
    })
    restartBtn.addEventListener('click', () => {
      this._restart()
    })
  }

  _validateChoices() {
    console.log(this.choices);
    return this.choices[0].otherPair === this.choices[1].otherPair
  }

  onChoice(card) {
    this.choices.push(card);
    card._flip();
    if (this.choices.length === 2) {
      this._lock();
      const result = this._validateChoices()
      this.choices.forEach((card) => {
        const isCorrect = card.handler(result)
        isCorrect === true ? this.rightAnswers++ : null
      })
      this.choices = [];
    }
    if(this.rightAnswers === this.max) this._end();
    this._unlock();
  }

  _lock() {
    document.body.classList.add('disabled')
  }
  
  _unlock() {
    document.body.classList.remove('disabled')
  }

  _reset() {
    this.cards = []
    this.rightAnswers = 0;
    this.images = generateRandomImgSources(49, this.max / 2);
    this.choices = [];
    grid.innerHTML = ''
  }

  start() {
    for (let i = 0; i < this.max / 2; i++) {
      const firstElement = createEle('div', {className: 'item'}, createImage(), createEle('div', {className: 'overlay'}))
      const secondElement = createEle('div', {className: 'item'}, createImage(), createEle('div', {className: 'overlay'}))
      const randString = randomStr();
      const firstCard = [randString, this.images[i], firstElement, this.onChoice.bind(this)];
      const secondCard = [randString, this.images[i], secondElement, this.onChoice.bind(this)];
      this.cards.push(new Card(...firstCard));
      this.cards.push(new Card(...secondCard));
    }
    this.cards = shuffle(this.cards)
    this._render()
  }

  _end() {
    gameStatus.classList.remove('hidden')
  }

  _restart() {
    this._reset()
    this.start()
    gameStatus.classList.add('hidden');
  }
}

const newGame = new Game(16)
newGame._end()
newGame.start()