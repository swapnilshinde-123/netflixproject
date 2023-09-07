const apikey ='df07b069088099c8e136a89bad55bbc5';
const apiEndpoint="https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths ={
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList:( id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`,
  }

function init(){
   fetchTrendingMovies();
   fetchBuildAllSection();
}


function fetchTrendingMovies(){
  fetchBuildMovieSection(apiPaths.fetchTrending,'Trending Now')
  .then(list =>{
    const randomIndex =parseInt(Math.random() * list.length);
    buildBannerSection(list[randomIndex]);
  }).catch(err=>{
    console.error(err);
  });
}

function buildBannerSection(movies){
  const bannerCont =document.getElementById('Trending-section');
  bannerCont.style.backgroundImage = `url('${imgPath}${movies.backdrop_path}')`;

  const div =document.createElement('div');

  div.innerHTML = `
  <h2 class="Trending_title">${movies.title}</h2>
  <p class="Trending_info">Trending in movies | Released -${movies.release_date}</p>
  <p class="Trending_over">${movies.overview}</p>
  <div class="buttons-container">
      <button class="action-button"><i class='bx bx-play'></i>Play</button>
      <button class="action-button"><i class='bx bx-info-circle'></i>More Info</button>
  </div>
  `;
  div.className ="Trending-content container";
  bannerCont.append(div);
}
 function fetchBuildAllSection(){
    fetch(apiPaths.fetchAllCategories)
   .then(res =>res.json())
   .then(res =>{
    const categories = res.genres;
    if(Array.isArray(categories) && categories.length) {
       categories.forEach(category =>{
        fetchBuildMovieSection(apiPaths.fetchMoviesList(category.id),category);
       });
    }
   })
   .catch(err=>console.error(err));
 }

 function fetchBuildMovieSection(fetchUrl, categoryName){
   console.log(fetchUrl, categoryName);
   return fetch(fetchUrl)
   .then(res => res.json())
   .then(res => {
                 const movies = res. results;
                 if(Array.isArray(movies) && movies.length){
                  buildMoviesSection(movies, categoryName.name);
                 }
                 return movies;
              })
   .catch(err=> console.error(err))
 }
 function buildMoviesSection(list, categoryName){
   
   const moviesCont =document.getElementById('movies-cont');
  const moviesListHTML = list.map(item=>{
      return ` 
      <div class="movie-item" onmouseenter= "searchMovieTrailer('${item.title}','yt${item.id}')">
      <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
      <div class="iframe"id="yt${item.id}"></div>
      </div>
      `;
   }).join('');

     const moviesSectionHTML =`
     <div class="movies-section">
     <h2 class="movies-section-heading">${categoryName}<span class="explore">Explore All</span></h2></div>
     <div class="movies-row">
     ${moviesListHTML}
     </div>`
    
   const div = document.createElement('div');
   div.className ="movies-section"
   div.innerHTML = moviesSectionHTML;

   moviesCont.append(div);
 }

 function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
  .then(res => res.json())
  .then(res => {
      const bestResult = res.items[0];
      
      const elements = document.getElementById(iframId);
      console.log(elements, iframId);

      const div = document.createElement('div');
      div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

      elements.append(div);
      
  })
  .catch(err=>console.log(err));
}
 

window.addEventListener('load',function() {
  init();
  window.addEventListener('scroll', function(){
      
      const header = document.getElementById('header');
      if (window.scrollY > 5) header.classList.add('black-bg')
      else header.classList.remove('black-bg');
  })
})