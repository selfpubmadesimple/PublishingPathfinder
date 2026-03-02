# Contributing to Publishing Path Finder

## Development Workflow

### Pre-Flight Process (MANDATORY)

Before implementing any feature or change:

1. **Summarize Request**
   - Clearly state what you're building
   - Explain the business value and user impact
   - Define success criteria

2. **Impact Assessment**
   - List affected modules and files
   - Identify API endpoints to test
   - Note database schema changes
   - Consider integration points (PDF, email, etc.)

3. **Get Approval**
   - Present summary and impact assessment
   - Wait for explicit confirmation before proceeding
   - Document any additional requirements or constraints

### Code Standards

#### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Prefer type safety over `any`
- Use Zod schemas for runtime validation

#### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1)
- Use shadcn/ui components when possible

#### API Development
- Use consistent error handling patterns
- Implement proper request validation
- Return appropriate HTTP status codes
- Log important operations and errors

#### Database Operations
- Use Drizzle ORM for type safety
- Never write raw SQL without proper escaping
- Implement proper error handling
- Test with realistic data volumes

### Testing Requirements

#### Unit Tests
- Test business logic in isolation
- Mock external dependencies
- Achieve >80% code coverage for core modules
- Use descriptive test names

#### Integration Tests
- Test complete API workflows
- Verify database operations
- Test PDF generation with various inputs
- Validate email collection and storage

#### Manual Testing
- Complete quiz flow with different user personas
- Test PDF download functionality
- Verify mobile responsiveness
- Check accessibility compliance

### Quality Gates

All contributions must pass:
- [ ] TypeScript compilation without errors
- [ ] ESLint checks with no violations
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing checklist completed
- [ ] Code review approved
- [ ] Documentation updated

### Deployment Process

1. **Pre-Deployment**
   - Run full test suite
   - Build production bundle
   - Verify no console errors
   - Test with production-like data

2. **Deployment**
   - Use Replit deployment system
   - Monitor deployment logs
   - Verify SSL certificate validity
   - Check database connectivity

3. **Post-Deployment**
   - Conduct smoke tests on live environment
   - Verify PDF generation works
   - Test quiz submission flow
   - Monitor error rates and performance

### Emergency Procedures

#### Critical Bug Response
1. Assess user impact immediately
2. Implement hotfix if possible
3. Deploy emergency patch
4. Document incident for post-mortem

#### Rollback Process
1. Use Replit deployment rollback feature
2. Verify previous version functionality
3. Investigate root cause
4. Plan proper fix implementation

### Communication

#### Code Reviews
- Provide constructive feedback
- Focus on maintainability and user impact
- Verify test coverage and quality
- Check documentation completeness

#### Issue Reporting
- Use clear, descriptive titles
- Include reproduction steps
- Provide browser/environment details
- Attach relevant error logs or screenshots

### Security Considerations

- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines
- Regular dependency updates

### Performance Guidelines

- Optimize PDF generation for speed
- Minimize database queries
- Use appropriate caching strategies
- Monitor and optimize bundle size
- Test with slow network conditions

## Getting Help

- Review existing documentation first
- Check recent changes in replit.md
- Test with provided sample data
- Reach out for clarification before assumptions