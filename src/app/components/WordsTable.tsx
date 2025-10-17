// src/components/WordsTable.tsx
import React, { useState, useEffect } from 'react';
import '../css/WordsTable.css';


const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const WordsTable: React.FC<{
    guessData: string;
    setGameComplete: (show: boolean) => void;
}> = ({guessData, setGameComplete}) => {
    const [content, setContent] = useState<string | null>(null);
    const [dist0, setDist0] = useState<string>("");
    const [dist1, setDist1] = useState<string[]>([]);
    const [dist2, setDist2] = useState<string[][]>([]);
    const [dist1Hiddens, setDist1Hiddens] = useState<boolean[]>(new Array(8).fill(true));
    const [dist2Hiddens, setDist2Hiddens] = useState(() => {
    return Array.from({ length: 8 }, () => Array(64).fill(true));
  });
    const [dist1Completed, setDist1Completed] = useState<boolean>(false);
    const [gameDataInitialized, setGameDataInitialized] = useState(false);

    // Runs on start
    useEffect(() => {
        const fetchContent = async () => {
            const res = await fetch('/api/read-file');
            const data = await res.json();

            const rawContent: string = data.content;
            const words = rawContent.split('\n');
            setContent(data.content);

            generateSolution(words);
        };
        fetchContent();
    }, []);

    useEffect(() => {
        // pass updated state to parent

        if (!dist1.length || !dist2.length) return;
        
        setGameDataInitialized(true);
        uncoverChild();

        if (dist1.length && dist1Hiddens.slice(0, dist1.length).every((value) => value == false)) {
            setDist1Completed(true);
        }
        checkComplete();
    }, [dist1, dist2, guessData, dist1Hiddens]);

    useEffect(() => {
        // Check complete whenever hidden arrays update
        checkComplete();
    }, [dist2Hiddens, dist1Hiddens])

    const uncoverChild = () => {
      // Update dist 1 hiddens
      if (dist1.includes(guessData)) {
        const updatedDist1Hiddens = [...dist1Hiddens];
        const index = dist1.indexOf(guessData);
        if (updatedDist1Hiddens[index] !== false) {  // prevent state update -> infinite loop
            updatedDist1Hiddens[index] = false;
            setDist1Hiddens(updatedDist1Hiddens);
        }
      }
      else if (dist2HiddensContains()) {
        console.log("dist2 hiddens contains");
      }

      if (!dist2HiddensContains()) return;
    };


    const checkComplete = () => {
        if (!gameDataInitialized) return;
        // check if all dist1 cells revealed
        const isDist1Complete = dist1Hiddens.slice(0, dist1.length).every(value => value === false);
        
        // check if all dist2 cells revealed
        const isDist2Complete = dist2Hiddens.slice(0, dist2.length).every(row => 
            row.slice(0, dist2[dist2Hiddens.indexOf(row)].length).every(cell => cell === false)
        );

        console.log("Complete?", isDist1Complete && isDist2Complete);
        setGameComplete(isDist1Complete && isDist2Complete);
    };

    const dist2HiddensContains = () => {
        let dist2Contains = false;
        // max dist 2 length
        const maxDist2Length = Math.max(...dist2.map(arr => arr.length));
        const matchingIndexes: number[][] = [];
        for (let i = 0; i < dist2.length; i++) {
            for (let j = 0; j < maxDist2Length; j++) {
                if (guessData === dist2[i][j]) {
                    matchingIndexes.push([i, j]);
                    dist2Contains = true;
                }

            }
        }
        if (!dist2Contains) return false;

        // Deeply replace with false
        const updatedDist2Hiddens = dist2Hiddens.map((row, i) =>
        row.map((cell, j) =>
            matchingIndexes.some(([x, y]) => x === i && y === j) ? false : cell
        )
    );

        setDist2Hiddens(updatedDist2Hiddens);
        return true;
    }

    const stepLevenshtein = (word: string, startWord: string, words5: string[]) => {
        const subWords : string[] = [];
        for (let i = 0; i < word.length; i++) {
            ALPHABET.forEach((letter) => {
                // console.log(word.slice(0, i), letter, word.slice(i+1, 5));
                const subWord = word.slice(0, i) + letter + word.slice(i+1, 5);
                subWords.push(subWord);
            });
        }
        const validSubWords = subWords.filter((newWord) => (words5.includes(newWord) && newWord !== word && newWord != startWord));
        return validSubWords;
    };

    const generateSolution = (words: string[]) => {
        const words5 = words.filter((word) => word.length === 5);
        let startWord;
        let tempDist1;
        // Get good random start word
        while (true) {
            // randomly choose word
            startWord = words5[Math.floor(words5.length * Math.random())];
            console.log(startWord);
            tempDist1 = stepLevenshtein(startWord, startWord, words5);
            if (tempDist1.length >= 2 && tempDist1.length <= 8) { // dist 1 words should be between 2 and 8
                break;
            }
            console.log("Bad, selecting new word");
        }

        // hardcode
        // startWord = "defer";
        // tempDist1 = stepLevenshtein(startWord, startWord, words5);


        setDist1(stepLevenshtein(startWord, startWord, words5));
        const dist2raw = tempDist1.map((dist1word) => {
            return stepLevenshtein(dist1word, startWord, words5);
        })

        const newDist2: string[][] = [];
        // For distance 2, remove all words found in distance 1
        dist2raw.forEach((branch) => {
            const branchFix = branch.filter((word) => !tempDist1.includes(word));
            newDist2.push(branchFix);
        });

        setDist0(startWord);
        setDist2(newDist2);
    };
    return (
        <div>
            <div className="firstWord">{dist0}</div>
            <table className="mainTable">
                <tbody>
                    <tr>
                        {/* Add 1 table for each word in Dist1 */}
                        {/* {Array(dist1.length).fill(<td><SubTable dist1Word={dist1[0]}/></td>)} */}
                        {dist1.map((item, index) => (
                            <td key={index}>
                                <SubTable dist1Word={dist1[index]} dist2Words={dist2[index]} isDist1Hidden={dist1Hiddens[index]} dist2Hiddens={dist2Hiddens[index]} dist1Completed={dist1Completed}/>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
};


const SubTable: React.FC<{
    dist1Word: string;
    dist2Words: string[];
    isDist1Hidden: boolean;
    dist2Hiddens: boolean[];
    dist1Completed: boolean;
}> = ({dist1Word, dist2Words, isDist1Hidden, dist2Hiddens, dist1Completed}) => {
    const [editIndexes, setEditIndexes] = useState<number[]>([]);
    const [columnComplete, setColumnComplete] = useState<boolean>(false);

    const getClassHere = () => {
        if (dist1Completed) return "smallerCellAllComplete";
        return (isDist1Hidden ? "smallerCell" : "smallerCellComplete");
    };

    const getEditIndexes = () => {
        const dist2WordEditIndexes: number[] = [];
        // For char in dist1word
        dist2Words.forEach((dist2Word: string) => {
            for (let i = 0; i < 5; i++) {
                if (dist1Word[i] !== dist2Word[i]) dist2WordEditIndexes.push(i + 1);
            }
        });
        setEditIndexes(dist2WordEditIndexes);
    }

    useEffect (() => {
        getEditIndexes();
    }, []);

    useEffect(() => {
        const dist2ActualHiddens = dist2Hiddens.slice(0, dist2Words.length);
        const result = dist2ActualHiddens.every((item) => item === false);
        setColumnComplete(result);
    })

    return (
    <table>
      <tbody>
        <tr>
          <td className={getClassHere()}>{isDist1Hidden ? "" : dist1Word}</td>
        </tr>
        {/* <tr>
          <td>{props.dist2Words.length}</td>
        </tr> */}
        {dist2Words.map((word, index) => (
          <tr key={index}>
            <td className={columnComplete ? "smallerCell2AllComplete" : (dist2Hiddens[index] ? "smallerCell2" : "smallerCell2Complete")}>{dist2Hiddens[index] ? editIndexes[index]: word}</td>
            {/* <p>{index}</p> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordsTable;