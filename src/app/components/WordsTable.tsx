// src/components/WordsTable.tsx
import React, { useState, useEffect } from 'react';
import '../css/WordsTable.css';


const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const WordsTable = ({onUpdate1s, onUpdate2s, guessData}) => {
    const [content, setContent] = useState<string | null>(null);
    const [dist0, setDist0] = useState<string>("");
    const [dist1, setDist1] = useState<string[]>([]);
    const [dist2, setDist2] = useState<string[][]>([]);
    // const [isHidden, setHidden] = useState<boolean>(true);
    const [dist1Hiddens, setDist1Hiddens] = useState<boolean[]>(new Array(8).fill(true));
    const [dist2Hiddens, setDist2Hiddens] = useState(() => {
    return Array.from({ length: 8 }, () => Array(64).fill(true));
  });
    const [isCompleted, setCompleted] = useState<boolean>(false);

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

    // Runs on update- recalculate state
    useEffect(() => {
        // console.log("test");
        // console.log("dist0", dist0);
        // console.log(dist1);
        // console.log(dist2);
        // pass updated state to parent
        onUpdate1s(dist1);
        onUpdate2s(dist2);
        uncoverChild();
        console.log("dist1Hiddens", dist1Hiddens);
        console.log("dist2HIDDENS", dist2Hiddens);
        
    });

    const dist2HiddensContains = () => {
        let dist2Contains = false;
        let x = 0, y = 0;
        for (let i = 0; i < dist2.length; i++) {
            for (let j = 0; j < dist2[0].length; j++) {
                if (guessData === dist2[i][j]) {
                    x = i;
                    y = j;
                    dist2Contains = true;
                }

            }
        }
        if (!dist2Contains) return false;
        console.log("ID IS", x, y);
        // const updatedDist2Hiddens = [...dist2Hiddens];
        // updatedDist2Hiddens[x][y] = false;


        // Deep copy
        const updatedDist2Hiddens = dist2Hiddens.map((row, i) =>
        i  === x ? [...row.slice(0, y), false, ...row.slice(y + 1)] : [...row]
);

        setDist2Hiddens(updatedDist2Hiddens);
        return true;
    }

    const uncoverChild = () => {
      console.log("uncover child")
      // Update dist 1 hiddens
      if (dist1.includes(guessData)) {
        const updateddist1Hiddens = [...dist1Hiddens];
        updateddist1Hiddens[dist1.indexOf(guessData)] = false;
        setDist1Hiddens(updateddist1Hiddens);
      }
      else if (dist2HiddensContains()) {
        console.log("dist2 hiddens contains");
      }

      // Index of dist 1 guess

      if (!dist2HiddensContains()) return;

      
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
                                <SubTable dist1Word={dist1[index]} dist2Words={dist2[index]} isDist1Hidden={dist1Hiddens[index]} dist2Hiddens={dist2Hiddens[index]}/>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
};


const SubTable = ({dist1Word, dist2Words, isDist1Hidden, dist2Hiddens}) => {
    // const [dist1Word, setDist1Word] = useState<string>("");
    // return (<table>
    //     <tbody>
    //         <tr>
    //             <td>{hidden ?  "____" : props.dist1Word}</td>
    //         </tr>
    //         <tr>
    //             <td>{props.dist2Words.length}</td>
    //         </tr>
    //     </tbody>
    // </table>);

    return (
    <table>
      <tbody>
        <tr>
          <td className="smallerCell">{isDist1Hidden ? "____" : dist1Word}</td>
        </tr>
        {/* <tr>
          <td>{props.dist2Words.length}</td>
        </tr> */}
        {dist2Words.map((word, index) => (
          <tr key={index}>
            <td className={dist2Hiddens[index] ? "smallerCell2" : "smallerCell2Complete"}>{dist2Hiddens[index] ? "5" : word}</td>
            {/* <p>{index}</p> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Table component- conditionally render # tables within 1 table, depending on # words in dist1


// const Cell2 = () => {

// }


// const ReadFile: React.FC = () => {
//   const [content, setContent] = useState<string | null>(null);

//   useEffect(() => {
//     // Runs when the component mounts
//     const fetchContent = async () => {
//       const res = await fetch('/api/read-file');
//       const data = await res.json();

//       const rawContent: string = data.content
//       const words = rawContent.split('\n');
//       setContent(data.content);
//     };
//     fetchContent();

//   }, []); // Empty array means it runs only once when the component mounts

//   return (
//     <div>
//       <h1>File Contezzznt</h1>
//       {/* If content exists, display; otherwise display loading
//       {content ? (
//         <pre>{content}</pre>
//       ) : (
//         <p>Loading...</p>
//       )} */}
//       <WordsTable />
//     </div>
//   );
// };

export default WordsTable;