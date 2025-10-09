// src/components/ReadFile.tsx
import React, { useState, useEffect } from 'react';
import '../css/WordsTable.css';


const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const WordsTable = () => {
    const [content, setContent] = useState<string | null>(null);
    const [dist0, setDist0] = useState<string>("");
    const [dist1, setDist1] = useState<string[]>([]);
    const [dist2, setDist2] = useState<string[][]>([]);

    // Runs when the component mounts
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

    // Runs on update
    useEffect(() => {
        console.log("test");
        console.log("dist0", dist0);
        console.log(dist1);
        console.log(dist2);
    });

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
            if (dist1.length >= 2 && dist1.length <= 8) { // dist 1 words should be between 2 and 8
                break;
            }
            console.log("Bad, selecting new word");
        }

        setDist1(stepLevenshtein(startWord, startWord, words5));
        const dist2raw = dist1.map((dist1word) => {
            return stepLevenshtein(dist1word, startWord, words5);
        })

        const newDist2: string[][] = []
        // For distance 2, remove all words found in distance 1
        dist2raw.forEach((branch) => {
            const branchFix = branch.filter((word) => !dist1.includes(word));
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
                                <SubTable dist1Word={item} />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
};


const SubTable = (props) => {
    // const [dist1Word, setDist1Word] = useState<string>("");

    return (<table>
        <tbody>
            <tr>
                <td>{props.dist1Word}</td>
            </tr>
            <tr>
                <td>next</td>
            </tr>
        </tbody>
    </table>);
}

// Table component- conditionally render # tables within 1 table, depending on # words in dist1


const ReadFile: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    // Runs when the component mounts
    const fetchContent = async () => {
      const res = await fetch('/api/read-file');
      const data = await res.json();

      const rawContent: string = data.content
      const words = rawContent.split('\n');
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

export default WordsTable;