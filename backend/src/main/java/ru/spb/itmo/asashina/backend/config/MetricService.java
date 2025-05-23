package ru.spb.itmo.asashina.backend.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MetricService {

    private final MeterRegistry meterRegistry;

    private Counter getMoviesRequestCounter;
    private Counter getMovieRequestCounter;
    private Counter createMovieReviewRequestCounter;
    private Counter editMovieReviewRequestCounter;
    private Counter deleteMovieReviewRequestCounter;

    @PostConstruct
    private void postConstruct() {
        getMovieRequestCounter = meterRegistry.counter("get_movie_request_counter");
        getMoviesRequestCounter = meterRegistry.counter("get_movies_request_counter");
        createMovieReviewRequestCounter = meterRegistry.counter("create_movie_review_request_counter");
        editMovieReviewRequestCounter = meterRegistry.counter("edit_movie_review_request_counter");
        deleteMovieReviewRequestCounter = meterRegistry.counter("delete_movie_review_request_counter");
    }

    public void incrementGetMoviesRequestCounter() {
        getMoviesRequestCounter.increment();
    }

    public void incrementGetMovieRequestCounter() {
        getMovieRequestCounter.increment();
    }

    public void incrementCreateMovieReviewRequestCounter() {
        createMovieReviewRequestCounter.increment();
    }

    public void incrementEditMovieReviewRequestCounter() {
        editMovieReviewRequestCounter.increment();
    }

    public void incrementDeleteMovieReviewRequestCounter() {
        deleteMovieReviewRequestCounter.increment();
    }

}
