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

const randomStr = () =>  (Math.random() + 1).toString(36).substring(7);


const createImage = (src, data) => {
  const img = new Image();
  console.log(src);
  img.src = src;
  img.className = 'item-img';
  img.setAttribute('data-id', data);
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

const generateRandomNums = (max, numberOfImages) => {
  const arrayOfRandInt = []
  while (arrayOfRandInt.length < max / 2) {
    const randInt = (parseInt(Math.random() * numberOfImages) + 1)
    if (arrayOfRandInt.indexOf(randInt) !== -1) {
      //... do nothing
    } else {
      arrayOfRandInt.push(randInt);
    }
  }
  return arrayOfRandInt;
}

const grid = document.getElementById('grid')

class Card {

  /**
   * Create a Card
   * @param {number} id - card's identifier
   * @param {number} otherPair - which other card is, this card's answer
   * @param {number} flipped - self explantory
   * @param {number} imgSrc - card's image
   */
  BLANK_IMG = `./images/blank.png`
  constructor(id, otherPair, imgSrc, chooseFunc) {
    this.id = id;
    this.otherPair = otherPair; // this.othePair = asdfasd
    this.element = createImage(this.BLANK_IMG, id)
    this.flipped = false;
    this.imgSrc = imgSrc;
    this.parent = this.element.parentElement;
    this.choose = chooseFunc;
    this.element.addEventListener('click', () => chooseFunc(this.id));
  }

  _unflip() {
    setTimeout(() => {
      this.element.setAttribute('src', this.BLANK_IMG);
      this.element.classList.remove('flipped', 'disabled');
    }, 1000)
  }

  flip() {
    this.element.setAttribute('src', this.imgSrc);
    this.element.classList.add('flipped', 'disabled');
  }

  wrong() {
    this.element.parentElement.classList.add('wrong')
    this._unflip()
  }

  correct() {
    this.element.parentElement.classList.add('correct')
  }
}

class Game {

  /**
   * Create a new Game
   * @param {any[]} cards - array holding the cards
   * @param {Object} settings
   * @param {number} [settings.max = 16] - max number of cards 
   */

  constructor(settings = { max: 16}) {
    this.cards = [];
    this.settings = settings;
    this.currentChoices = [];
  }

  _render() {
    this.cards.forEach((card, i) => {
      grid.appendChild(createEle('div', { className: 'item' }, card.element))
    })
  }

  _getRandNumbers() {
    return generateRandomNums(this.settings.max, 49)
  }

  _showError() {

  }

  // _shuffle() {
  //   this.cards = shuffle(this.cards);
  // }

  _validateAnswer() {
    this._lock()
    let result = false;
    if (this.currentChoices[0].id === this.currentChoices[0].otherPair ||
      this.currentChoices[0].otherPair === this.currentChoices[1].id) {
      result = true;
      this.currentChoices.forEach((choice) => {
        choice.correct()
      })
    } else {
      this.currentChoices.forEach((choice) => {
        choice.wrong()
      })
    }
    this.currentChoices = [];
    this._unLock()
    return result;
  }

  _unLock() {
    setTimeout(() => {
      document.body.classList.remove('disabled')
    }, 1000)
  }

  _lock() {
    document.body.classList.add('disabled')
  }

  choose(index) {
    this.currentChoices.push(this.cards[index])
    console.log(this.currentChoices);
    this.cards[index].flip()
    console.log(this.cards[index]);
    if (this.currentChoices.length === 2) {
      this._validateAnswer()
    }
  }

  start() {
    const randomInts = this._getRandNumbers();
    for(let i= 0; i < randomInts.length; i++) {
      const randString = randomStr()
      const firstCard = {otherPair: randString}
      const secondCard = {otherPair: randString}
      this.cards.push(new Card(i, firstCard.otherPair, `./images/${randomInts[i]}.png`, this.choose))
      this.cards.push(new Card((this.settings.max -1 - i), secondCard.otherPair, `./images/${randomInts[i]}.png`, this.choose))
    }
    this._render()
    this.cards.forEach((card) => {
      card.element.addEventListener('click', () => {
        card.choose(card.id)
      })
    })

  }

}

const newGame = new Game();
console.log(document.querySelectorAll('.item-img'));
document.querySelectorAll('.item-img').forEach((item) => {
  console.log(item);
  item.addEventListener('click', () => {
    console.log('hello');
    newGame.choose(item.getAttribute('data-id'))
  })
})
newGame.start()