// src/components/ReadFile.tsx
import React, { useState, useEffect } from 'react';

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

let dist1: string[];
let dist2: string[][];

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
    console.log("DATA:" + words5.length);

    let startWord;
    // Get good random start word
    while (true) {
        // randomly choose word
        startWord = words5[Math.floor(words5.length * Math.random())];
        console.log(startWord);
        const dist1 = stepLevenshtein(startWord, startWord, words5);
        if (dist1.length >= 2) { // Should be at least 2 words at distance 1
            break;
        }
        console.log("Bad, selecting new word");
    }

    dist1 = stepLevenshtein(startWord, startWord, words5);
    const dist2raw = dist1.map((dist1word) => {
        return stepLevenshtein(dist1word, startWord, words5);
    })
    // For distance 2, remove all words found in distance 1
    dist2 = [];
    dist2raw.forEach((branch) => {
        const branchFix = branch.filter((word) => !dist1.includes(word));
        dist2.push(branchFix);
    });

    console.log("DISTANCE 1", dist1);
    console.log("DISTANCE 2", dist2);

    // for each distance 1 word: add 1 table 
};

function SubTable() {
    return (<table>
        <tbody>
            <tr>
                <td>distance 1 start</td>
            </tr>
            <tr>
                <td>next</td>
            </tr>
        </tbody>
    </table>)
}

// Table component- conditionally render # tables within 1 table, depending on # words in dist1
function WordsTable() {
    return (
        <table>
            <tbody>
                <tr>
                    {Array(6).fill(<td><SubTable /></td>)}
                </tr>
            </tbody>
        </table>
    )
}

const ReadFile: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    // Fetch file content when the component mounts
    const fetchContent = async () => {
      const res = await fetch('/api/read-file');
      const data = await res.json();

      const rawContent: string = data.content
      const words = rawContent.split('\n');
      generateSolution(words);
      setContent(data.content);
    };
    fetchContent();

  }, []); // Empty array means it runs only once when the component mounts

  return (
    <div>
      <h1>File Contezzznt</h1>
      {/* If content exists, display; otherwise display loading
      {content ? (
        <pre>{content}</pre>
      ) : (
        <p>Loading...</p>
      )} */}
      <WordsTable />
    </div>
  );
};

export default ReadFile;