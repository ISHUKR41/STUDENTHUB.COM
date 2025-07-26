import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { newsArticles } from "../../shared/schema";

const connection = neon(process.env.DATABASE_URL!);
const db = drizzle(connection);

const additionalNews = [
  {
    title: "UPSC Civil Services Notification 2025 Released",
    subtitle: "Union Public Service Commission announces Civil Services Examination 2025 with 979 vacancies",
    summary: "UPSC has announced the Civil Services Examination 2025 with applications starting January 22. The examination includes 979 vacancies for IAS, IPS, IFS, and other services with preliminary exam on May 25, 2025.",
    fullContent: `The Union Public Service Commission (UPSC) has released the official notification for Civil Services Examination 2025 on January 22, 2025. The application process starts from January 22 and closes on February 11, 2025.

Key Details:
• Total Vacancies: 979 positions across Group A and Group B services
• Services Included: IAS, IPS, IFS, IRS, and other central services
• Application Portal: upsc.gov.in
• Age Limit: 21-32 years for general category with relaxation for reserved categories

Examination Schedule:
- Preliminary Examination: May 25, 2025
- Main Examination: August 22, 2025
- Interview/Personality Test: Following main examination results

Eligibility Criteria:
- Educational Qualification: Bachelor's degree from recognized university
- Age Limit: 21-32 years (general category)
- Number of Attempts: 6 for general, 9 for OBC, unlimited for SC/ST

The Civil Services Examination is one of the most prestigious competitive examinations in India, offering opportunities to serve in various administrative positions at the central government level.

Candidates are advised to prepare thoroughly and complete their applications well before the deadline to avoid technical issues.`,
    category: "Exam",
    tags: ["UPSC", "Civil Services", "IAS", "IPS", "Government Jobs", "2025"],
    author: "Government News Desk",
    readTime: 5,
    featured: true,
    priority: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop",
        alt: "UPSC Civil Services examination preparation",
        caption: "UPSC Civil Services 2025 notification released with 979 vacancies"
      }
    ],
    views: 18500,
    likes: 1200,
    shares: 340,
    status: "published"
  },
  {
    title: "IP University Begins 2025 Admissions from February 1",
    subtitle: "Guru Gobind Singh Indraprastha University opens admission process for over 40,000 seats",
    summary: "GGSIPU has initiated its admission process for undergraduate, postgraduate, and PhD programmes offering over 40,000 seats across 106 affiliated colleges for the 2025-26 academic session.",
    fullContent: `Guru Gobind Singh Indraprastha University (GGSIPU) has commenced its admission process for the 2025-26 academic session from February 1, 2025.

Admission Details:
• Total Seats: Over 40,000 across all programs
• Affiliated Institutions: 106 colleges and 18 university schools
• Programs: UG, PG, and PhD across various disciplines
• Classes Begin: August 1, 2025

New Courses Introduced:
- MSc in Molecular Diagnostics
- MSc in Microbiology
- BPT (Bachelor of Physiotherapy)
- Three-year LLB
- PG Programme in Applied Geoinformatics

Examination Schedule:
- Entrance Tests: April 26 to May 18, 2025
- CUET Integration: 20 undergraduate and 18 postgraduate programs will use CUET scores
- Application Process: Online through official university portal

Popular Programs:
• Engineering (B.Tech/M.Tech)
• Medical (MBBS, BDS, BAMS, BHMS)
• Management (BBA, MBA)
• Law (BA LLB, BBA LLB, LLM)
• Pharmacy (B.Pharma, M.Pharma)

The university has established itself as one of Delhi's premier institutions, offering quality education across diverse fields with strong industry connections and placement opportunities.`,
    category: "Academic",
    tags: ["IP University", "GGSIPU", "Admissions", "Delhi", "University", "2025"],
    author: "Education Correspondent",
    readTime: 4,
    featured: false,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        alt: "University campus and students",
        caption: "IP University opens admissions for over 40,000 seats across multiple programs"
      }
    ],
    views: 12400,
    likes: 650,
    shares: 180,
    status: "published"
  },
  {
    title: "IIM Shortlist 2025 Released for MBA Admissions",
    subtitle: "All 21 IIMs complete shortlisting process for MBA/PGP admission 2025-27 batch",
    summary: "IIM shortlists for the 2025-27 batch have been released following CAT 2024 results. The highest cutoff percentiles required for top IIMs are around 94, with personal interviews concluded.",
    fullContent: `All Indian Institutes of Management have released shortlists for the 2025-27 MBA batch following CAT 2024 results. The selection process has been completed with final admission offers sent in May 2025.

Shortlist Statistics:
• Total IIMs: 21 participating institutes
• CAT Cutoff Range: 80-94 percentiles
• Top IIM Cutoffs: 94+ percentiles for IIM A, B, C
• Selection Criteria: CAT score, academics, work experience, diversity

Key Shortlist Dates:
- IIM Ahmedabad: January 8, 2025
- IIM Bangalore: January 15, 2025
- IIM Calcutta: January 7, 2025
- IIM Lucknow: January 6, 2025
- IIM Kozhikode: January 10, 2025

Selection Process Components:
• CAT Score (50-60% weightage)
• Academic Performance (15-20% weightage)
• Work Experience (10-15% weightage)
• Written Ability Test (WAT) (5-10% weightage)
• Personal Interview (15-25% weightage)

Top Performing Categories:
- Engineers: Highest representation in shortlists
- Non-Engineers: Special consideration for diversity
- Women Candidates: Additional diversity points
- Work Experience: 2-4 years optimal range

Interview Process:
Personal interviews were conducted between February-April 2025 across multiple cities. The process evaluated leadership potential, communication skills, and career goals.

The MBA programs at IIMs continue to be among the most sought-after management education opportunities in India, with graduates securing positions in top consulting, finance, and technology firms.`,
    category: "Career",
    tags: ["IIM", "MBA", "CAT", "Admission", "Management", "Career"],
    author: "MBA Desk",
    readTime: 6,
    featured: true,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        alt: "Business school graduates",
        caption: "IIM shortlists released for MBA admissions 2025-27 batch"
      }
    ],
    views: 16800,
    likes: 890,
    shares: 250,
    status: "published"
  },
  {
    title: "Delhi University B.Tech Admission Schedule 2025-26 Announced",
    subtitle: "University of Delhi releases detailed admission schedule for B.Tech programs",
    summary: "Delhi University has announced the admission schedule for B.Tech programs in Computer Science, Electronics, and Electrical Engineering for academic session 2025-26 with first round results on June 17.",
    fullContent: `Delhi University has released the comprehensive admission schedule for B.Tech programs for the 2025-26 academic session, covering three major engineering disciplines.

Program Details:
• Computer Science & Engineering
• Electronics & Communication Engineering
• Electrical Engineering
• Total Seats: Limited intake per program

Admission Timeline:
- First Round Results: June 17, 2025 at 5:00 PM
- Seat Acceptance Deadline: June 20, 2025
- Fee Payment Deadline: June 22, 2025
- Second Round: Following first round completion
- Third Round: Final allocation round

Process Features:
• Three-round allocation system
• Mid-entry windows for late applications
• Parallel document verification
• Department approval process
• Online seat allocation and acceptance

Required Documents:
- Class 12 mark sheet and certificate
- JEE Main scorecard
- Category certificate (if applicable)
- Character certificate
- Transfer certificate
- Medical fitness certificate

Eligibility Criteria:
• JEE Main qualification mandatory
• Class 12 with Physics, Chemistry, Mathematics
• Minimum 75% in Class 12 (70% for reserved categories)
• Age limit as per JEE Main norms

Fee Structure:
- Tuition Fee: As per DU norms
- Development Fee: One-time payment
- Security Deposit: Refundable
- Other Charges: Library, lab, sports fees

Delhi University's engineering programs have gained recognition for their quality education and industry connections, making them highly competitive among engineering aspirants.`,
    category: "Academic",
    tags: ["Delhi University", "B.Tech", "Engineering", "Admission", "JEE Main"],
    author: "DU Correspondent",
    readTime: 5,
    featured: false,
    priority: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1581091870621-477ecaed0c62?w=800&h=600&fit=crop",
        alt: "Engineering college campus",
        caption: "Delhi University announces B.Tech admission schedule for 2025-26"
      }
    ],
    views: 9500,
    likes: 420,
    shares: 110,
    status: "published"
  },
  {
    title: "India Wins 4 Medals at International Chemistry Olympiad 2025",
    subtitle: "Indian students secure 2 gold and 2 silver medals at 57th IChO in Dubai",
    summary: "India achieved outstanding performance at the 57th International Chemistry Olympiad held in Dubai, UAE, securing 2 gold and 2 silver medals and ranking 6th globally among 90 participating countries.",
    fullContent: `India demonstrated exceptional performance at the 57th International Chemistry Olympiad (IChO) held in Dubai, UAE, from July 5-14, 2025, achieving a remarkable medal tally.

Medal Winners:
Gold Medals:
• Devesh Pankaj Bhaiya from Jalgaon, Maharashtra
• Sandeep Kuchi from Hyderabad, Telangana

Silver Medals:
• Debadatta Priyadarshi from Bhubaneswar, Odisha
• Ujjwal Kesari from New Delhi

Competition Statistics:
- Participating Countries: 90 nations
- Total Students: 354 participants
- India's Global Rank: 6th position
- India's IChO Participation: 26th year

Selection Process:
The Indian team was selected through rigorous National Olympiad Examinations conducted by Homi Bhabha Centre for Science Education (HBCSE), Mumbai, under the Tata Institute of Fundamental Research (TIFR).

Team Mentorship:
• Head Mentor: Prof. Ankush Gupta (HBCSE)
• Supporting Experts: Team of experienced chemistry educators
• Training Program: Intensive preparation spanning several months

Competition Format:
- Theoretical Examination: Complex chemistry problems
- Practical Laboratory Work: Experimental chemistry tasks
- Duration: Multi-day intensive competition
- Topics: Organic, Inorganic, Physical, and Analytical Chemistry

Historical Performance:
India has consistently performed well in international chemistry competitions, with this year's performance reinforcing the country's strong foundation in science education and research.

The achievement highlights the effectiveness of India's science education system and the dedication of students and mentors in pursuing excellence in chemistry at the international level.`,
    category: "Academic",
    tags: ["Chemistry Olympiad", "International Competition", "Science", "Students", "Achievement"],
    author: "Science Education Team",
    readTime: 4,
    featured: true,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
        alt: "Chemistry laboratory and medal ceremony",
        caption: "Indian students excel at International Chemistry Olympiad 2025"
      }
    ],
    views: 11200,
    likes: 780,
    shares: 195,
    status: "published"
  },
  {
    title: "NEET UG 2025 Results Declared",
    subtitle: "National Testing Agency announces NEET UG 2025 results with 20.8 lakh candidates",
    summary: "The National Eligibility cum Entrance Test (NEET UG) 2025 results have been declared by NTA. Over 20.8 lakh candidates appeared for the examination which serves as the single entrance exam for medical courses.",
    fullContent: `The National Testing Agency (NTA) has officially declared the NEET UG 2025 results, marking a crucial milestone for medical aspirants across India.

Examination Statistics:
• Total Candidates: 20.8 lakh appeared
• Exam Date: Conducted nationwide in multiple sessions
• Result Declaration: Available on official NTA website
• Score Validity: For MBBS, BDS, and AYUSH admissions

Eligibility Requirements:
- Educational: Class 12 pass in Science stream
- Subjects: Physics, Chemistry, Biology/Biotechnology mandatory
- Minimum Marks: 50% for General (40% for SC/ST/OBC)
- Age Criteria: Minimum 17 years by December 31 of admission year

Course Coverage:
• MBBS (Bachelor of Medicine and Bachelor of Surgery)
• BDS (Bachelor of Dental Surgery)
• AYUSH Courses (Ayurveda, Yoga, Unani, Siddha, Homeopathy)
• Veterinary Science (in some states)

Counselling Process:
- All India Quota: Managed by Medical Counselling Committee (MCC)
- State Quota: Handled by respective state authorities
- Private Colleges: Separate counselling processes
- Deemed Universities: Individual admission procedures

Fee Structure:
Government Medical Colleges:
- MBBS: INR 10,000 - 50,000 per year
- BDS: INR 20,000 - 80,000 per year

Private Medical Colleges:
- MBBS: INR 3 - 25 lakhs per year
- BDS: INR 2 - 15 lakhs per year

Counselling Schedule:
- Registration: Begins immediately after result declaration
- Choice Filling: Online preference submission
- Seat Allotment: Multiple rounds as per merit
- Document Verification: At allotted colleges

Career Prospects:
MBBS graduates can pursue specialization through NEET PG, practice as general physicians, or explore opportunities in medical research, healthcare administration, and public health.

The medical profession continues to be one of the most respected and rewarding career paths, with growing opportunities in India's expanding healthcare sector.`,
    category: "Exam",
    tags: ["NEET", "Medical Entrance", "MBBS", "BDS", "NTA", "Results"],
    author: "Medical Education Team",
    readTime: 6,
    featured: true,
    priority: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        alt: "Medical students and stethoscope",
        caption: "NEET UG 2025 results declared for 20.8 lakh medical aspirants"
      }
    ],
    views: 25600,
    likes: 1450,
    shares: 420,
    status: "published"
  },
  {
    title: "Union Budget 2025 Boosts Digital Learning Initiatives",
    subtitle: "Finance Minister announces major digital education push including AI centers and rural connectivity",
    summary: "Union Budget 2025 introduces comprehensive digital learning initiatives including AI centers, broadband connectivity for rural schools, and 50,000 new Atal Tinkering Labs.",
    fullContent: `The Union Budget 2025 has announced a transformative digital education package, marking a significant investment in India's educational technology infrastructure.

Key Announcements:

Centre of Excellence in AI for Education:
• Budget Allocation: ₹500 crore
• Objective: Advance AI applications in education
• Focus Areas: Personalized learning, automated assessment, educational analytics

BharatNet Expansion:
• Target: All government secondary schools
• Service: High-speed broadband connectivity
• Impact: Rural education digitization
• Timeline: Phased implementation over 3 years

Bharatiya Bhasha Pustak Scheme:
• Digital textbooks in multiple Indian languages
• Multi-language support for regional students
• Enhanced accessibility for vernacular education
• Integration with existing curricula

Infrastructure Development:

Atal Tinkering Labs:
• New Labs: 50,000 over five years
• Target: Government schools nationwide
• Equipment: Modern STEM tools and technology
• Beneficiaries: Millions of school students

National Centres of Excellence:
• Number: 5 new centers for skilling
• Partnerships: Global institutions collaboration
• Focus: Industry-relevant skill development
• Technology Integration: Advanced training methods

Medical Education Expansion:
• New Medical Seats: 10,000 additional
• Infrastructure: Enhanced medical college facilities
• Quality Improvement: Upgraded equipment and technology

IIT Development:
• Student Capacity: Doubled to 1.35 lakh in past decade
• New Infrastructure: Additional campuses and facilities
• Research Focus: Advanced technology and innovation
• Industry Partnerships: Enhanced collaboration

Budget Impact:
- Total Education Allocation: Significant increase over previous year
- Digital Focus: 40% of education budget toward technology
- Rural Emphasis: Special allocation for underserved areas
- Skill Development: Integration with industry requirements

Implementation Timeline:
• Phase 1: April-September 2025
• Phase 2: October 2025-March 2026
• Phase 3: Full rollout by March 2027

Expected Outcomes:
The initiatives aim to bridge the digital divide, enhance learning outcomes, and prepare students for the digital economy while preserving India's linguistic and cultural diversity in education.`,
    category: "Technology",
    tags: ["Union Budget", "Digital Education", "AI", "Technology", "Government", "Schools"],
    author: "Policy Analysis Team",
    readTime: 7,
    featured: true,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
        alt: "Digital classroom with students using technology",
        caption: "Union Budget 2025 announces major digital education initiatives"
      }
    ],
    views: 14300,
    likes: 820,
    shares: 280,
    status: "published"
  }
];

async function addMoreNewsData() {
  try {
    console.log('Adding additional news articles...');
    
    const insertedArticles = await db
      .insert(newsArticles)
      .values(additionalNews.map(article => ({
        ...article,
        tags: article.tags || [],
        images: article.images || []
      })))
      .returning();

    console.log(`Successfully added ${insertedArticles.length} additional news articles`);
    console.log('New articles:');
    insertedArticles.forEach(article => {
      console.log(`- ${article.title} (ID: ${article.id})`);
    });

  } catch (error) {
    console.error('Error adding news data:', error);
  }
}

// Run the seeding
addMoreNewsData();

export { addMoreNewsData };