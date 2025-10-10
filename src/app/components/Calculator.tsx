// Calculator.js

'use client'
import '../globals.css';
import React, { useState, useEffect } from 'react';
import WordsTable from './WordsTable'
import '../css/Calculator.css';

const Calculator = () => {
    const [result, setResult] = useState('');
    const [currentGuess, setCurrentGuess] = useState('');

    const handleGuess = (guess: string) => {
        setCurrentGuess(guess);
    }

    useEffect(() => {
        console.log("current guess", currentGuess);
    });

    return (
        <>
            <h1>Editle</h1>
            <h2>The daily edit distance game</h2>
            <div>
                <WordsTable />
            </div>
                <EntryBox handleGuess={handleGuess} />
            
        </>
    );
};

const EntryBox = ({handleGuess}) => {
    const [inputValue, setInputValue] = useState("");

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
                className="inputField"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default Calculator;