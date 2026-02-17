# Book Management System - Complete Viva Documentation

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [API Documentation](#7-api-documentation)
8. [Data Flow & Communication](#8-data-flow--communication)
9. [Security Features](#9-security-features)
10. [Component Breakdown](#10-component-breakdown)
11. [Setup & Deployment](#11-setup--deployment)
12. [Key Concepts for Viva](#12-key-concepts-for-viva)

---

## 1. Project Overview

### 1.1 What is This Project?
A **full-stack CRUD (Create, Read, Update, Delete) application** for managing a book collection. The system allows users to:
- ✅ **Create** new book entries
- ✅ **Read/View** all books in the database
- ✅ **Update** existing book information
- ✅ **Delete** books from the collection

### 1.2 Purpose
This application demonstrates:
- RESTful API design principles
- Full-stack development capabilities
- Database integration with PostgreSQL
- Modern frontend development with React/Next.js
- Backend development with Spring Boot
- API security with key-based authentication

### 1.3 Project Structure
```
Simple_CRUD/
├── backend/          # Spring Boot backend (Java)
├── frontend/         # Next.js frontend (TypeScript/React)
├── database/         # SQL setup scripts
├── README.md         # Project documentation
└── start scripts     # Startup scripts for both frontend and backend
```

---

## 2. Technology Stack

### 2.1 Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Programming language |
| **Spring Boot** | 4.0.2 | Backend framework |
| **Spring Data JPA** | - | Database ORM (Object-Relational Mapping) |
| **Hibernate** | - | JPA implementation |
| **PostgreSQL** | 12+ | Relational database |
| **Lombok** | - | Reduces boilerplate code |
| **Maven** | - | Dependency management and build tool |

### 2.2 Frontend Technologies
| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework with server-side rendering |
| **React** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Icon library |
| **Shadcn/UI** | Component library |

### 2.3 Why These Technologies?

**Backend:**
- **Spring Boot**: Industry-standard Java framework with extensive ecosystem
- **JPA/Hibernate**: Simplifies database operations with automatic SQL generation
- **PostgreSQL**: Robust, open-source RDBMS with excellent performance

**Frontend:**
- **Next.js**: Server-side rendering improves SEO and performance
- **TypeScript**: Type safety prevents runtime errors
- **Tailwind CSS**: Rapid UI development with utility classes

---

## 3. System Architecture

### 3.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                     │
│                   (Frontend - Next.js)                    │
│  - User Interface Components                              │
│  - Client-side validation                                 │
│  - HTTP Requests via Fetch API                            │
│  Port: 3000                                               │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (JSON)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                       │
│                 (Backend - Spring Boot)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Controller   │→ │   Service    │→ │  Repository  │  │
│  │   Layer      │  │    Layer     │  │    Layer     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  Port: 8080                                               │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ JDBC/SQL
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                           │
│                  (PostgreSQL Database)                    │
│  - Books table                                            │
│  - Data persistence                                       │
│  Port: 5432                                               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 RESTful API Pattern
The application follows REST principles:
- Resources identified by URIs (`/api/books`, `/api/books/1`)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- JSON data format

---

## 4. Database Design

### 4.1 Database Schema

**Database Name:** `bookdb`

**Table:** `books`

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `title` | VARCHAR(255) | NOT NULL | Book title |
| `author` | VARCHAR(255) | NOT NULL | Author name |
| `isbn` | VARCHAR(255) | NOT NULL | International Standard Book Number |
| `description` | VARCHAR(1000) | NULLABLE | Book description |
| `price` | DOUBLE PRECISION | NOT NULL | Book price |

### 4.2 Entity Relationship
- **Single Entity System**: This is a simple CRUD with one entity (Book)
- **No Foreign Keys**: Pure standalone book records
- **Auto-generated ID**: PostgreSQL sequence handles ID generation

### 4.3 Database Configuration
Located in `backend/src/main/resources/application.properties`:

```properties
# Database URL
spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb

# Credentials
spring.datasource.username=postgres
spring.datasource.password=Chamodi@123

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update    # Auto-create/update tables
spring.jpa.show-sql=true                # Log SQL queries
```

**Key Configuration Explained:**
- `ddl-auto=update`: Hibernate automatically creates/updates table schema
- `show-sql=true`: Logs all SQL queries for debugging
- `dialect=PostgreSQLDialect`: Optimizes SQL for PostgreSQL

---

## 5. Backend Implementation

### 5.1 Spring Boot Architecture Layers

#### **Layer 1: Entity Layer** (`Book.java`)
**Purpose:** Represents the database table as a Java class

```java
@Entity                          // Marks as JPA entity
@Table(name = "books")           // Maps to 'books' table
@Data                            // Lombok: generates getters/setters
@NoArgsConstructor              // Lombok: generates no-args constructor
@AllArgsConstructor             // Lombok: generates all-args constructor
public class Book {
    @Id                         // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    @Column(nullable = false)   // NOT NULL constraint
    private String title;
    
    @Column(nullable = false)
    private String author;
    
    @Column(nullable = false)
    private String isbn;
    
    @Column(length = 1000)      // VARCHAR(1000)
    private String description;
    
    @Column(nullable = false)
    private Double price;
}
```

**Key Annotations:**
- `@Entity`: Tells JPA this is a database table
- `@Id`: Primary key field
- `@GeneratedValue`: Auto-increment strategy
- `@Column`: Configure column properties
- Lombok annotations reduce boilerplate code

---

#### **Layer 2: Repository Layer** (`BookRepository.java`)
**Purpose:** Database access interface

```java
@Repository                                      // Spring Data repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom query methods
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
```

**What JpaRepository Provides:**
- `save()`: Create/Update
- `findAll()`: Get all records
- `findById()`: Get by ID
- `delete()`: Delete record
- `count()`: Count records
- Custom queries using method naming convention

**How It Works:**
Spring Data JPA automatically implements these methods at runtime using method name parsing.

---

#### **Layer 3: Service Layer** (`BookService.java`)
**Purpose:** Business logic and data processing

```java
@Service                                         // Service component
public class BookService {
    @Autowired                                   // Dependency injection
    private BookRepository bookRepository;
    
    // CREATE
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
    
    // READ ALL
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    // READ BY ID
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
    
    // UPDATE
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setDescription(bookDetails.getDescription());
        book.setPrice(bookDetails.getPrice());
        
        return bookRepository.save(book);
    }
    
    // DELETE
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        bookRepository.delete(book);
    }
    
    // SEARCH
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Book> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }
}
```

**Service Layer Responsibilities:**
- Business logic execution
- Data validation
- Transaction management
- Error handling

---

#### **Layer 4: Controller Layer** (`BookController.java`)
**Purpose:** HTTP request handling and API endpoints

```java
@RestController                                  // REST API controller
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class BookController {
    @Autowired
    private BookService bookService;
    
    @Value("${api.key.create}")                 // Inject from properties
    private String createApiKey;
    
    // CREATE ENDPOINT
    @PostMapping("/create")
    public ResponseEntity<?> createBook(
        @RequestHeader(value = "X-API-Key", required = false) String apiKey,
        @RequestBody Book book) {
        
        if (!isValidApiKey(apiKey, createApiKey)) {
            return new ResponseEntity<>("Invalid API key", HttpStatus.UNAUTHORIZED);
        }
        Book createdBook = bookService.createBook(book);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }
    
    // READ ALL ENDPOINT
    @GetMapping("/api/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
    
    // READ BY ID ENDPOINT
    @GetMapping("/api/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
            .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // UPDATE ENDPOINT
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBook(
        @RequestHeader(value = "X-API-Key", required = false) String apiKey,
        @PathVariable Long id,
        @RequestBody Book bookDetails) {
        
        if (!isValidApiKey(apiKey, updateApiKey)) {
            return new ResponseEntity<>("Invalid API key", HttpStatus.UNAUTHORIZED);
        }
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            return new ResponseEntity<>(updatedBook, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE ENDPOINT
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBook(
        @RequestHeader(value = "X-API-Key", required = false) String apiKey,
        @PathVariable Long id) {
        
        if (!isValidApiKey(apiKey, deleteApiKey)) {
            return new ResponseEntity<>("Invalid API key", HttpStatus.UNAUTHORIZED);
        }
        try {
            bookService.deleteBook(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
```

**Controller Annotations:**
- `@RestController`: Combines `@Controller` + `@ResponseBody`
- `@GetMapping`/`@PostMapping`/`@PutMapping`/`@DeleteMapping`: HTTP method mappings
- `@PathVariable`: Extract value from URL path
- `@RequestBody`: Parse JSON from request body
- `@RequestHeader`: Extract header values

---

### 5.2 CORS Configuration (`CorsConfig.java`)
**Purpose:** Allow frontend to communicate with backend

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedHeaders(Arrays.asList(
            "Origin", "Content-Type", "Accept", 
            "Authorization", "X-API-Key"
        ));
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        
        UrlBasedCorsConfigurationSource source = 
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

**Why CORS?**
- Browsers block cross-origin requests by default
- Frontend (port 3000) and backend (port 8080) are different origins
- CORS policy explicitly allows the frontend to access the backend

---

### 5.3 Application Entry Point
```java
@SpringBootApplication                           // Auto-configuration
public class BookapplicationApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookapplicationApplication.class, args);
    }
}
```

**@SpringBootApplication combines:**
- `@Configuration`: Bean definitions
- `@EnableAutoConfiguration`: Auto-configure dependencies
- `@ComponentScan`: Scan for components in package

---

## 6. Frontend Implementation

### 6.1 Frontend Architecture

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (List books)
│   ├── create/page.tsx    # Create book page
│   ├── update/[id]/page.tsx  # Update book page
│   └── delete/[id]/page.tsx  # Delete confirmation page
├── components/            # Reusable React components
│   ├── book-form.tsx     # Form component for create/update
│   ├── books-table.tsx   # Table to display books
│   └── ui/               # UI components (buttons, cards, etc.)
└── lib/                   # Utility files
    ├── api.ts            # API communication functions
    ├── types.ts          # TypeScript type definitions
    └── utils.ts          # Helper functions
```

---

### 6.2 Type Definitions (`lib/types.ts`)

```typescript
export interface Book {
  id?: number;              // Optional for create operation
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
}

export interface ApiError {
  message: string;
  status: number;
}
```

**Why TypeScript?**
- Compile-time type checking
- Better IDE autocomplete
- Prevents common errors
- Self-documenting code

---

### 6.3 API Communication Layer (`lib/api.ts`)

```typescript
const API_BASE_URL = 'http://localhost:8080';

// API Keys
const CREATE_API_KEY = 'http://localhost:3000/create';
const UPDATE_API_KEY = 'http://localhost:3000/update/{id}';
const DELETE_API_KEY = 'http://localhost:3000/delete/{id}';

// Fetch all books
export async function getAllBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/api/books`, {
    cache: 'no-store',        // Always fetch fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const books = await response.json();
  return Array.isArray(books) 
    ? books.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))
    : [];
}

// Create a new book
export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': CREATE_API_KEY,
    },
    body: JSON.stringify(book),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create book');
  }
  
  return response.json();
}

// Update an existing book
export async function updateBook(id: string, book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': UPDATE_API_KEY,
    },
    body: JSON.stringify(book),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  
  return response.json();
}

// Delete a book
export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'X-API-Key': DELETE_API_KEY,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
}
```

**Key Concepts:**
- `fetch()`: Modern browser API for HTTP requests
- `async/await`: Handle asynchronous operations
- Headers: Send metadata (Content-Type, API keys)
- Error handling: Throw errors for failed requests

---

### 6.4 Main Pages

#### **Home Page** (`app/page.tsx`)
```typescript
export default async function Home() {
  let books: Book[] = [];
  let error = null;

  try {
    books = await getAllBooks();    // Server-side data fetching
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load books";
  }

  return (
    <div>
      <h1>Book Management System</h1>
      <BooksTable books={books} />  {/* Display books in table */}
    </div>
  );
}
```

**Next.js Server Components:**
- Async components fetch data on the server
- Better performance (less JavaScript to client)
- SEO-friendly (HTML with data)

---

#### **Create Page** (`app/create/page.tsx`)
```typescript
"use client"

export default function CreateBookPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: Omit<Book, "id">) => {
    try {
      await createBook(data);       // Call API
      router.push("/");              // Redirect to home
      router.refresh();              // Refresh data
    } catch (error) {
      alert("Failed to create book");
    }
  };

  return (
    <BookForm
      onSubmit={handleSubmit}
      submitLabel="Create Book"
      title="Add New Book"
      description="Fill in the book details"
    />
  );
}
```

---

#### **Update Page** (`app/update/[id]/page.tsx`)
```typescript
export default async function UpdateBookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);  // Fetch existing book
  
  return (
    <UpdateForm initialData={book} id={params.id} />
  );
}
```

**Dynamic Routes:**
- `[id]` creates dynamic route segment
- `params.id` extracts ID from URL
- Example: `/update/5` → `params.id = "5"`

---

### 6.5 Reusable Components

#### **BookForm Component** (`components/book-form.tsx`)
```typescript
interface BookFormProps {
  initialData?: Book;          // Optional: for update form
  onSubmit: (data: Omit<Book, "id">) => Promise<void>;
  submitLabel: string;
  title: string;
  description: string;
}

export function BookForm({ initialData, onSubmit, ... }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    isbn: initialData?.isbn || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      {/* More fields... */}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
```

**React Hooks Used:**
- `useState`: Manage form state
- `useRouter`: Navigate between pages
- `useEffect`: Side effects (not shown here)

---

#### **BooksTable Component** (`components/books-table.tsx`)
```typescript
export function BooksTable({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return <div>No books found</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.isbn}</td>
            <td>${book.price.toFixed(2)}</td>
            <td>
              <Link href={`/update/${book.id}`}>Edit</Link>
              <Link href={`/delete/${book.id}`}>Delete</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 7. API Documentation

### 7.1 API Endpoints Summary

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | `/api/books` | No | Get all books |
| GET | `/api/books/{id}` | No | Get book by ID |
| POST | `/create` | Yes | Create new book |
| PUT | `/update/{id}` | Yes | Update book |
| DELETE | `/delete/{id}` | Yes | Delete book |

---

### 7.2 Detailed API Specifications

#### **1. Get All Books**
```http
GET /api/books
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "description": "A handbook of agile software craftsmanship",
    "price": 42.99
  },
  {
    "id": 2,
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "isbn": "978-0135957059",
    "description": "Your journey to mastery",
    "price": 39.99
  }
]
```

---

#### **2. Get Book by ID**
```http
GET /api/books/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "description": "A handbook of agile software craftsmanship",
  "price": 42.99
}
```

**Response (404 Not Found):**
```
No body
```

---

#### **3. Create Book**
```http
POST /create
Headers:
  Content-Type: application/json
  X-API-Key: http://localhost:3000/create
```

**Request Body:**
```json
{
  "title": "Design Patterns",
  "author": "Gang of Four",
  "isbn": "978-0201633610",
  "description": "Elements of reusable object-oriented software",
  "price": 54.99
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "Design Patterns",
  "author": "Gang of Four",
  "isbn": "978-0201633610",
  "description": "Elements of reusable object-oriented software",
  "price": 54.99
}
```

**Response (401 Unauthorized):**
```
Invalid or missing API key for create operation
```

---

#### **4. Update Book**
```http
PUT /update/1
Headers:
  Content-Type: application/json
  X-API-Key: http://localhost:3000/update/{id}
```

**Request Body:**
```json
{
  "title": "Clean Code (Updated)",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "description": "Updated description",
  "price": 44.99
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Clean Code (Updated)",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "description": "Updated description",
  "price": 44.99
}
```

---

#### **5. Delete Book**
```http
DELETE /delete/1
Headers:
  X-API-Key: http://localhost:3000/delete/{id}
```

**Response (204 No Content):**
```
No body
```

**Response (404 Not Found):**
```
No body
```

---

## 8. Data Flow & Communication

### 8.1 CREATE Operation Flow

```
┌──────────────┐
│    User      │
│  (Browser)   │
└──────┬───────┘
       │ 1. Fills form
       │ 2. Clicks "Create"
       ▼
┌──────────────────────┐
│  BookForm Component  │
│  (React)             │
└──────┬───────────────┘
       │ 3. handleSubmit()
       │ 4. Calls createBook()
       ▼
┌──────────────────────┐
│  api.ts              │
│  (API Layer)         │
└──────┬───────────────┘
       │ 5. POST /create
       │    Headers: X-API-Key
       │    Body: Book JSON
       ▼
┌──────────────────────┐
│  BookController      │
│  (Spring Boot)       │
└──────┬───────────────┘
       │ 6. Validates API key
       │ 7. Calls bookService.createBook()
       ▼
┌──────────────────────┐
│  BookService         │
│  (Service Layer)     │
└──────┬───────────────┘
       │ 8. Calls bookRepository.save()
       ▼
┌──────────────────────┐
│  BookRepository      │
│  (JPA)               │
└──────┬───────────────┘
       │ 9. SQL INSERT
       ▼
┌──────────────────────┐
│  PostgreSQL DB       │
│  (Database)          │
└──────┬───────────────┘
       │ 10. Returns saved book with ID
       ▼
┌──────────────────────┐
│  Frontend            │
│  (Success response)  │
└──────────────────────┘
       │ 11. Redirects to home page
       │ 12. Displays updated book list
       ▼
```

---

### 8.2 READ Operation Flow

```
User visits home page
       ↓
Next.js Server Component executes getAllBooks()
       ↓
GET /api/books (no auth required)
       ↓
BookController.getAllBooks()
       ↓
BookService.getAllBooks()
       ↓
BookRepository.findAll()
       ↓
SQL: SELECT * FROM books
       ↓
Returns List<Book>
       ↓
JSON serialization
       ↓
Response to frontend
       ↓
BooksTable component renders data
       ↓
User sees book list
```

---

### 8.3 UPDATE Operation Flow

```
User clicks "Edit" on a book
       ↓
Navigates to /update/[id]
       ↓
Server-side: getBookById(id) fetches existing data
       ↓
BookForm pre-fills with existing values
       ↓
User modifies fields and submits
       ↓
PUT /update/{id} with updated data + API key
       ↓
BookController validates API key
       ↓
BookService.updateBook(id, newData)
       ↓
Finds book by ID, updates fields, saves
       ↓
SQL: UPDATE books SET ... WHERE id = ?
       ↓
Returns updated book
       ↓
Frontend redirects to home page
```

---

### 8.4 DELETE Operation Flow

```
User clicks "Delete" on a book
       ↓
Navigates to /delete/[id]
       ↓
Confirmation dialog appears
       ↓
User confirms deletion
       ↓
DELETE /delete/{id} + API key
       ↓
BookController validates API key
       ↓
BookService.deleteBook(id)
       ↓
Finds book by ID, deletes
       ↓
SQL: DELETE FROM books WHERE id = ?
       ↓
Returns 204 No Content
       ↓
Frontend redirects to home page
```

---

## 9. Security Features

### 9.1 API Key Authentication

**Implementation:**
```java
// application.properties
api.key.create=http://localhost:3000/create
api.key.update=http://localhost:3000/update/{id}
api.key.delete=http://localhost:3000/delete/{id}

// Controller validation
private boolean isValidApiKey(String providedKey, String expectedKey) {
    return expectedKey != null && expectedKey.equals(providedKey);
}
```

**How It Works:**
1. Frontend includes `X-API-Key` header in create/update/delete requests
2. Backend validates key against configured value in `application.properties`
3. If invalid or missing, return `401 Unauthorized`
4. If valid, proceed with operation

**Security Level:**
- ⚠️ **Note:** This is basic security for demonstration purposes
- Real-world apps should use:
  - JWT (JSON Web Tokens)
  - OAuth 2.0
  - Spring Security
  - Encrypted API keys

---

### 9.2 CORS Configuration
**Purpose:** Prevent unauthorized domains from accessing API

```java
config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
```

Only the frontend at `localhost:3000` can make requests to the backend.

---

### 9.3 Input Validation
**Entity Level:**
```java
@Column(nullable = false)  // Database constraint
private String title;
```

**Frontend Level:**
```tsx
<Input required />  // HTML5 validation
```

---

## 10. Component Breakdown

### 10.1 Backend Components

| Component | Type | Responsibility |
|-----------|------|----------------|
| `Book.java` | Entity | Database table representation |
| `BookRepository` | Interface | Database operations |
| `BookService` | Service | Business logic |
| `BookController` | Controller | API endpoints |
| `CorsConfig` | Configuration | CORS policy |
| `application.properties` | Config | Database & app settings |

---

### 10.2 Frontend Components

| Component | Type | Purpose |
|-----------|------|---------|
| `page.tsx` | Server Component | Home page - displays all books |
| `create/page.tsx` | Client Component | Create book form |
| `update/[id]/page.tsx` | Server Component | Update book form |
| `delete/[id]/page.tsx` | Client Component | Delete confirmation |
| `book-form.tsx` | Client Component | Reusable form |
| `books-table.tsx` | Client Component | Display books in table |
| `api.ts` | Utility | API communication |
| `types.ts` | Types | TypeScript interfaces |

---

### 10.3 UI Component Library

**Shadcn/UI Components Used:**
- `Button`: Clickable buttons
- `Card`: Container for content
- `Input`: Text input fields
- `Label`: Form labels
- `Textarea`: Multi-line text input
- `Dialog`: Modal popups

**Styling:**
- Tailwind CSS utility classes
- Responsive design
- Gradient backgrounds
- Icon integration (Lucide React)

---

## 11. Setup & Deployment

### 11.1 Prerequisites
1. **Java 17+**: Backend runtime
2. **Node.js 18+**: Frontend runtime
3. **PostgreSQL 12+**: Database
4. **Maven**: Build tool (comes with Java)
5. **npm/pnpm**: Package manager

---

### 11.2 Database Setup

**Step 1: Create Database**
```sql
CREATE DATABASE bookdb;
```

**Step 2: Update Credentials**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**Step 3: Auto-create Table**
Spring Boot automatically creates the `books` table on first run using the `@Entity` class definition.

---

### 11.3 Running the Backend

**Option 1: Using Maven**
```bash
cd backend
mvnw spring-boot:run          # Windows
./mvnw spring-boot:run        # macOS/Linux
```

**Option 2: Using IDE**
- Open project in IntelliJ IDEA or Eclipse
- Run `BookapplicationApplication.java`

**Backend runs on:** `http://localhost:8080`

---

### 11.4 Running the Frontend

```bash
cd frontend
npm install                   # Install dependencies
npm run dev                   # Start development server
```

**Frontend runs on:** `http://localhost:3000`

---

### 11.5 Startup Scripts

**Windows (`start.bat`):**
```batch
@echo off
start cmd /k "cd backend && mvnw spring-boot:run"
timeout /t 5
start cmd /k "cd frontend && npm run dev"
```

**Linux/macOS (`start.sh`):**
```bash
#!/bin/bash
cd backend && ./mvnw spring-boot:run &
cd frontend && npm run dev &
```

---

## 12. Key Concepts for Viva

### 12.1 Core Concepts to Explain

#### **1. What is CRUD?**
**Answer:**
CRUD stands for Create, Read, Update, Delete - the four basic operations of persistent storage:
- **Create**: Add new records (POST)
- **Read**: Retrieve records (GET)
- **Update**: Modify existing records (PUT)
- **Delete**: Remove records (DELETE)

---

#### **2. What is REST?**
**Answer:**
REST (Representational State Transfer) is an architectural style for designing networked applications. Key principles:
- **Resources**: Entities identified by URIs (e.g., `/api/books`)
- **HTTP Methods**: Standard operations (GET, POST, PUT, DELETE)
- **Stateless**: No client context stored on server
- **JSON**: Standard data format

---

#### **3. Why Three-Tier Architecture?**
**Answer:**
Separates concerns into layers:
- **Presentation (Frontend)**: User interface
- **Application (Backend)**: Business logic
- **Data (Database)**: Data storage

**Benefits:**
- Easier maintenance
- Independent scaling
- Technology flexibility
- Clear separation of concerns

---

#### **4. What is JPA/Hibernate?**
**Answer:**
- **JPA (Java Persistence API)**: Specification for object-relational mapping
- **Hibernate**: Implementation of JPA
- **Purpose**: Maps Java objects to database tables automatically
- **Benefits**: No manual SQL required for basic operations

---

#### **5. What is Spring Boot?**
**Answer:**
Spring Boot is a framework that simplifies Spring application development:
- **Auto-configuration**: Automatically configures components
- **Embedded server**: No need for external Tomcat
- **Starter dependencies**: Pre-configured dependency sets
- **Production-ready**: Health checks, metrics, etc.

---

#### **6. What is Next.js?**
**Answer:**
Next.js is a React framework with:
- **Server-side rendering (SSR)**: Renders on server for better SEO
- **Static site generation (SSG)**: Pre-renders at build time
- **File-based routing**: `app/page.tsx` → `/` route
- **API routes**: Backend functions in same project

---

#### **7. Why TypeScript?**
**Answer:**
TypeScript adds static typing to JavaScript:
- **Type safety**: Catch errors at compile time
- **Better tooling**: IDE autocomplete and refactoring
- **Self-documenting**: Types serve as documentation
- **Scalability**: Easier to maintain large codebases

---

#### **8. What is Dependency Injection?**
**Answer:**
Dependency Injection (DI) is a design pattern where objects receive dependencies from external sources rather than creating them:

```java
@Service
public class BookService {
    @Autowired                    // DI: Spring injects repository
    private BookRepository bookRepository;
}
```

**Benefits:**
- Loose coupling
- Easier testing (mock dependencies)
- Better code reusability

---

#### **9. What is ORM?**
**Answer:**
Object-Relational Mapping (ORM) bridges object-oriented programming and relational databases:
- Java objects ↔ Database tables
- Class fields ↔ Table columns
- Object instances ↔ Table rows

**Example:**
```java
@Entity
public class Book {          // Class → Table
    @Id
    private Long id;         // Field → Column
}
```

---

#### **10. What is CORS and why needed?**
**Answer:**
CORS (Cross-Origin Resource Sharing) is a security feature:
- **Problem**: Browsers block requests from different origins
- **Example**: Frontend (port 3000) calling backend (port 8080)
- **Solution**: Backend explicitly allows frontend origin
- **Implementation**: CorsConfig class in Spring Boot

---

### 12.2 Common Viva Questions & Answers

#### **Q1: Walk me through the flow when a user creates a book.**
**Answer:**
1. User fills form in `BookForm` component
2. Form submission calls `createBook()` from `api.ts`
3. Sends POST request to `/create` with API key in header
4. `BookController` validates API key
5. Calls `BookService.createBook()`
6. Service calls `BookRepository.save()`
7. JPA/Hibernate generates SQL INSERT
8. PostgreSQL saves data and returns ID
9. Response sent back to frontend
10. User redirected to home page showing new book

---

#### **Q2: What happens if you don't provide an API key for create operation?**
**Answer:**
The `BookController` checks the `X-API-Key` header:
```java
if (!isValidApiKey(apiKey, createApiKey)) {
    return new ResponseEntity<>("Invalid or missing API key", 
                                 HttpStatus.UNAUTHORIZED);
}
```
Returns `401 Unauthorized` status with error message.

---

#### **Q3: How does JPA know which table and columns to use?**
**Answer:**
Through annotations:
- `@Entity`: Marks class as database entity
- `@Table(name = "books")`: Specifies table name
- `@Column`: Configures column properties
- Default: Class name → table name, field name → column name

---

#### **Q4: Why do you use DTOs (Data Transfer Objects)?**
**Answer:**
In this simple project, we directly use the `Book` entity. In larger applications, DTOs:
- Separate internal structure from API contract
- Prevent exposing sensitive data
- Allow different representations for different endpoints
- Facilitate versioning

---

#### **Q5: What is the difference between PUT and PATCH?**
**Answer:**
- **PUT**: Replace entire resource (send all fields)
- **PATCH**: Update partial resource (send only changed fields)

This project uses PUT - all fields must be provided.

---

#### **Q6: How does Next.js routing work?**
**Answer:**
File-based routing:
- `app/page.tsx` → `/`
- `app/create/page.tsx` → `/create`
- `app/update/[id]/page.tsx` → `/update/1`, `/update/2`, etc.

Square brackets `[id]` indicate dynamic segments.

---

#### **Q7: What is the difference between Server and Client Components?**
**Answer:**
**Server Components** (default in Next.js App Router):
- Run on server
- Can directly access databases/APIs
- No JavaScript sent to client
- Cannot use hooks or event handlers

**Client Components** (`"use client"`):
- Run in browser
- Can use React hooks
- Interactive (onClick, onChange, etc.)
- Send JavaScript to client

---

#### **Q8: How do you handle errors in the API?**
**Answer:**
Multiple levels:
1. **Frontend**: Try-catch blocks, display error messages
2. **Backend**: Exception handling with HTTP status codes
3. **Service Layer**: Throws `RuntimeException` if book not found
4. **Controller**: Catches exceptions and returns appropriate status

---

#### **Q9: What is the purpose of Lombok?**
**Answer:**
Lombok reduces boilerplate code:
- `@Data`: Generates getters, setters, toString, equals, hashCode
- `@NoArgsConstructor`: Generates no-argument constructor
- `@AllArgsConstructor`: Generates constructor with all fields

**Without Lombok:**
```java
public class Book {
    private Long id;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ... repeat for all fields
}
```

**With Lombok:**
```java
@Data
public class Book {
    private Long id;
    // Getters/setters auto-generated
}
```

---

#### **Q10: How would you improve this application?**
**Answer:**
Possible improvements:
1. **Authentication**: User login system (JWT)
2. **Validation**: More robust input validation
3. **Pagination**: Handle large datasets
4. **Search**: Full-text search functionality
5. **Testing**: Unit tests, integration tests
6. **Caching**: Redis for frequently accessed data
7. **Logging**: Structured logging (ELK stack)
8. **Docker**: Containerize application
9. **CI/CD**: Automated deployment pipeline
10. **Error Handling**: Global exception handler

---

### 12.3 Technical Terms to Know

| Term | Explanation |
|------|-------------|
| **API** | Application Programming Interface - how software communicates |
| **REST** | Representational State Transfer - API architectural style |
| **JSON** | JavaScript Object Notation - data format |
| **HTTP** | HyperText Transfer Protocol - web communication protocol |
| **ORM** | Object-Relational Mapping - maps objects to database |
| **JPA** | Java Persistence API - Java ORM specification |
| **JDBC** | Java Database Connectivity - low-level database API |
| **Spring Boot** | Java framework for web applications |
| **Maven** | Build automation and dependency management |
| **React** | JavaScript library for building UIs |
| **TypeScript** | Typed superset of JavaScript |
| **Next.js** | React framework with SSR |
| **SSR** | Server-Side Rendering |
| **CRUD** | Create, Read, Update, Delete |
| **DTO** | Data Transfer Object |
| **IoC** | Inversion of Control |
| **DI** | Dependency Injection |
| **CORS** | Cross-Origin Resource Sharing |

---

### 12.4 Design Patterns Used

1. **MVC Pattern** (Model-View-Controller)
   - Model: Entity classes
   - View: React components
   - Controller: Spring controllers

2. **Repository Pattern**
   - Abstracts data access
   - `BookRepository` interface

3. **Service Layer Pattern**
   - Business logic separation
   - `BookService` class

4. **Dependency Injection**
   - `@Autowired` annotation
   - Spring container manages objects

5. **REST Architectural Pattern**
   - Stateless API
   - Resource-based URLs

---

### 12.5 Best Practices Followed

✅ **Backend:**
- Layered architecture
- Separation of concerns
- Dependency injection
- RESTful API design
- Proper HTTP status codes
- Exception handling

✅ **Frontend:**
- Component reusability
- Type safety (TypeScript)
- Client/server separation
- Error handling
- Loading states
- Responsive design

✅ **Database:**
- Proper indexing (primary key)
- NOT NULL constraints
- Appropriate data types
- Auto-increment ID

---

## 13. Troubleshooting Common Issues

### Issue 1: Backend won't start - "Port 8080 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8080
kill -9 <PID>
```

---

### Issue 2: Frontend can't connect to backend
**Check:**
1. Backend is running on port 8080
2. CORS is configured correctly
3. API URL is correct in `api.ts`
4. No firewall blocking requests

---

### Issue 3: Database connection failed
**Check:**
1. PostgreSQL is running
2. Database `bookdb` exists
3. Credentials in `application.properties` are correct
4. Port 5432 is accessible

---

### Issue 4: "API key invalid" error
**Solution:**
Ensure API key in frontend matches backend:
- Frontend: `api.ts` - `CREATE_API_KEY`
- Backend: `application.properties` - `api.key.create`

---

## 14. Summary

### Project Highlights
✅ Full-stack application with separate frontend and backend
✅ RESTful API design
✅ Database integration with PostgreSQL
✅ Modern UI with React and Next.js
✅ Type-safe development with TypeScript
✅ API key authentication
✅ Responsive design
✅ Error handling
✅ Clean code architecture

### Technologies Demonstrated
- **Backend**: Spring Boot, JPA, Hibernate, PostgreSQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Architecture**: Three-tier, MVC, REST
- **Tools**: Maven, npm, Git

### Learning Outcomes
You can demonstrate:
1. Full-stack development skills
2. RESTful API design and implementation
3. Database design and ORM usage
4. Modern frontend development
5. Security basics (API keys, CORS)
6. Error handling and validation
7. Code organization and architecture

---

## 15. Quick Reference

### Backend Startup
```bash
cd backend
mvnw spring-boot:run
```

### Frontend Startup
```bash
cd frontend
npm install
npm run dev
```

### Database Connection
```
URL: jdbc:postgresql://localhost:5432/bookdb
Username: postgres
Password: [your-password]
```

### API Base URL
```
http://localhost:8080
```

### Frontend URL
```
http://localhost:3000
```

---

**Good luck with your viva! 🎓**

**Tips for Viva:**
1. ✅ Understand the flow of data through the application
2. ✅ Be ready to explain any piece of code
3. ✅ Know the purpose of each technology used
4. ✅ Understand REST principles
5. ✅ Be prepared to suggest improvements
6. ✅ Practice explaining technical concepts simply
7. ✅ Review this documentation before viva

