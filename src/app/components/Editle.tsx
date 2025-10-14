// Calculator.js

'use client'
import '../globals.css';
import React, { useRef, useState, useEffect } from 'react';
import WordsTable from './WordsTable'
import '../css/Editle.css';


const Editle = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [showHelpBox, setShowHelpBox] = useState<boolean>(false);
    const [showWinBox, setShowWinBox] = useState<boolean>(false);


    const style = {
        display: showOverlay ? "inline" : "none",
    }
    return (
        <>
            <div className="overlay" style={style}>
                {showHelpBox && <div className="newDiv" style={{display: showHelpBox ? "fixed" : "none"}}>
                    <HelpBox setShowOverlay={setShowOverlay} setShowHelpBox={setShowHelpBox} setShowWinBox={setShowWinBox} />
                </div>}
                {showWinBox && <div className="newDiv" style={{display: showWinBox ? "fixed" : "none"}}>
                    {<WinBox setShowOverlay={setShowOverlay} setShowHelpBox={setShowHelpBox} setShowWinBox={setShowWinBox} time={time}/>}
                </div>}
            </div>
            <div className="topbar"></div>
            <h1>Editle</h1>
            <HelpButton setShowOverlay={setShowOverlay} setShowHelpBox={setShowHelpBox} />
            <MainGame setShowOverlay={setShowOverlay} time={time} setTime={setTime} setShowWinBox={setShowWinBox}/>
        </>
    );
}

const HelpBox = ({setShowOverlay, setShowHelpBox, setShowWinBox}) => {
    useEffect(() => {
        setShowHelpBox(true);
        return () => setShowHelpBox(false); 
    }, [])

    return (<div className="infobox">
        <div className="xButtonWrapper">
        <button className="xButtonButton" onClick={() => {
            setShowOverlay(false);
            setShowHelpBox(false);  
        }}><img className="qbutton" src="img/xButton.png" /></button>
        </div>
        <p><b>Editle: the daily edit distance game</b></p>
        <p>The goal of the game is to find all valid 5-letter words up to 2 <a href='https://en.wikipedia.org/wiki/Hamming_distance' target="_blank">single-character edits</a> away from the starting word.</p>
        <p>Words are defined as neighbors if one word can be transformed into the other by substituting one letter. For example, the word <b>swung</b> has 3 valid neighbors: <b>slung</b>, <b>stung</b>, and <b>swing</b>.</p>
        <p>After you find all the neighbors of the starting word, you need to find all the neighbors of those neighbors. Cells will turn green once all neighbors are found.</p>
        <p>A new word is selected every day at midnight.</p>
        </div>);
};

const WinBox = ({setShowOverlay, time, setShowHelpBox, setShowWinBox}) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(() => {
        setShowWinBox(true);
        return () => setShowWinBox(false);
    }, [])
    
    return (<div className="infobox">
        <div className="xButtonWrapper">
        <button className="xButtonButton" onClick={() => {
            setShowOverlay(false);
            setShowHelpBox(false);  
        }}><img className="qbutton" src="img/xButton.png" /></button>
        </div>
        <p>Congrats!</p>
        <p>You solved the Editle in {`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}!</p>

        <div className="shareResultsWrapper">
        <button className="shareResults">
            Share results
        </button>
        </div>
            </div>);
};


const MainGame = ({setShowOverlay, time, setTime, setShowWinBox}) => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState(true);
    const [playingSound, setPlayingSound] = useState<boolean>(false);

    const handleGuess = (guess: string) => {
        setCurrentGuess(guess);
    }

    useEffect(() => {
        console.log(isRunning, "is runinng");
    }, [isRunning])

    useEffect(() => {
        console.log("current guess", currentGuess);
        // Check if current guess is in dist1s
        // console.log(dist1s.includes(currentGuess));
        console.log("game complete?", gameComplete);
        if (gameComplete) {
            // stop timer
            setShowOverlay(true);
            setShowWinBox(true);
            setIsRunning(false);
            setPlayingSound(true);
            console.log("play sound");
        }
    }, [gameComplete]);

    return (
        <>
            <div>
                <WordsTable guessData={currentGuess} setGameComplete={setGameComplete}/>
            </div>
            <div className="boxAndTimer">
                <EntryBox handleGuess={handleGuess} />
                <Timer time={time} setTime={setTime} isRunning={isRunning} setIsRunning={setIsRunning}/>
            </div>
            <AudioPlayer playingSound={playingSound} setPlayingSound={setPlayingSound}></AudioPlayer>

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

const HelpButton = ({setShowOverlay, setShowHelpBox}) => {
    const handleClick = () => {
        setShowOverlay(true);
        setShowHelpBox(true);
    }
    return (
        <div className="qbuttonWrapper">
            <button className="qbuttonButton" onClick={handleClick}>
                <img className="qbutton" src="img/qbutton.png"></img>
            </button>
        </div>
    );
}

const Timer = ({time, setTime, isRunning, setIsRunning}) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    useEffect(() => {
        if (!isRunning) return;
        const intervalId = setInterval(() => {
            setTime(prevTime => prevTime + 1); // increment time every 1000ms
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isRunning, setTime]);

    return (
        <div className="timer">
            <p>{`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}</p>
        </div>
    );
};

const AudioPlayer = ({playingSound, setPlayingSound}) => {
    const soundFile = useRef(null); // reference to DOM element, necessary here for initializatoin

    const playSound = () => {
        if (soundFile.current) { // if sound file is assigned
            soundFile.current.play();
        }
    }

    useEffect(() => {
        if (playingSound) playSound();
        setPlayingSound(false);
    })
    return (
    <div>
        <audio ref={soundFile} src="/sounds/win.mp3" preload="auto" />
    </div>
    )
}


export default Editle;