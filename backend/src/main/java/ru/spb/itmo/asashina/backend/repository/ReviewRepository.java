package ru.spb.itmo.asashina.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.spb.itmo.asashina.backend.model.entity.Review;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Long> {

    List<Review> findAllByMovieId(Long movieId);

    Optional<Review> findByMovieIdAndUsername(Long movieId, String username);

}
