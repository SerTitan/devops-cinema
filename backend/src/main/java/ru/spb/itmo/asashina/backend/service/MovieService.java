package ru.spb.itmo.asashina.backend.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import ru.spb.itmo.asashina.backend.exception.EntityAlreadyExistsException;
import ru.spb.itmo.asashina.backend.exception.EntityNotFoundException;
import ru.spb.itmo.asashina.backend.model.entity.Movie;
import ru.spb.itmo.asashina.backend.model.entity.Review;
import ru.spb.itmo.asashina.backend.model.request.ReviewRequest;
import ru.spb.itmo.asashina.backend.model.response.MovieResponse;
import ru.spb.itmo.asashina.backend.model.response.ReviewResponse;
import ru.spb.itmo.asashina.backend.repository.MovieRepository;
import ru.spb.itmo.asashina.backend.model.response.ShortMovieResponse;
import ru.spb.itmo.asashina.backend.repository.ReviewRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class MovieService {

    private final RestClient botRestClient;
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public MovieService(
            MovieRepository movieRepository,
            ReviewRepository reviewRepository,
            RestClient.Builder builder,
            @Value("${bot.url}") String botUrl) {

        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
        this.botRestClient = builder
                .baseUrl(botUrl)
                .build();
    }

    public List<ShortMovieResponse> getAllMovies(String search) {
        var movies = StringUtils.isBlank(search)
                ? movieRepository.findAll()
                : movieRepository.findAllByTitleContainingIgnoreCase(search);
        return movies.stream()
                .map(it -> new ShortMovieResponse()
                        .setId(it.getId())
                        .setTitle(it.getTitle())
                        .setYear(it.getYear())
                        .setRating(it.getRating())
						.setPosterUrl(it.getPosterUrl()))
                .toList();
    }

    public MovieResponse getMovie(Long id) {
        var movie = findMovie(id);
        var reviews = reviewRepository.findAllByMovieId(id);
        return new MovieResponse()
                .setId(movie.getId())
                .setTitle(movie.getTitle())
                .setGenre(movie.getGenre())
                .setYear(movie.getYear())
                .setDirector(movie.getDirector())
                .setCast(Arrays.stream(movie.getMovieCast().split(", ")).toList())
                .setRating(movie.getRating())
                .setDescription(movie.getDescription())
                .setPosterUrl(movie.getPosterUrl())
                .setReviews(reviews.stream()
                        .map(it -> new ReviewResponse()
                                .setId(it.getId())
                                .setUsername(it.getUsername())
                                .setComment(it.getComment())
                                .setDate(it.getReviewDate())
                                .setRating(it.getRating()))
                        .toList());
    }

    @Transactional
    public ReviewResponse createReview(Long movieId, ReviewRequest request) {
        var movie = findMovie(movieId);
        findReviewByUsernameAndMovieId(request.getUsername(), movieId);

        var savedReview = reviewRepository.save(
                new Review()
                        .setUsername(request.getUsername())
                        .setMovieId(movieId)
                        .setRating(request.getRating())
                        .setComment(request.getComment())
                        .setReviewDate(LocalDate.now()));
        updateMovieRating(movie);
        botRestClient.post()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.ALL_VALUE)
                .body("Review created")
                .retrieve()
                .toBodilessEntity();
        return new ReviewResponse()
                .setId(savedReview.getId())
                .setUsername(request.getUsername())
                .setRating(request.getRating())
                .setComment(request.getComment())
                .setDate(savedReview.getReviewDate());
    }

    @Transactional
    public ReviewResponse updateReview(Long movieId, Long reviewId, ReviewRequest request) {
        var movie = findMovie(movieId);
        var prevReview = findReview(reviewId);
        if (!prevReview.getUsername().equals(request.getUsername())) {
            findReviewByUsernameAndMovieId(request.getUsername(), movieId);
        }

        var savedReview = reviewRepository.save(
                prevReview
                        .setUsername(
                                request.getUsername().equals(prevReview.getUsername())
                                        ? prevReview.getUsername()
                                        : request.getUsername())
                        .setRating(
                                request.getRating().equals(prevReview.getRating())
                                        ? prevReview.getRating()
                                        : request.getRating())
                        .setComment(
                                request.getComment().equals(prevReview.getComment())
                                        ? prevReview.getComment()
                                        : request.getComment())
                        .setReviewDate(LocalDate.now()));
        updateMovieRating(movie);
        botRestClient.post()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.ALL_VALUE)
                .body("Review updated")
                .retrieve()
                .toBodilessEntity();
        return new ReviewResponse()
                .setId(savedReview.getId())
                .setUsername(request.getUsername())
                .setRating(request.getRating())
                .setComment(request.getComment())
                .setDate(savedReview.getReviewDate());
    }

    @Transactional
    public void deleteReview(Long movieId, Long reviewId) {
        var movie = findMovie(movieId);
        findReview(reviewId);
        reviewRepository.deleteById(reviewId);
		updateMovieRating(movie);
        botRestClient.post()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.ALL_VALUE)
                .body("Review deleted")
                .retrieve()
                .toBodilessEntity();
    }

    private Movie findMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie with following id does not exist"));
    }

    private void findReviewByUsernameAndMovieId(String username, Long movieId) {
        var review = reviewRepository.findByMovieIdAndUsername(movieId, username);
        if (review.isPresent()) {
            throw new EntityAlreadyExistsException("Review on this film by current user already exists");
        }
    }

    private Review findReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review with following id does not exist"));
    }

    private void updateMovieRating(Movie movie) {
        var reviews = reviewRepository.findAllByMovieId(movie.getId());
		if (reviews.size() > 0) {
			movieRepository.save(movie.setRating(
                (float) (reviews.stream().mapToInt(Review::getRating).sum() / reviews.size())));
		}
		else
			movieRepository.save(movie.setRating((float) 0.0));
    }

}
