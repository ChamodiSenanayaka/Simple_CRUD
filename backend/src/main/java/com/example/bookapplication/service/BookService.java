package com.example.bookapplication.service;

import com.example.bookapplication.dto.BookDTO;

import java.util.List;
import java.util.Optional;

public interface BookService {
    
    BookDTO createBook(BookDTO bookDTO);
    
    List<BookDTO> getAllBooks();
    
    Optional<BookDTO> getBookById(Long id);
    
    BookDTO updateBook(Long id, BookDTO bookDTO);
    
    void deleteBook(Long id);
    
    List<BookDTO> searchByTitle(String title);
    
    List<BookDTO> searchByAuthor(String author);
}
