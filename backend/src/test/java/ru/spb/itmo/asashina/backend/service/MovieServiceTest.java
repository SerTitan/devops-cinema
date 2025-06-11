package ru.spb.itmo.asashina.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;
import ru.spb.itmo.asashina.backend.exception.EntityAlreadyExistsException;
import ru.spb.itmo.asashina.backend.exception.EntityNotFoundException;
import ru.spb.itmo.asashina.backend.model.entity.Movie;
import ru.spb.itmo.asashina.backend.model.entity.Review;
import ru.spb.itmo.asashina.backend.model.request.ReviewRequest;
import ru.spb.itmo.asashina.backend.repository.MovieRepository;
import ru.spb.itmo.asashina.backend.repository.ReviewRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock(answer = RETURNS_DEEP_STUBS)
    private RestClient botRestClient;

    @Mock(answer = RETURNS_DEEP_STUBS)
    private RestClient.Builder builder;

    @InjectMocks
    private MovieService movieService;

    @Test
    void getAllMoviesWithoutSearchTest() {
        when(movieRepository.findAll())
                .thenReturn(List.of(
                        new Movie()
                                .setId(1L)
                                .setTitle("tittle")
                                .setRating(10.00F)
                                .setYear(2020)));

        var result = movieService.getAllMovies(null);

        assertEquals(1, result.size());
        assertEquals("tittle", result.get(0).getTitle());
        assertEquals(10.00F, result.get(0).getRating(), 0);
        assertEquals(2020, result.get(0).getYear());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void getAllMoviesWithSearchTest() {
        var search = "tit";
        when(movieRepository.findAllByTitleContainingIgnoreCase(search))
                .thenReturn(List.of(getMovie()));

        var result = movieService.getAllMovies(search);

        assertEquals(1, result.size());
        assertEquals("title", result.get(0).getTitle());
        assertEquals(10.00F, result.get(0).getRating(), 0);
        assertEquals(2020, result.get(0).getYear());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void getMovieTest() {
        var id = 1L;
        when(movieRepository.findById(id))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findAllByMovieId(id))
                .thenReturn(List.of(getReview()));

        var result = movieService.getMovie(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
        assertEquals("title", result.getTitle());
        assertEquals(10.00F, result.getRating(), 0);
        assertEquals("dir", result.getDirector());
        assertEquals("url", result.getPosterUrl());
        assertEquals("desc", result.getDescription());
        assertEquals("drama", result.getGenre());
        assertEquals(2020, result.getYear());
        assertEquals(List.of("Anna", "Bob"), result.getCast());

        assertEquals(1, result.getReviews().size());
        assertEquals(1L, result.getReviews().get(0).getId());
        assertEquals("username", result.getReviews().get(0).getUsername());
        assertEquals("comment", result.getReviews().get(0).getComment());
        assertEquals(10, result.getReviews().get(0).getRating());
        assertEquals(LocalDate.now(), result.getReviews().get(0).getDate());
    }

    @Test
    void getMovieThrowsNotFoundExceptionTest() {
        var id = 1L;
        when(movieRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> movieService.getMovie(id))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Movie with following id does not exist");
    }

    @Test
    void createReviewTest() {
        var movieId = 1L;
        var request = new ReviewRequest()
                .setComment("comment")
                .setUsername("username")
                .setRating(10);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findByMovieIdAndUsername(movieId, request.getUsername()))
                .thenReturn(Optional.empty());
        when(reviewRepository.save(getReview().setId(null)))
                .thenReturn(getReview());
        when(reviewRepository.findAllByMovieId(movieId))
                .thenReturn(List.of(getReview()));
        when(movieRepository.save(getMovie()))
                .thenReturn(getMovie());

        var result = movieService.createReview(movieId, request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("comment", result.getComment());
        assertEquals("username", result.getUsername());
        assertEquals(10, result.getRating());
        assertEquals(LocalDate.now(), result.getDate());
    }

    @Test
    void createReviewThrowAlreadyExistsExceptionTest() {
        var movieId = 1L;
        var request = new ReviewRequest()
                .setComment("comment")
                .setUsername("username")
                .setRating(10);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findByMovieIdAndUsername(movieId, request.getUsername()))
                .thenReturn(Optional.of(getReview()));

        assertThatThrownBy(() -> movieService.createReview(movieId, request))
                .isInstanceOf(EntityAlreadyExistsException.class)
                .hasMessage("Review on this film by current user already exists");
    }

    @Test
    void createReviewThrowNotFoundExceptionTest() {
        var movieId = 1L;
        var request = new ReviewRequest()
                .setComment("comment")
                .setUsername("username")
                .setRating(10);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> movieService.createReview(movieId, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Movie with following id does not exist");
    }

    @Test
    void updateReviewTest() {
        var movieId = 1L;
        var reviewId = 1L;
        var request = new ReviewRequest()
                .setComment("comment10")
                .setUsername("username")
                .setRating(5);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findById(reviewId))
                .thenReturn(Optional.of(getReview()));
        var newReview = getReview()
                .setComment("comment10")
                .setRating(5);
        when(reviewRepository.save(newReview))
                .thenReturn(newReview);
        when(reviewRepository.findAllByMovieId(movieId))
                .thenReturn(List.of(newReview));
        when(movieRepository.save(getMovie().setRating(5.00F)))
                .thenReturn(getMovie().setRating(5.00F));

        var result = movieService.updateReview(movieId, reviewId, request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("comment10", result.getComment());
        assertEquals("username", result.getUsername());
        assertEquals(5, result.getRating());
        assertEquals(LocalDate.now(), result.getDate());
    }

    @Test
    void updateReviewThrowsAlreadyExistsExceptionTest() {
        var movieId = 1L;
        var reviewId = 1L;
        var request = new ReviewRequest()
                .setComment("comment10")
                .setUsername("username1")
                .setRating(5);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findById(reviewId))
                .thenReturn(Optional.of(getReview()));
        when(reviewRepository.findByMovieIdAndUsername(movieId, request.getUsername()))
                .thenReturn(Optional.of(getReview()));

        assertThatThrownBy(() -> movieService.updateReview(movieId, reviewId, request))
                .isInstanceOf(EntityAlreadyExistsException.class)
                .hasMessage("Review on this film by current user already exists");
    }

    @Test
    void updateReviewThrowsNotFoundExceptionTest() {
        var movieId = 1L;
        var reviewId = 1L;
        var request = new ReviewRequest()
                .setComment("comment10")
                .setUsername("username1")
                .setRating(5);
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findById(reviewId))
                .thenReturn(Optional.empty());
        assertThatThrownBy(() -> movieService.updateReview(movieId, reviewId, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Review with following id does not exist");

        when(movieRepository.findById(movieId))
                .thenReturn(Optional.empty());
        assertThatThrownBy(() -> movieService.updateReview(movieId, reviewId, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Movie with following id does not exist");
    }

    @Test
    void deleteReviewTest() {
        var movieId = 1L;
        var reviewId = 1L;
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findById(reviewId))
                .thenReturn(Optional.of(getReview()));
        doNothing().when(reviewRepository).deleteById(reviewId);

        assertDoesNotThrow(() -> movieService.deleteReview(movieId, reviewId));
    }

    @Test
    void deleteReviewThrowsNotFoundExceptionTest() {
        var movieId = 1L;
        var reviewId = 1L;
        when(movieRepository.findById(movieId))
                .thenReturn(Optional.of(getMovie()));
        when(reviewRepository.findById(reviewId))
                .thenReturn(Optional.empty());
        assertThatThrownBy(() -> movieService.deleteReview(movieId, reviewId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Review with following id does not exist");

        when(movieRepository.findById(movieId))
                .thenReturn(Optional.empty());
        assertThatThrownBy(() -> movieService.deleteReview(movieId, reviewId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Movie with following id does not exist");
    }

    private static Movie getMovie() {
        return new Movie()
                .setId(1L)
                .setDescription("desc")
                .setMovieCast("Anna, Bob")
                .setRating(10.00F)
                .setGenre("drama")
                .setDirector("dir")
                .setPosterUrl("url")
                .setTitle("title")
                .setYear(2020);
    }

    private static Review getReview() {
        return new Review()
                .setId(1L)
                .setMovieId(1L)
                .setUsername("username")
                .setComment("comment")
                .setRating(10)
                .setReviewDate(LocalDate.now());
    }

}