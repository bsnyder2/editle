import React, { useEffect, useRef } from 'react';


const AudioPlayer: React.FC<{
    soundSrc: string;
    playingSound: boolean;
    setPlayingSound: (show: boolean) => void;
}> = ({soundSrc, playingSound, setPlayingSound}) => {
    const soundFile = useRef<HTMLAudioElement>(null); // reference to DOM element, necessary here for initializatoin

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
        <audio ref={soundFile} src={soundSrc} preload="auto" />
    </div>
    )
}

export default AudioPlayer;