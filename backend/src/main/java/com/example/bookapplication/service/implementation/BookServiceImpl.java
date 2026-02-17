package com.example.bookapplication.service.implementation;

import com.example.bookapplication.dto.BookDTO;
import com.example.bookapplication.entity.Book;
import com.example.bookapplication.repository.BookRepository;
import com.example.bookapplication.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    // Convert Entity to DTO
    private BookDTO toDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setDescription(book.getDescription());
        dto.setPrice(book.getPrice());
        return dto;
    }
    
    // Convert DTO to Entity
    private Book toEntity(BookDTO dto) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        return book;
    }
    
    // Update existing entity with DTO data
    private void updateEntityFromDTO(BookDTO dto, Book book) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
    }
    
    @Override
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = toEntity(bookDTO);
        Book savedBook = bookRepository.save(book);
        return toDTO(savedBook);
    }
    
    @Override
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<BookDTO> getBookById(Long id) {
        return bookRepository.findById(id)
                .map(this::toDTO);
    }
    
    @Override
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        
        updateEntityFromDTO(bookDTO, book);
        Book updatedBook = bookRepository.save(book);
        
        return toDTO(updatedBook);
    }
    
    @Override
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookRepository.delete(book);
    }
    
    @Override
    public List<BookDTO> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookDTO> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
