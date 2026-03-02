# Manual Testing Checklist

## Pre-Deployment Manual Tests

### Quiz Flow Testing
- [ ] Landing page loads properly
- [ ] Welcome screen displays correct messaging
- [ ] Email collection form validates properly
- [ ] First name field is required
- [ ] Last name field is required
- [ ] Email format validation works
- [ ] Progress bar shows correct percentage
- [ ] All 14+ questions display properly
- [ ] "Why we ask this" explanations are helpful
- [ ] Multiple choice selections work
- [ ] Text area inputs accept content
- [ ] Navigation between questions works
- [ ] Final submission processes successfully

### PDF Generation Testing
- [ ] PDF generates without errors
- [ ] Contains personalized recommendations
- [ ] Includes user's name correctly (firstName + lastName)
- [ ] Shows correct publishing path based on answers
- [ ] Cost estimates appear reasonable
- [ ] Next steps are in correct sequence:
  - [ ] Manuscript Evaluation
  - [ ] Cover Design
  - [ ] Interior Formatting
  - [ ] Done-For-You Publishing Package
  - [ ] Marketing Support
- [ ] Free resources section included
- [ ] Consultation link present
- [ ] PDF downloads successfully

### Database Testing
- [ ] Quiz submissions save to database
- [ ] Email addresses stored correctly
- [ ] First/last names stored separately
- [ ] Session IDs generated properly
- [ ] No duplicate submissions with same session
- [ ] Quiz answers stored as JSON
- [ ] Recommended path calculated correctly

### User Experience Testing
- [ ] Mobile responsive design works
- [ ] Tablet view is usable
- [ ] Desktop layout is professional
- [ ] Loading states appear during API calls
- [ ] Error messages are user-friendly
- [ ] Success messages confirm actions
- [ ] Color scheme matches branding (#744969)
- [ ] Typography is readable for 50+ audience

### Content Accuracy Testing
- [ ] Publishing personas match quiz answers
- [ ] Cost estimates reflect current market rates
- [ ] Scam warnings are legally appropriate
- [ ] No specific company names in warnings
- [ ] Professional tone throughout
- [ ] Encouraging language for target demographic

### Security Testing
- [ ] No API keys visible in frontend code
- [ ] Database credentials properly secured
- [ ] Session management works correctly
- [ ] No XSS vulnerabilities in form inputs
- [ ] HTTPS enforced in production

### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] PDF generation completes within 10 seconds
- [ ] Large quiz submissions process quickly
- [ ] No memory leaks during extended use
- [ ] Bundle size reasonable for target audience

### Integration Testing
- [ ] Email collection integrates with backend
- [ ] PDF service connects to database
- [ ] All API endpoints respond correctly
- [ ] Error handling covers edge cases
- [ ] Consultation booking link works
- [ ] External links open properly

## Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG guidelines
- [ ] Alt text for images
- [ ] Form labels properly associated
- [ ] Focus indicators visible

## Team Testing Checklist
- [ ] Marketing team reviews messaging
- [ ] Content team verifies accuracy
- [ ] Sales team tests lead capture flow
- [ ] Technical team validates functionality
- [ ] Target audience representatives test UX

## Production Deployment Verification
- [ ] SSL certificate active
- [ ] Custom domain (if configured) works
- [ ] Database connectivity confirmed
- [ ] Environment variables set correctly
- [ ] Error monitoring configured
- [ ] Backup procedures in place