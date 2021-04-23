import Header from "../components/Header";
import Image from 'next/image';
import {GetStaticProps} from 'next';
import { type } from "node:os";
import { api } from "../services/api";
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from './home.module.scss';

type Episode = {

  id: string;
  title: string;
  members: string;
  publishedAt: string;
  description:string;
  thumbnail:string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpsodes: Episode[];
}

export default function Home({latestEpisodes, allEpsodes}: HomeProps) {
  
  return (
   <div className={styles.homepage}>
    <section className={styles.latestEpisodes}>
      <h2>Últimos lançamentos</h2>
      <ul>

        {
          latestEpisodes.map(episode =>{
            return (
              <li key={episode.id}>
                <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                    <a href="" >{episode.title}</a>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </div>
                <button type="button" >
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })
        }

      </ul>

    </section>
    <section className={styles.allEpisodes}></section>
   </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  const { data } = await api.get('episodes',{
    params:{
      _limit:12,
      _sort: 'published_at',
      _oder: 'desc'
    }
  });

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at),'d MMM yy',{locale:ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpsodes = episodes.slice(2,episodes.length)
  
  return {
    props:{
      latestEpisodes,
      allEpsodes,
    },
    revalidate: 60 * 60 * 8,
  }
}