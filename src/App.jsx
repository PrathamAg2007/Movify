import React from 'react'
import Search from './components/Search.jsx'
import { useState, useEffect } from 'react'
import MovieCard from './components/MovieCard.jsx'
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [trendingMovieList, setTrendingMovieList] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debouncing - to optimize search functionality
  // (function, delay(->500ms in this case), dependency)
  useDebounce(()=>{
    setDebouncedSearchTerm(searchTerm)
  }, 500, [searchTerm])

  const fetchApi = async (query='') => {
    setIsLoading(true);
    setErrorMessage('');

    try{
      const URL = query ?
       `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
       : 
       `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(URL, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed to load movies");
      }

      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error || "Failed to load movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results);

      if(query && data.results.length>0){
        await updateSearchCount(query, data.results[0]);
      }
    } catch(error) {
      console.error(error);
      setErrorMessage("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }

  const trendingMovies = async() => {
    try{
      const movies = await getTrendingMovies()
      setTrendingMovieList(movies)
    } catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchApi(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  useEffect(()=>{
    trendingMovies();
  }, [])

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' alt='hero image' />
          <h1>Discover <span className='text-gradient'>Movies</span> Without Endless Scrolling</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        
        {trendingMovieList.length>0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovieList.map((movie, index)=>{
                return(
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading 
          ? <p className='text-white'>Loading...</p>
          : errorMessage 
          ? <p className='text-red-500'>{errorMessage}</p>
          : <ul>
              {movieList.map((movie)=>{
                return(
                  <MovieCard key={movie.id} movie={movie}/>
                )
              })}
            </ul>
        }
        </section>
      </div>
    </main>
  )
}

export default App