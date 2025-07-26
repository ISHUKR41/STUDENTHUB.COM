import { storage } from "./storage";
import { newsArticles } from "../shared/schema";

const seedNewsData = [
  {
    title: "UPSC Civil Services Notification 2025 Released",
    subtitle: "Apply before February 11, 2025 for 979 vacancies",
    summary: "Union Public Service Commission announces Civil Services Examination 2025 with 979 vacancies for IAS, IPS, IFS and other services. Application process starts from January 22 and closes on February 11, 2025.",
    fullContent: `UPSC has released the official notification for Civil Services Examination 2025 on January 22, 2025. The application process starts from January 22 and closes on February 11, 2025. The preliminary examination is scheduled for May 25, 2025, followed by mains on August 22, 2025.

This year's notification includes 979 vacancies across various Group A and Group B services including Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and Indian Revenue Service (IRS). 

Candidates can apply online through upsc.gov.in. The age limit is 21-32 years for general category with relaxation for reserved categories. Educational qualification required is Bachelor's degree from a recognized university.

Key Dates:
- Application Start: January 22, 2025
- Application End: February 11, 2025
- Preliminary Exam: May 25, 2025
- Mains Exam: August 22, 2025

Eligibility Criteria:
- Age: 21-32 years (with relaxations)
- Education: Bachelor's degree
- Nationality: Indian citizen

Application fee is Rs. 100 for general/OBC candidates and nil for SC/ST/PwD/Women candidates.`,
    category: "Exam",
    tags: ["UPSC", "Civil Services", "IAS", "IPS", "Government Job"],
    author: "UPSC Team",
    readTime: 5,
    featured: true,
    priority: 1,
    images: [],
    sourceLink: "https://upsc.gov.in",
    status: "published",
    searchKeywords: ["UPSC", "Civil Services", "IAS", "IPS", "Examination", "Government", "Vacancy"],
    studentLevel: "college",
    examRelevance: ["UPSC CSE", "Civil Services"]
  },
  {
    title: "IIM Shortlist 2025 Released for MBA Admissions",
    subtitle: "WAT-PI rounds concluded, final admission offers sent",
    summary: "All 21 IIMs complete shortlisting process for MBA/PGP admission 2025-27 batch with WAT-PI rounds concluded. Highest cutoff percentiles at 94 for top IIMs.",
    fullContent: `IIM shortlists for the 2025-27 batch have been released by all Indian Institutes of Management following CAT 2024 results. The highest IIM cutoff percentiles required for top IIMs in 2025 are 94, with minimum cutoffs around 80.

Personal interviews were conducted between February-April 2025, and final admission offers were sent in May 2025. Notable shortlist dates include IIM Ahmedabad (January 8), IIM Bangalore (January 15), IIM Calcutta (January 7), and IIM Lucknow (January 6).

The selection process evaluates candidates on CAT score, academic performance, work experience, and diversity factors.

Top IIMs and their cutoffs:
- IIM Ahmedabad: 94+ percentile
- IIM Bangalore: 92+ percentile  
- IIM Calcutta: 90+ percentile
- IIM Delhi: 91+ percentile
- IIM Lucknow: 88+ percentile

Selection Criteria:
- CAT Score (50-60%)
- Academic Performance (20-25%)
- Work Experience (10-15%)
- Diversity Factors (5-10%)`,
    category: "Career",
    tags: ["IIM", "MBA", "CAT", "Management", "Higher Education"],
    author: "Career Desk",
    readTime: 4,
    featured: true,
    priority: 1,
    images: [],
    sourceLink: "https://iimcat.ac.in",
    status: "published",
    searchKeywords: ["IIM", "MBA", "CAT", "Management", "Admission", "Shortlist"],
    studentLevel: "college",
    examRelevance: ["CAT", "MBA Entrance"]
  },
  {
    title: "Delhi University B.Tech Admission Schedule 2025-26 Announced",
    subtitle: "First round allocation results on June 17, 2025",
    summary: "University of Delhi releases detailed admission schedule for B.Tech programs in Computer Science, Electronics, and Electrical Engineering with first round results on June 17.",
    fullContent: `Delhi University has announced the admission schedule for B.Tech programs (Computer Science & Engineering, Electronics & Communication, Electrical Engineering) for academic session 2025-26.

First round allocation results will be declared on June 17, 2025, at 5:00 PM. Candidates have until June 20 to accept allocated seats and June 22 to complete fee payment. The admission process includes three rounds with mid-entry windows.

Document verification and approval by departments will run parallel to the allocation process.

Important Dates:
- First Round Results: June 17, 2025 (5:00 PM)
- Seat Acceptance: Until June 20, 2025
- Fee Payment: Until June 22, 2025
- Second Round: June 25-30, 2025
- Third Round: July 5-10, 2025

Programs Available:
- Computer Science & Engineering
- Electronics & Communication Engineering
- Electrical Engineering

Admission is based on JEE Main scores and Delhi University entrance criteria. Candidates must have passed 12th with Physics, Chemistry, and Mathematics with minimum 60% marks.`,
    category: "Academic",
    tags: ["Delhi University", "B.Tech", "Engineering", "Admission", "Computer Science"],
    author: "DU Admissions",
    readTime: 3,
    featured: false,
    priority: 2,
    images: [],
    sourceLink: "https://du.ac.in",
    status: "published",
    searchKeywords: ["Delhi University", "DU", "B.Tech", "Engineering", "Computer Science", "Admission"],
    studentLevel: "school",
    examRelevance: ["JEE Main", "Engineering Entrance"]
  },
  {
    title: "India Wins 4 Medals at International Chemistry Olympiad 2025",
    subtitle: "2 Gold and 2 Silver medals, ranking 6th globally",
    summary: "Indian students secure 2 gold and 2 silver medals at 57th International Chemistry Olympiad in Dubai, ranking 6th globally with outstanding performance.",
    fullContent: `India achieved outstanding performance at the 57th International Chemistry Olympiad (IChO) held in Dubai, UAE, from July 5-14, 2025. Gold medals were won by Devesh Pankaj Bhaiya from Jalgaon, Maharashtra, and Sandeep Kuchi from Hyderabad, Telangana.

Silver medals went to Debadatta Priyadarshi from Bhubaneshwar, Odisha, and Ujjwal Kesari from New Delhi. The competition featured 354 students from 90 countries, and India ranked sixth in the overall medal tally.

This marks India's 26th participation in IChO. Students were selected through National Olympiad Examinations conducted by HBCSE, Mumbai, under TIFR. The team was mentored by Prof. Ankush Gupta (Head Mentor, HBCSE) and other experts.

Medal Winners:
🥇 Devesh Pankaj Bhaiya (Jalgaon, Maharashtra)
🥇 Sandeep Kuchi (Hyderabad, Telangana)
🥈 Debadatta Priyadarshi (Bhubaneshwar, Odisha)
🥈 Ujjwal Kesari (New Delhi)

Competition Stats:
- Participating Countries: 90
- Total Participants: 354
- India's Rank: 6th overall
- India's Medals: 4 (2 Gold, 2 Silver)

The International Chemistry Olympiad is the world's most prestigious chemistry competition for high school students, testing their knowledge in theoretical and practical chemistry.`,
    category: "Academic",
    tags: ["Chemistry Olympiad", "International Competition", "Gold Medal", "Science", "Achievement"],
    author: "Science Desk",
    readTime: 4,
    featured: true,
    priority: 1,
    images: [],
    sourceLink: "https://www.hbcse.tifr.res.in",
    status: "published",
    searchKeywords: ["Chemistry", "Olympiad", "International", "Gold Medal", "Science Competition", "India"],
    studentLevel: "school",
    examRelevance: ["Chemistry Olympiad", "Science Competitions"]
  },
  {
    title: "National Education Policy 2025 Updates Announced",
    subtitle: "Major changes in no detention policy and vocational education",
    summary: "NEP 2025 brings major changes including modified no detention policy, emphasis on vocational education, and digital learning initiatives with 5+3+3+4 structure.",
    fullContent: `The National Education Policy 2025 introduces significant reforms in India's education system. Key changes include modification of the No Detention Policy, allowing schools to evaluate students better and detain them after Class 5 or 8 if minimum learning standards aren't met despite extra support.

The policy emphasizes foundational stage learning (ages 3-8) through play-based and activity-based methods. Vocational education integration enables hands-on training in areas like gardening, pottery, carpentry, AI, coding, and cooking.

The 5+3+3+4 curricular structure replaces the traditional 10+2 system, with multilingual approach encouraging mother tongue education up to Grade 5.

Key Changes:
- Modified No Detention Policy
- 5+3+3+4 curricular structure
- Multilingual education approach
- Vocational education integration
- Digital learning initiatives
- Play-based foundational learning

New Structure:
- Foundational Stage (3-8 years): 5 years
- Preparatory Stage (8-11 years): 3 years  
- Middle Stage (11-14 years): 3 years
- Secondary Stage (14-18 years): 4 years

Vocational Skills:
- Traditional crafts (pottery, carpentry)
- Modern skills (AI, coding)
- Life skills (cooking, gardening)
- Digital literacy
- Critical thinking

Implementation will be gradual with pilot programs in select states before nationwide rollout.`,
    category: "Academic",
    tags: ["Education Policy", "NEP 2025", "Curriculum Reform", "Vocational Education", "Multilingual"],
    author: "Education Ministry",
    readTime: 6,
    featured: false,
    priority: 2,
    images: [],
    sourceLink: "https://www.education.gov.in",
    status: "published",
    searchKeywords: ["Education Policy", "NEP", "Curriculum", "Reform", "Vocational", "Multilingual"],
    studentLevel: "all",
    examRelevance: ["All Education Levels"]
  },
  {
    title: "Union Budget 2025 Boosts Digital Learning Initiatives",
    subtitle: "₹500 crore for AI in Education, 50,000 Atal Tinkering Labs",
    summary: "Finance Minister announces major digital education push including AI centers, broadband for rural schools, and 50,000 Atal Tinkering Labs with comprehensive budget allocation.",
    fullContent: `Union Budget 2025 introduces comprehensive digital learning initiatives for India's education sector. Key announcements include establishment of Centre of Excellence in AI for Education with ₹500 crore allocation, broadband connectivity for all government secondary schools through BharatNet.

The budget also announces Bharatiya Bhasha Pustak Scheme for digital textbooks in multiple Indian languages, 50,000 new Atal Tinkering Labs in government schools over five years, and five National Centres of Excellence for Skilling in partnership with global institutions.

Additional infrastructure will be built in IITs, with student strength having doubled to 1.35 lakh in the past decade. The budget also includes 10,000 new medical seats.

Major Allocations:
- AI in Education Centre: ₹500 crore
- Atal Tinkering Labs: 50,000 new labs
- Medical Seats: 10,000 additional
- IIT Infrastructure: Expansion funding
- Digital Textbooks: Multi-language support

Digital Initiatives:
- BharatNet for all govt secondary schools
- AI-powered personalized learning
- Digital assessment systems
- Online teacher training programs
- Virtual labs and simulations

Skilling Programs:
- 5 National Centres of Excellence
- Global partnerships for skill development
- Industry-academia collaboration
- Future-ready skill training
- Employment-linked programs

Timeline:
- Phase 1 (2025-26): Infrastructure setup
- Phase 2 (2026-28): Full implementation
- Phase 3 (2028-30): Scale and optimization`,
    category: "Academic",
    tags: ["Union Budget", "Digital Learning", "AI Education", "Atal Tinkering Labs", "Government Initiative"],
    author: "Finance Ministry",
    readTime: 5,
    featured: false,
    priority: 3,
    images: [],
    sourceLink: "https://www.indiabudget.gov.in",
    status: "published",
    searchKeywords: ["Budget", "Digital Education", "AI", "Tinkering Labs", "Government", "Initiative"],
    studentLevel: "all",
    examRelevance: ["Government Schemes", "Education Technology"]
  }
];

export async function seedNewsDatabase() {
  try {
    console.log('Seeding news database...');
    
    // Clear existing data
    await storage.db.delete(newsArticles);
    
    // Insert seed data
    const insertedArticles = await storage.db.insert(newsArticles)
      .values(seedNewsData.map(article => ({
        ...article,
        publishDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
      .returning();
    
    console.log(`✅ Successfully seeded ${insertedArticles.length} news articles`);
    
    return insertedArticles;
  } catch (error) {
    console.error('❌ Error seeding news database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  seedNewsDatabase()
    .then(() => {
      console.log('News database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('News database seeding failed:', error);
      process.exit(1);
    });
}