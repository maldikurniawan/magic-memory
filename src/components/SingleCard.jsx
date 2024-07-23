import React from 'react'

export default function SingleCard({ card, handleChoice, flipped, disabled }) {
    const handleClick = () => {
        if (!disabled) {
            handleChoice(card)
        }
    }
    return (
        <div className='card mx-2 my-2 flex justify-center'>
            <div className={flipped ? "flipped" : ""}>
                <img className='front w-full' src={card.src} alt="card front" />
                <img
                    className='back'
                    src="./assets/brick.png"
                    onClick={handleClick}
                    alt="card back" />
            </div>
        </div>
    )
}