CREATE TABLE movies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL UNIQUE,
    year INT NOT NULL,
    genre TEXT NOT NULL,
    director VARCHAR(250) NOT NULL,
    movie_cast TEXT NOT NULL,
    rating NUMERIC(4, 2) NOT NULL CHECK (rating <= 10 and rating >= 0) DEFAULT 10,
    description TEXT,
    poster_url TEXT NOT NULL
);

CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    rating int NOT NULL CHECK (rating <= 10 and rating >= 1) DEFAULT 10,
    comment TEXT NOT NULL,
    review_date date not null,
    movie_id SERIAL NOT NULL REFERENCES movies(id),
    UNIQUE(movie_id, username)
);