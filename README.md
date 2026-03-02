# Publishing Path Finder - Interactive Quiz Application

An interactive quiz application that helps authors discover their personalized publishing path while avoiding predatory publishers and connecting them with qualified professional services.

## 🚀 Pre-Flight Feature Checklist

**IMPORTANT**: Before implementing any new feature or making changes, follow this checklist:

### 1. Summarize the Request
> "I'm adding `<feature>` to do `<X, Y, Z>`."

Clearly restate what you're building and why.

### 2. Verify Impact
Before proceeding, identify and list:
- **Modules to test**: Which files/components will be affected
- **Endpoints to verify**: Which API routes need testing
- **Integration points**: Database, PDF generation, email collection
- **Regression tests**: What existing functionality might break

Example:
- I will run tests on these modules: `quiz-interface`, `pdf-service`, `storage`
- I will verify these endpoints: `/api/quiz/questions`, `/api/quiz/results`, `/api/quiz/report`
- I will test: PDF generation, database connectivity, form validation

### 3. Request Confirmation
> "Please confirm I've captured everything before I proceed."

**Only after receiving ✅ approval should you begin implementation.**

## 🛠️ Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run all tests
npm run lint         # Run linting
npm run type-check   # TypeScript validation
```

### Testing Requirements
- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: API endpoints and database operations
- **End-to-End Tests**: Complete quiz flow and PDF generation
- **Manual Testing**: User experience and accessibility

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier for consistent formatting
- Pre-commit hooks for quality gates

## 📋 Testing Checklist

Before any deployment or major change:

- [ ] All unit tests pass
- [ ] Integration tests verify API functionality
- [ ] PDF generation works with sample data
- [ ] Database operations complete successfully
- [ ] Form validation handles edge cases
- [ ] No TypeScript errors
- [ ] No linting violations
- [ ] Manual quiz flow test completed

## 🏗️ Architecture

### Frontend (React + TypeScript)
- `/client/src/components/` - UI components
- `/client/src/pages/` - Route components
- `/client/src/hooks/` - Custom hooks
- `/client/src/lib/` - Utilities and configurations

### Backend (Express + TypeScript)
- `/server/index.ts` - Main server entry
- `/server/routes.ts` - API route definitions
- `/server/storage.ts` - Data layer interface
- `/server/pdf-service.ts` - PDF generation service

### Shared
- `/shared/schema.ts` - Type definitions and validation schemas

## 🚀 Deployment

1. Run pre-flight checklist
2. Execute `npm run build`
3. Verify build success
4. Deploy via Replit deployment
5. Conduct post-deployment smoke tests

## 📝 Contributing

1. Follow the Pre-Flight Checklist for all changes
2. Write tests for new functionality
3. Update documentation for significant changes
4. Ensure all quality gates pass before requesting review

## 🎯 Key Features

- Interactive quiz with 14+ comprehensive questions
- Personalized publishing path recommendations
- PDF report generation with detailed cost breakdowns
- Lead capture with email collection
- Scam protection warnings and guidance
- Professional consultation scheduling integration

## 📞 Support

For questions about this project or publishing guidance:
- Consultation booking: https://aprilcox.com/consult
- Email support available through the application