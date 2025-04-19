package ru.spb.itmo.asashina.backend.model.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ReviewRequest {

    @NotBlank(message = "Username field can not be null")
    @Size(max = 200, message = "Username cannot be longer than 200 symbols")
    private String username;

    @NotNull(message = "Rating field can not be null")
    @Min(value = 1, message = "Rating can not be less than 1")
    @Max(value = 10, message = "Rating can not be higher than 10")
    private Integer rating;

    @NotBlank(message = "Comment field can not be null")
    private String comment;

}
