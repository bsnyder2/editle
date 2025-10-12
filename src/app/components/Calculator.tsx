// Calculator.js

'use client'
import '../globals.css';
import React, { useRef, useState, useEffect } from 'react';
import WordsTable from './WordsTable'
import '../css/Calculator.css';


const Calculator = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    const style = {
        display: showOverlay ? "inline" : "none",
    }
    return (
        <>
            <div className="overlay" style={style}></div>
            <h1>Editle</h1>
            <HintButton setShowOverlay={setShowOverlay} />
            <MainGame />
        </>
    );
}


const MainGame = () => {
    const [result, setResult] = useState('');
    const [currentGuess, setCurrentGuess] = useState('');
    const [dist1s, setDist1s] = useState([]);
    const [dist2s, setDist2s] = useState([[]]);


    const handleGuess = (guess: string) => {
        setCurrentGuess(guess);
    }



    useEffect(() => {
        console.log("current guess", currentGuess);
        console.log("current dist1s", dist1s)
        console.log("current dist2s", dist2s)

        // Check if current guess is in dist1s
        // console.log(dist1s.includes(currentGuess));
        console.log()

    });

    const handleDist1sUpdate = (updatedState) => {
        setDist1s(updatedState);
    }


    const handleDist2sUpdate = (updatedState) => {
        setDist2s(updatedState);
    }

    return (
        <>
            <div>
                <WordsTable onUpdate1s={handleDist1sUpdate} onUpdate2s={handleDist2sUpdate} guessData={currentGuess}/>
            </div>
                <EntryBox handleGuess={handleGuess} />
            
        </>
    );
};

const EntryBox = ({handleGuess}) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        // refocus input continuously, everytime anything is clicked/button is pressed
        const handleFocus = () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };
        handleFocus();
        document.addEventListener('click', handleFocus);
        document.addEventListener('keydown', handleFocus);

        return () => {
            document.removeEventListener('click', handleFocus);
            document.removeEventListener('keydown', handleFocus);
        };
    }, []); // Empty array to run once on mount

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("Enter pressed");
            setInputValue(""); // Clear input field
            handleGuess(inputValue);
        }
    }

    return (
        <div className="entryBox">
            <input
                ref={inputRef}
                className="inputField"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

const Help = () => {

}

const HintButton = ({setShowOverlay}) => {
    const handleClick = () => {
        console.log("clicked");
    }
    return (
        <div className="qbuttonWrapper">
            <button onClick={() => setShowOverlay(true)}>
                <img className="qbutton" src="img/qbutton.png"></img>
            </button>
        </div>
    );
}

export default Calculator;