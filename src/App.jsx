import { useEffect, useRef, useState } from 'react';
import SingleCard from "./components/SingleCard";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import spiderdance from "./assets/spiderdance.mp3";
import { TbMusic, TbMusicOff } from 'react-icons/tb';

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
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(true);

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

  // Music
  const audioRef = useRef(new Audio(spiderdance));

  // Ensure audio plays when the component is mounted
  useEffect(() => {
    audioRef.current.volume = 0.8;
    audioRef.current.loop = true;
    if (isPlayingMusic) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  return (
    <div className="max-w-[500px] mx-auto my-10 overflow-hidden">
      {showMusicModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg text-center rounded-lg">
            <h2 className="text-2xl text-black font-bold mb-4">Play Background Music?</h2>
            <p className="mb-4 text-black">Would you like to turn on the background music for this game?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={() => {
                  setIsPlayingMusic(true);
                  setShowMusicModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => setShowMusicModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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
      <a href="https://maldikurniawan.netlify.app/" className='hover:text-[#c23866] font-bold tracking-widest' target='_blank'>Follow Me Here!</a>
      {allMatched && <Confetti width={width} height={height} />}
      <button
        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        className='opacity-100 z-40'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
        {!isPlayingMusic ?
          <TbMusicOff className='w-10 h-10 p-2 bg-blue-600 rounded-full' />
          :
          <TbMusic className='w-10 h-10 p-2 bg-blue-600 rounded-full' />
        }
      </button>
    </div>
  );
}

export default App;
