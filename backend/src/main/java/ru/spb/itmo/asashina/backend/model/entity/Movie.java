package ru.spb.itmo.asashina.backend.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@Setter
@Table("movies")
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Movie {

    @Id
    @Column
    private Long id;

    @Column
    private String title;

    @Column
    private int year;

    @Column
    private String genre;

    @Column
    private String director;

    @Column
    private String movieCast;

    @Column
    private float rating;

    @Column
    private String description;

    @Column
    private String posterUrl;

}
