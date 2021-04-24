import { type } from 'node:os';
import {createContext, ReactNode, useContext, useState} from 'react';

type Episode = {

    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLoop: boolean;
    isShuffle: boolean;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    play: (episode:Episode) => void;
    playList: (list: Episode[], index: number) => void
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    setPlayingState: (state:boolean) => void;
    clearPlayerState: () => void;
}
export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps ={

  children: ReactNode;
}

export default function PlayerContextProvider({children} : PlayerContextProviderProps){

    
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList( list: Episode[], index: number ){

    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)

  }

  function togglePlay(){

    setIsPlaying(!isPlaying)
  }
  function toggleLoop(){

    setIsLoop(!isLoop)
  }

  function toggleShuffle(){

    setIsShuffle(!isShuffle)
  }

  function setPlayingState(state: boolean){

    setIsPlaying(state)

  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffle || (currentEpisodeIndex + 1) < episodeList.length

  function playNext(){
    if(isShuffle){
      const nextRandomEpisodeIndex = Math.floor((Math.random() * episodeList.length))
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex -1 )
    }
    
  }
  return (

    <PlayerContext.Provider 
      value={{
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,  
        play, 
        playList,
        playNext,
        playPrevious,
        togglePlay, 
        hasNext,
        hasPrevious,
        setPlayingState,
        isLoop,
        toggleLoop,
        toggleShuffle,
        isShuffle,
        clearPlayerState


        }}
    >
      
      {children}
  
    </PlayerContext.Provider>
    )

}

export const usePlayer = () =>{
  return useContext(PlayerContext);
}