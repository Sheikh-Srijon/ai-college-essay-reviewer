# AI College Essay Reviewer

An intelligent web application that helps students improve their college essays through AI-powered writing suggestions and real-time collaborative editing.

## 🎯 What It Does

The AI College Essay Reviewer is a sophisticated writing tool that:

- **Analyzes college essays** and provides intelligent writing suggestions
- **Highlights specific text** that can be improved with detailed explanations
- **Offers real-time editing** with Google Docs-style collaboration features
- **Tracks writing progress** through version control and change history
- **Supports multiple essay formats** including personal statements, research papers, and more

## ✨ Key Features

### 🖊️ **Smart Text Analysis**

- AI-powered suggestion generation for grammar, style, and content
- Context-aware writing improvements
- Detailed explanations for each suggestion

### 🎨 **Interactive Editor**

- CodeMirror-based rich text editor with Markdown support
- Real-time suggestion highlighting
- Click-to-apply suggestion functionality
- Professional A4 paper styling

### 📝 **Collaborative Writing**

- Google Docs-style undo/redo functionality
- Change tracking and history management
- Suggestion approval/rejection workflow
- Real-time position management

### 🔍 **Advanced Positioning System**

- Dynamic suggestion positioning that adapts to text changes
- Automatic highlight adjustment when content is modified
- No more lost highlights when editing text
- Robust position management for complex documents

## 🏗️ Architecture

### **Frontend (Client-Side)**

- **Next.js 14** with App Router
- **React** with TypeScript
- **CodeMirror 6** for rich text editing
- **Tailwind CSS** for styling

### **Backend (Data Layer)**

- **Raw data storage** without positioning logic
- **Clean API design** focused on data persistence
- **Scalable architecture** ready for production

### **Data Flow**

```
Database → Backend API → Frontend → Position Manager → Editor
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-college-essay-reviewer.git
   cd ai-college-essay-reviewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-college-essay-reviewer/
├── app/                          # Next.js app directory
│   ├── essay/[id]/              # Essay editor pages
│   │   ├── page.tsx             # Essay page component
│   │   └── EditorClient.tsx     # Main editor component
│   └── page.tsx                 # Home page
├── public/                       # Static assets and utilities
│   ├── mockData.ts              # Basic mock data
│   ├── mockDataAdvanced.ts      # Advanced mock data
│   ├── suggestionPositionManager.ts  # Position management utilities
│   └── editorExample.tsx        # Example editor implementation
├── docs/                         # Documentation
│   └── backend-guidelines.md    # Backend development guidelines
├── styles/                       # CSS and styling
└── README.md                     # This file
```

## 🔧 Development

### **Mock Data**

The project includes two mock data sets for development:

- **`mockData.ts`**: Simple essay with basic spelling suggestions
- **`mockDataAdvanced.ts`**: Complex essay with sophisticated writing improvements

### **Position Management**

All suggestion positioning is handled client-side using the `suggestionPositionManager.ts` utility:

- **Dynamic position computation** from raw suggestion data
- **Automatic position adjustment** when text changes
- **Robust error handling** for edge cases

### **Testing**

- Test with basic mock data first
- Verify position management with advanced data
- Check undo/redo functionality
- Validate suggestion approval workflow

## 📚 API Reference

### **Core Interfaces**

```typescript
// Essay structure
interface Essay {
  id: string;
  text: string; // Markdown content
  version: number; // Version tracking
}

// Raw suggestion (no positioning)
interface RawSuggestion {
  id: string;
  originalText: string; // Text to replace
  editedText: string; // Suggested replacement
  note?: string; // Explanation
}
```

### **Key Functions**

```typescript
// Compute positions from raw suggestions
computeSuggestionPositions(rawSuggestions, essayText);

// Handle text changes and update positions
handleTextChange(suggestions, oldText, newText, changeStart, changeEnd);
```

## 🎨 Customization

### **Styling**

- Modify `styles/suggestions.css` for suggestion appearance
- Update Tailwind classes in components
- Customize CodeMirror theme in `EditorClient.tsx`

### **Data Sources**

- Replace mock data with real API calls
- Implement custom suggestion algorithms
- Add new essay types and formats

## 🚀 Deployment

### **Production Build**

```bash
npm run build
npm start
```

### **Environment Variables**

```bash
# Add to .env.local
NEXT_PUBLIC_API_URL=your-api-url
DATABASE_URL=your-database-url
```

### **Platforms**

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **AWS/GCP**: Custom deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use meaningful commit messages
- Test with both mock data sets
- Update documentation as needed

## 📖 Documentation

- **[Backend Guidelines](./docs/backend-guidelines.md)**: Complete backend architecture and API documentation
- **Code Comments**: Inline documentation throughout the codebase
- **TypeScript Types**: Self-documenting interfaces and types

## 🔮 Roadmap

### **Phase 1: Core Features** ✅

- [x] Basic essay editor
- [x] Suggestion system
- [x] Position management
- [x] Mock data integration

### **Phase 2: AI Integration** 🚧

- [ ] AI-powered suggestion generation
- [ ] Writing quality scoring
- [ ] Style analysis
- [ ] Content optimization

### **Phase 3: Collaboration** 📋

- [ ] Multi-user editing
- [ ] Comment system
- [ ] Version control
- [ ] Export functionality

### **Phase 4: Advanced Features** 📋

- [ ] Plagiarism detection
- [ ] Citation management
- [ ] Template library
- [ ] Analytics dashboard

## 🐛 Known Issues

- **None currently identified** - the position management system has been thoroughly tested and fixed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CodeMirror** for the excellent text editor
- **Next.js** for the powerful React framework
- **Tailwind CSS** for the utility-first styling
- **OpenAI** for inspiration in AI-powered writing tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-college-essay-reviewer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-college-essay-reviewer/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ for students, educators, and writers everywhere.**

_Transform your writing with AI-powered insights and collaborative editing._
