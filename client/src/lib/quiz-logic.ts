import { QuizAnswer, PublishingPath } from "@shared/schema";

export function calculateRecommendedPath(answers: QuizAnswer[], publishingPaths: PublishingPath[]): string {
  // Algorithm prioritizes done-for-you hybrid services over traditional publishing
  // Only recommends traditional when truly no budget or very specific circumstances
  const scores = {
    'self-publishing': 0,
    'hybrid-publishing': 0,
    'traditional-publishing': 0
  };

  answers.forEach(answer => {
    const value = typeof answer.value === 'string' ? answer.value : answer.value[0];
    
    switch (answer.questionId) {
      case "1": // Book type
        if (value === "fiction" || value === "childrens") {
          scores['traditional-publishing'] += 2;
          scores['hybrid-publishing'] += 1;
        } else if (value === "nonfiction") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 2;
        }
        break;
      
      case "2": // Primary goal
        if (value === "income") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 1;
        } else if (value === "credibility") {
          scores['traditional-publishing'] += 3;
          scores['hybrid-publishing'] += 2;
        }
        break;
      
      case "3": // Control preference
        if (value === "full") {
          scores['self-publishing'] += 3;
        } else if (value === "collaborative") {
          scores['hybrid-publishing'] += 3;
        } else if (value === "minimal") {
          scores['traditional-publishing'] += 3;
        }
        break;
      
      case "4": // Budget - Prioritize hybrid done-for-you service
        if (value === "none") {
          scores['traditional-publishing'] += 3;
        } else if (value === "low") {
          scores['hybrid-publishing'] += 2; // Done-for-you can work with payment plans
          scores['self-publishing'] += 2;
        } else if (value === "medium") {
          scores['hybrid-publishing'] += 4; // Perfect for done-for-you service
          scores['self-publishing'] += 1;
        } else if (value === "high") {
          scores['hybrid-publishing'] += 3; // Still great for done-for-you
          scores['self-publishing'] += 2;
        }
        break;
      
      case "5": // Marketing comfort
        if (value === "love") {
          scores['self-publishing'] += 3;
        } else if (value === "learning") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 1;
        } else if (value === "dislike") {
          scores['traditional-publishing'] += 3;
        }
        break;
      
      case "6": // Timeline
        if (value === "asap") {
          scores['self-publishing'] += 3;
        } else if (value === "moderate") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 1;
        } else if (value === "patient") {
          scores['traditional-publishing'] += 2;
        }
        break;
      
      case "7": // Target audience
        if (value === "niche") {
          scores['self-publishing'] += 2;
        } else if (value === "national" || value === "global") {
          scores['traditional-publishing'] += 2;
          scores['hybrid-publishing'] += 1;
        }
        break;
      
      case "8": // Current phase
        if (value === "writing") {
          scores['hybrid-publishing'] += 3; // Perfect for guidance through the process
        } else if (value === "editing") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 2;
        } else if (value === "illustration") {
          scores['hybrid-publishing'] += 3; // Professional design guidance crucial
          scores['self-publishing'] += 1;
        } else if (value === "design-formatting") {
          scores['hybrid-publishing'] += 2; // Still benefits from professional guidance
          scores['self-publishing'] += 2;
        } else if (value === "publishing-launch") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 2; // Equal - depends on other factors
        }
        break;
      
      case "9": // Word count - Updated for children's books
        if (value === "under-2k") {
          scores['hybrid-publishing'] += 3; // Perfect for done-for-you children's books
          scores['self-publishing'] += 1;
        } else if (value === "2k-10k") {
          scores['hybrid-publishing'] += 3; // Great for illustrated books and guides
          scores['self-publishing'] += 2;
        } else if (value === "10k-30k" || value === "30k-60k") {
          scores['hybrid-publishing'] += 3; // Ideal range for done-for-you service
          scores['self-publishing'] += 1;
        } else if (value === "60k-90k" || value === "90k-120k") {
          scores['hybrid-publishing'] += 2; // Still good for done-for-you
          scores['self-publishing'] += 2;
          scores['traditional-publishing'] += 1;
        } else if (value === "over-120k") {
          scores['hybrid-publishing'] += 1; // Longer books can still work
          scores['traditional-publishing'] += 2;
        }
        break;
      
      case "10": // Technical comfort - Done-for-you handles tech aspects
        if (value === "tech-savvy") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 1; // Still can benefit from done-for-you
        } else if (value === "moderate") {
          scores['hybrid-publishing'] += 4; // Perfect for done-for-you service
          scores['self-publishing'] += 1;
        } else if (value === "hands-off") {
          scores['hybrid-publishing'] += 3; // Done-for-you is perfect for this
          scores['traditional-publishing'] += 2;
        }
        break;
      
      case "11": // Time commitment - Done-for-you works for any time availability
        if (value === "under-2") {
          scores['hybrid-publishing'] += 4; // Done-for-you is perfect for limited time
          scores['traditional-publishing'] += 1;
        } else if (value === "2-4") {
          scores['hybrid-publishing'] += 4; // Still great for done-for-you
        } else if (value === "over-4") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 2; // Can still benefit from professional help
        }
        break;
      
      case "13": // Existing platform
        if (value === "large") {
          scores['self-publishing'] += 3;
        } else if (value === "moderate") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 1;
        } else if (value === "none") {
          scores['traditional-publishing'] += 2;
        }
        break;
      
      case "15": // Social media followers
        if (value === "none" || value === "small") {
          scores['hybrid-publishing'] += 3; // Need professional marketing help
          scores['traditional-publishing'] += 1;
        } else if (value === "moderate") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 2;
        } else if (value === "large" || value === "massive") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 1;
        }
        break;
      
      case "16": // Social media platforms (multiple choice)
        if (value === "none") {
          scores['hybrid-publishing'] += 3; // Need marketing guidance
          scores['traditional-publishing'] += 2;
        } else {
          // Active on social media favors self-publishing
          scores['self-publishing'] += 1;
          scores['hybrid-publishing'] += 1;
        }
        break;
      
      case "17": // Website
        if (value === "professional") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 1;
        } else if (value === "basic") {
          scores['hybrid-publishing'] += 2; // Can help improve website
          scores['self-publishing'] += 1;
        } else if (value === "none-planning") {
          scores['hybrid-publishing'] += 3; // Perfect for done-for-you website setup
        } else if (value === "none-unsure") {
          scores['hybrid-publishing'] += 4; // Needs professional guidance
          scores['traditional-publishing'] += 1;
        }
        break;
      
      case "18": // Email subscribers
        if (value === "none" || value === "small") {
          scores['hybrid-publishing'] += 3; // Need help building audience
          scores['traditional-publishing'] += 1;
        } else if (value === "growing") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 1;
        } else if (value === "established" || value === "large") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 1;
        }
        break;
      
      case "19": // Personal network
        if (value === "very-small" || value === "small") {
          scores['hybrid-publishing'] += 3; // Need professional marketing support
          scores['traditional-publishing'] += 1;
        } else if (value === "moderate") {
          scores['hybrid-publishing'] += 2;
          scores['self-publishing'] += 1;
        } else if (value === "large" || value === "massive") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 1;
        }
        break;
      
      case "14": // Printing preferences
        if (value === "pod") {
          scores['self-publishing'] += 2;
          scores['hybrid-publishing'] += 3; // Great for done-for-you POD setup
        } else if (value === "bulk-small") {
          scores['hybrid-publishing'] += 3; // Perfect for professional guidance on small runs
          scores['self-publishing'] += 1;
        } else if (value === "bulk-medium" || value === "bulk-large") {
          scores['hybrid-publishing'] += 2; // Professional help valuable for large print runs
          scores['traditional-publishing'] += 1;
        } else if (value === "unsure") {
          scores['hybrid-publishing'] += 4; // Perfect candidate for professional guidance
        }
        break;
      
      case "17b": // Website URL - doesn't affect scoring directly
        break;
      
      case "18b": // Email frequency
        if (value === "this-week" || value === "this-month") {
          scores['self-publishing'] += 2; // Active email marketers can handle more
          scores['hybrid-publishing'] += 1;
        } else if (value === "few-months") {
          scores['hybrid-publishing'] += 2; // Need help re-engaging audience
        } else if (value === "long-time" || value === "never") {
          scores['hybrid-publishing'] += 3; // Need professional help with email marketing
        }
        break;
      
      case "20": // Learning style
        if (value === "independent") {
          scores['self-publishing'] += 3;
          scores['hybrid-publishing'] += 1; // Still benefits from professional network
        } else if (value === "group") {
          scores['hybrid-publishing'] += 2; // Good for community-based coaching
          scores['self-publishing'] += 2;
        } else if (value === "hands-off") {
          scores['hybrid-publishing'] += 4; // Perfect for done-for-you service
          scores['traditional-publishing'] += 2;
        }
        break;
      
      case "21b": // Other concerns - doesn't affect scoring directly
        break;
    }
  });

  // Return the path with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const recommendedPath = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
  
  return recommendedPath || 'hybrid-publishing';
}

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
