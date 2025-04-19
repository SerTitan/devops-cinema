package ru.spb.itmo.asashina.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.spb.itmo.asashina.backend.model.entity.Movie;

import java.util.List;

@Repository
public interface MovieRepository extends CrudRepository<Movie, Long> {

    List<Movie> findAll();

    List<Movie> findAllByTitleContainingIgnoreCase(String title);

}
