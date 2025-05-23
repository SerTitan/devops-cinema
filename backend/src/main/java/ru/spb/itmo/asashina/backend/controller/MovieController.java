package ru.spb.itmo.asashina.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.spb.itmo.asashina.backend.model.request.ReviewRequest;
import ru.spb.itmo.asashina.backend.model.response.MovieResponse;
import ru.spb.itmo.asashina.backend.model.response.ReviewResponse;
import ru.spb.itmo.asashina.backend.model.response.ShortMovieResponse;
import ru.spb.itmo.asashina.backend.config.MetricService;
import ru.spb.itmo.asashina.backend.service.MovieService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {

    private final MovieService movieService;
    private final MetricService metricService;

    @GetMapping("")
    @Operation(summary = "Поиск всех фильмов", tags = "Movie Controller", responses = {
            @ApiResponse(responseCode = "200", description = "Список фильмов", content = {
                    @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ShortMovieResponse.class)))
            })
    })
    public ResponseEntity<?> getAllMovies(@RequestParam(required = false) String search) {
        metricService.incrementGetMoviesRequestCounter();
        return ResponseEntity.ok(movieService.getAllMovies(search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Показ информации о фильме", tags = "Movie Controller", responses = {
            @ApiResponse(responseCode = "200", description = "Информация о фильме и отзывы", content = {
                    @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MovieResponse.class))
            })
    })
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        metricService.incrementGetMovieRequestCounter();
        return ResponseEntity.ok(movieService.getMovie(id));
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "Добавление отзыва", tags = "Movie Controller", responses = {
            @ApiResponse(responseCode = "200", description = "Информация об отзыве", content = {
                    @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReviewResponse.class))
            })
    })
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody @Valid ReviewRequest request) {
        metricService.incrementCreateMovieReviewRequestCounter();
        return ResponseEntity.ok(movieService.createReview(id, request));
    }

    @PutMapping("/{id}/review/{reviewId}")
    @Operation(summary = "Обновление отзыва", tags = "Movie Controller", responses = {
            @ApiResponse(responseCode = "200", description = "Информация об отзыве", content = {
                    @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReviewResponse.class))
            })
    })
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @PathVariable Long reviewId,
            @RequestBody @Valid ReviewRequest request) {

        metricService.incrementEditMovieReviewRequestCounter();
        return ResponseEntity.ok(movieService.updateReview(id, reviewId, request));
    }

    @DeleteMapping("/{id}/review/{reviewId}")
    @Operation(summary = "Удаление отзыва", tags = "Movie Controller")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, @PathVariable Long reviewId) {
        metricService.incrementDeleteMovieReviewRequestCounter();
        movieService.deleteReview(id, reviewId);
        return ResponseEntity.noContent().build();
    }

}
