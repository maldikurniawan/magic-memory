import { useEffect, useState } from 'react'
import SingleCard from "./components/SingleCard"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

const cardImages = [
  { "src": "./assets/cheeseburger.png", matched: false },
  { "src": "./assets/fries.png", matched: false },
  { "src": "./assets/hotdog.png", matched: false },
  { "src": "./assets/ice-cream.png", matched: false },
  { "src": "./assets/milkshake.png", matched: false },
  { "src": "./assets/pizza.png", matched: false },
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [allMatched, setAllMatched] = useState(false)
  const { width, height } = useWindowSize()

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setAllMatched(false)
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 500)
      }
    }
  }, [choiceOne, choiceTwo])

  // check if all cards are matched
  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setAllMatched(true)
    }
  }, [cards])

  //reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  // start a new game
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="max-w-[500px] mx-auto my-10 overflow-hidden">
      <h1 className='text-center text-4xl mb-6 font-bold'>Magic Match</h1>
      <button className='bg-transparent border-2 border-white px-3 py-2 rounded text-white font-bold cursor-pointer text-base hover:bg-[#c23866]' onClick={shuffleCards}>New Game</button>
      <div className='card-grid mt-6 grid min-[500px]:grid-cols-4 grid-cols-3 mb-2'>
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
      <a href="https://maldikurniawan.github.io/random_app/" className='hover:text-[#c23866]' target='_blank'>Follow me here!</a>
      {allMatched && <Confetti width={width} height={height} />}
    </div>
  );
}

export default App
