package ru.spb.itmo.asashina.backend.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ReviewResponse {

    private Long id;
    private String username;
    private int rating;
    private String comment;
    private LocalDate date;

}
