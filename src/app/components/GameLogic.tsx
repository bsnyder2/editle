'use client'
import '../globals.css';
import React, { useState } from 'react';
// import axios from "axios";


if (typeof window === "undefined") {
    import("node:fs");
}

// File reader

const GameLogic = () => {
    console.log("FOO");
    // const xmlhttp = new XMLHttpRequest();
    // xmlhttp.open("GET", "assets", false);
    // xmlhttp.send();
    // console.log(xmlhttp.status == 200);
    // Generate random 5-letter word
    // axios.get("./assets/words-58k.txt");

    // fs.readFile("./assets/words-58k.txt", "utf8", (err,data) => {
    //     if (err) {
    //         console.error("Error", err);
    //         return;
    //     }
    //     console.log(data);
    // });
};


export default GameLogic;