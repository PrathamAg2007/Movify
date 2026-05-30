import React from 'react'

const MovieCard = ({movie : {title, poster_path, original_language, release_date, vote_average}}) => {
  return (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './no-poster.png'} alt={title} />
        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src='./star.svg'/>
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span>•</span>
                <div className="lang">
                    <p>{original_language}</p>
                </div>
                <span>•</span>
                <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard