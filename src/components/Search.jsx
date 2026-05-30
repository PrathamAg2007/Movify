import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <div>
            <img src='./search.svg' alt='Search' />
            <input 
                placeholder='Find your next favourite movie'
                type='text'
                value={searchTerm}
                onChange={(e)=>{setSearchTerm(e.target.value)}}
            />
        </div>
    </div>
  )
}

export default Search