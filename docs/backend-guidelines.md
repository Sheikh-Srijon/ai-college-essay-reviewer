# Backend Guidelines

## Overview

This document outlines the backend architecture and data structures for the AI College Essay Reviewer application. The system is designed to separate concerns between data storage and client-side processing, ensuring scalability and maintainability.

## Core Architecture Principles

### 1. **Separation of Concerns**

- **Backend**: Stores raw data without positioning or UI logic
- **Frontend**: Handles all positioning, highlighting, and user interaction logic
- **Database**: Pure data storage, no business logic

### 2. **Data Flow**

```
Database → Backend API → Frontend → Position Manager → Editor
```

## Data Structures

### Essay Interface

```typescript
export interface Essay {
  id: string; // Unique identifier
  text: string; // Markdown source content
  version: number; // Incremented with each change
}
```

### Raw Suggestion Interface

```typescript
export interface RawSuggestion {
  id: string; // Unique identifier
  originalText: string; // Text to be replaced
  editedText: string; // Suggested replacement
  note?: string; // Optional explanation/comment
}
```

**Important**: Raw suggestions contain NO positioning information. The frontend computes all positions dynamically.

## API Endpoints

### Essays

```
GET /api/essays                    # List all essays
GET /api/essays/:id               # Get specific essay
POST /api/essays                  # Create new essay
PUT /api/essays/:id               # Update essay
DELETE /api/essays/:id            # Delete essay
```

### Suggestions

```
GET /api/essays/:id/suggestions   # Get suggestions for essay
POST /api/essays/:id/suggestions  # Add new suggestion
PUT /api/suggestions/:id          # Update suggestion
DELETE /api/suggestions/:id       # Delete suggestion
```

## Database Schema

### Essays Table

```sql
CREATE TABLE essays (
  id VARCHAR(255) PRIMARY KEY,
  text TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Suggestions Table

```sql
CREATE TABLE suggestions (
  id VARCHAR(255) PRIMARY KEY,
  essay_id VARCHAR(255) NOT NULL,
  original_text TEXT NOT NULL,
  edited_text TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (essay_id) REFERENCES essays(id) ON DELETE CASCADE
);
```

## Data Processing Guidelines

### 1. **No Position Storage**

- ❌ **Don't store**: `start`, `end`, `stickiness`, `status`
- ✅ **Do store**: `originalText`, `editedText`, `note`

### 2. **Text Validation**

- Ensure `originalText` exists in the essay
- Validate text length limits
- Sanitize HTML/markdown if needed

### 3. **Suggestion Quality**

- `originalText` should be exact match in essay
- `editedText` should be meaningful improvement
- `note` should explain the reasoning

## API Response Examples

### Get Essay with Suggestions

```json
{
  "essay": {
    "id": "adv-001",
    "text": "# Mock Essay (Advanced)\n\nI've encountered challenges...",
    "version": 1
  },
  "suggestions": [
    {
      "id": "a1",
      "originalText": "I've encountered challenges in grasping the world of olympiads...",
      "editedText": "I struggled to navigate Olympiads and extracurriculars...",
      "note": "Capitalizes 'Olympiads,' tightens phrasing, stronger hook."
    }
  ]
}
```

### Create Suggestion

```json
{
  "id": "a1",
  "originalText": "text to replace",
  "editedText": "replacement text",
  "note": "Explanation of the change"
}
```

## Error Handling

### Common Error Responses

```json
{
  "error": "VALIDATION_ERROR",
  "message": "originalText not found in essay",
  "details": {
    "field": "originalText",
    "value": "missing text"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Performance Considerations

### 1. **Text Search Optimization**

- Use full-text search for finding `originalText` in essays
- Consider indexing for large essays
- Implement pagination for many suggestions

### 2. **Caching Strategy**

- Cache essay content (rarely changes)
- Cache suggestion metadata
- Invalidate cache when suggestions change

### 3. **Database Indexing**

```sql
-- Index for fast essay lookups
CREATE INDEX idx_essays_id ON essays(id);

-- Index for suggestion lookups
CREATE INDEX idx_suggestions_essay_id ON suggestions(essay_id);

-- Full-text search index
CREATE FULLTEXT INDEX idx_essays_text ON essays(text);
```

## Security Guidelines

### 1. **Input Validation**

- Sanitize all text inputs
- Validate text length limits
- Check for malicious content

### 2. **Access Control**

- Implement user authentication
- Role-based access control
- Essay ownership validation

### 3. **Rate Limiting**

- Limit suggestion creation
- Prevent spam submissions
- API usage quotas

## Testing Guidelines

### 1. **Unit Tests**

- Test data validation
- Test database operations
- Test API endpoints

### 2. **Integration Tests**

- Test full API workflows
- Test database interactions
- Test error scenarios

### 3. **Performance Tests**

- Load testing with large essays
- Stress testing with many suggestions
- Database query optimization

## Deployment Considerations

### 1. **Environment Variables**

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
API_RATE_LIMIT=100
MAX_ESSAY_LENGTH=10000
MAX_SUGGESTION_LENGTH=1000
```

### 2. **Health Checks**

- Database connectivity
- API responsiveness
- Memory usage monitoring

### 3. **Logging**

- API request/response logging
- Error logging with context
- Performance metrics

## Migration Strategy

### 1. **Schema Changes**

- Use database migrations
- Maintain backward compatibility
- Test with existing data

### 2. **API Versioning**

- Version API endpoints
- Deprecation notices
- Gradual rollout

## Future Considerations

### 1. **Scalability**

- Microservices architecture
- Database sharding
- CDN for static content

### 2. **AI Integration**

- Suggestion generation
- Quality scoring
- Learning from user feedback

### 3. **Analytics**

- Usage metrics
- Suggestion effectiveness
- User behavior tracking

---

**Remember**: The backend should be a simple, reliable data store. All complex logic (positioning, highlighting, user interactions) belongs in the frontend. This separation ensures the backend can scale independently and remain focused on its core responsibility: data persistence.
