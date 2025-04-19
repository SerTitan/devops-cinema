package ru.spb.itmo.asashina.backend.model.entity;

import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Getter
@Setter
@Table("reviews")
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Review {

    @Id
    @Column
    private Long id;

    @Column
    private String username;

    @Column
    private int rating;

    @Column
    private String comment;

    @Column
    private LocalDate reviewDate;

    @Column
    private Long movieId;

}
