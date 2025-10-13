// Calculator.js

'use client'
import '../globals.css';
import React, { useRef, useState, useEffect } from 'react';
import WordsTable from './WordsTable'
import '../css/Editle.css';


const Editle = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);


    const style = {
        display: showOverlay ? "inline" : "none",
    }
    return (
        <>
            <div className="overlay" style={style}>
                <HelpBox setShowOverlay={setShowOverlay} />
                <WinBox setShowOverlay={setShowOverlay} />
            </div>
            <div className="topbar"></div>
            <h1>Editle</h1>
            <HelpButton setShowOverlay={setShowOverlay} />
            <MainGame setShowOverlay={setShowOverlay}/>
        </>
    );
}

const HelpBox = ({setShowOverlay}) => {
    return (<div className="infobox">
        <button className="xButton" onClick={() => setShowOverlay(false)}>x</button>
        <p>Editle: the daily edit distance game</p>
        <ul>
            <li>The goal of the game is to find all valid 5-letter words up to 2 <a href='https://en.wikipedia.org/wiki/Hamming_distance' target="_blank">single-character edits</a> away from the starting word.</li>
            <li>We define words as neighbors if one word can be transformed into the other by substituting one letter. For example, the word swung has 3 valid neighbors: slung, stung, and swing.</li>
            <li>After you find all the neighbors of the starting word, you need to find all the neighbors of those neighbors. Cells will turn green once all neighbors are found.</li>
            <li>A new word is selected every day at midnight.</li>
        </ul>
            </div>);
};

const WinBox = ({setShowOverlay}) => {
    return (<div className="infobox">
        <button className="xButton" onClick={() => setShowOverlay(false)}>x</button>
        <p>Congrats!</p>
        <p>You solved the Editle in [time] (with hints)</p>
        <button>
            Share results
        </button>
            </div>);
};


const MainGame = ({setShowOverlay}) => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);


    const handleGuess = (guess: string) => {
        setCurrentGuess(guess);
    }

    useEffect(() => {
        console.log("current guess", currentGuess);
        // Check if current guess is in dist1s
        // console.log(dist1s.includes(currentGuess));
        console.log("game complete?", gameComplete);
        if (gameComplete) {
            setShowOverlay(true);
        }
    }, [gameComplete]);

    return (
        <>
            <div>
                <WordsTable guessData={currentGuess} setGameComplete={setGameComplete}/>
            </div>
                <EntryBox handleGuess={handleGuess} />
            <Timer time={time} setTime={setTime}/>

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

const HelpButton = ({setShowOverlay}) => {
    const handleClick = () => {
        console.log("clicked");
    }
    return (
        <div className="qbuttonWrapper">
            <button className="qbuttonButton" onClick={() => setShowOverlay(true)}>
                <img className="qbutton" src="img/qbutton.png"></img>
            </button>
        </div>
    );
}

const Timer = ({time, setTime}) => {
    // const [time, setTime] = useState<number>(0);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(prevTime => prevTime + 1); // increment time every 1000ms
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);



    return (
        <div className="timer">
            <p>{`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}</p>
        </div>
    );
};


export default Editle;