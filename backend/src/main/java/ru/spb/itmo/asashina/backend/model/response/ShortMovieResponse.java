package ru.spb.itmo.asashina.backend.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ShortMovieResponse {

    private Long id;
    private String title;
    private Integer year;
    private Float rating;

}
