import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const apiKey = process.env.API_KEY;
console.log(apiKey); // Aquí puedes usar tu clave API


const recomendaciones = {
    "acción": 28,
    "romance": 10749,
    "ciencia ficción": 878,
    "fantasía": 12,
    "misterio": 9648
};

document.getElementById("btn-recomendar").addEventListener("click", () => {
    const gustoSeleccionado = document.getElementById("gustos").value;
    const voteAverage = document.getElementById("vote-average").value;
    const releaseDate = document.getElementById("release-date").value;
    const adult = document.getElementById("adult").checked;
    const resultadoDiv = document.getElementById("resultado");
    
    if (gustoSeleccionado && recomendaciones[gustoSeleccionado]) {
        const genreId = recomendaciones[gustoSeleccionado];
        let query = `?api_key=${apiKey}&with_genres=${genreId}`;
        
        if (voteAverage) {
            query += `&vote_average.gte=${voteAverage}`;
        }
        if (releaseDate) {
            query += `&release_date.gte=${releaseDate}`;
        }
       
        
        query += `&include_adult=${adult}`;
        //query += `&include_adult=${adult}`;
        console.log(query);
        
        
        fetch(`https://api.themoviedb.org/3/discover/movie${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            
                
            })
            .then(data => {
                console.log(data);
                data.results=data.results.filter(pelicula=>pelicula.adult===adult)
                
                const peliculas = data.results.slice(0, 5).map(movie => movie.title);
                if (peliculas.length > 0) {
                    resultadoDiv.innerHTML = `<h2>Recomendaciones:</h2><p>${peliculas.join(', ')}</p>`;
                } else {
                    resultadoDiv.innerHTML = "<h2>No se encontraron películas que cumplan con los criterios.</h2>";
                }
            })
            .catch(error => {
                resultadoDiv.innerHTML = "<h2>Error al obtener recomendaciones. Intenta de nuevo más tarde.</h2>";
                console.error(error);
            });
    } else {
        resultadoDiv.innerHTML = "<h2>Por favor, selecciona un género.</h2>";
    }
});
