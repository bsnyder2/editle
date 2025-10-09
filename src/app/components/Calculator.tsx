// Calculator.js

'use client'
import '../globals.css';
import React, { useState } from 'react';
import WordsTable from './WordsTable'
import '../css/Calculator.css';

const Calculator = () => {
    const [result, setResult] = useState('');

    const handleClick = (value: string) => {
        if (value === '=') {
            try {
                setResult(eval(result) || '');
            } catch (error) {
                setResult('Error');
            }
        } else if (value === 'C') {
            setResult('');
        } else if (value === 'CE') {
            setResult(result.slice(0, -1));
        } else {
            setResult(result + value);
        }
    };

    return (
        <>
            <h1>Editle</h1>
            <h2>The daily edit distance game</h2>
            <div>
                <WordsTable />
            </div>
            <div className="entryBox">
                <EntryBox />
            </div>
            
        </>
    );
};

const EntryBox = () => {
    return (
        <input></input>
    )
}

export default Calculator;