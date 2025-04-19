package ru.spb.itmo.asashina.backend.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class MovieResponse {

    private Long id;
    private String title;
    private int year;
    private String genre;
    private String director;
    private List<String> cast;
    private float rating;
    private String description;
    private String posterUrl;
    private List<ReviewResponse> reviews;

}
