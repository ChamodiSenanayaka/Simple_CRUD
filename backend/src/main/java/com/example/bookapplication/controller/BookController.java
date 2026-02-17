package com.example.bookapplication.controller;

import com.example.bookapplication.dto.BookDTO;
import com.example.bookapplication.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @Value("${api.key.create}")
    private String createApiKey;
    
    @Value("${api.key.update}")
    private String updateApiKey;
    
    @Value("${api.key.delete}")
    private String deleteApiKey;
    
    // Validate API Key
    private boolean isValidApiKey(String providedKey, String expectedKey) {
        return expectedKey != null && expectedKey.equals(providedKey);
    }
    
    // Create a new book
    @PostMapping("/create")
    public ResponseEntity<?> createBook(@RequestHeader(value = "X-API-Key", required = false) String apiKey, 
                                         @RequestBody BookDTO bookDTO) {
        if (!isValidApiKey(apiKey, createApiKey)) {
            return new ResponseEntity<>("Invalid or missing API key for create operation", HttpStatus.UNAUTHORIZED);
        }
        BookDTO createdBook = bookService.createBook(bookDTO);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }
    
    // Get all books
    @GetMapping("/api/books")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
    
    // Get book by ID
    @GetMapping("/api/books/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Update book
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBook(@RequestHeader(value = "X-API-Key", required = false) String apiKey,
                                         @PathVariable Long id, @RequestBody BookDTO bookDTO) {
        if (!isValidApiKey(apiKey, updateApiKey)) {
            return new ResponseEntity<>("Invalid or missing API key for update operation", HttpStatus.UNAUTHORIZED);
        }
        try {
            BookDTO updatedBook = bookService.updateBook(id, bookDTO);
            return new ResponseEntity<>(updatedBook, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete book
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBook(@RequestHeader(value = "X-API-Key", required = false) String apiKey,
                                         @PathVariable Long id) {
        if (!isValidApiKey(apiKey, deleteApiKey)) {
            return new ResponseEntity<>("Invalid or missing API key for delete operation", HttpStatus.UNAUTHORIZED);
        }
        try {
            bookService.deleteBook(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Search books by title
    @GetMapping("/api/books/search/title")
    public ResponseEntity<List<BookDTO>> searchByTitle(@RequestParam String query) {
        List<BookDTO> books = bookService.searchByTitle(query);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
    
    // Search books by author
    @GetMapping("/api/books/search/author")
    public ResponseEntity<List<BookDTO>> searchByAuthor(@RequestParam String query) {
        List<BookDTO> books = bookService.searchByAuthor(query);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
}
