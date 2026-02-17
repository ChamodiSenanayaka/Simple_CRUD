package com.example.bookapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private Double price;
}
