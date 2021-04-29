import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/playerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from '../Player/styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export default function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0);
    const {
            episodeList,
            currentEpisodeIndex, 
            isPlaying, 
            togglePlay, 
            setPlayingState, 
            playNext, 
            playPrevious, 
            hasNext, 
            hasPrevious,
            isLoop,
            toggleLoop,
            isShuffle,
            toggleShuffle,
            clearPlayerState
        } = usePlayer()


    useEffect(() => {
        if(!audioRef.current){
            return
        }
        if(isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    },[isPlaying])

    function setupProgressListener(){

        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })

    }

    function handleSick(amount: number){

        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }



    const episode = episodeList[currentEpisodeIndex];
    return(    
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg"  alt="Tocando agora"/>
                <strong>{episode?.title}</strong>              
            </header>
            { episode? (
                <div className={styles.currentEpisode} > 
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.empityPlayer}> 
                    <strong> Selecione um podcast para ouvir</strong>
                 </div>
            ) }
            <footer className={!episode? styles.empity : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider} >
                       {episode? (
                           <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSick}
                                
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                           />
                       ) : (
                          <div className={styles.empitySlider} />
                       )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                {episode &&  (
                    <audio

                        src={episode.url}
                        ref={audioRef}
                        loop={isLoop}
                        onEnded={handleEpisodeEnded}
                        autoPlay
                        onPlay={()=>{setPlayingState(true)}}
                        onPause={()=>{setPlayingState(false)}}
                        onLoadedMetadata={setupProgressListener}
                    
                    />
                )}
                <div className={styles.buttons}>
                    <button type="button" className={ isShuffle? styles.isActive : ''} onClick={toggleShuffle} disabled={!episode || episodeList.length == 1}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
                        {isPlaying
                        ?<img src="/pause.svg" alt="Pausar" />
                        :<img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" className={isLoop? styles.isActive : ''} onClick={toggleLoop} disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                    

                </div>
            </footer>
        </div>
    )
}