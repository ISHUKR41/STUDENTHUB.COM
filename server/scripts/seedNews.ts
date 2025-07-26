import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { newsArticles } from "../../shared/schema";

const connection = neon(process.env.DATABASE_URL!);
const db = drizzle(connection);

const sampleNews = [
  {
    title: "JEE Main 2025 Registration Opens - Important Dates and Guidelines",
    subtitle: "Complete guide to JEE Main 2025 application process",
    summary: "The National Testing Agency (NTA) has announced the opening of JEE Main 2025 registration. Students can apply online from January 1st to March 15th. The exam will be conducted in multiple phases with detailed eligibility criteria.",
    fullContent: `The Joint Entrance Examination (JEE) Main 2025 registration process has officially commenced, marking a crucial milestone for aspiring engineering students across the country. The National Testing Agency (NTA) has released comprehensive guidelines for the application process.

Key Highlights:
• Registration Period: January 1, 2025 - March 15, 2025
• Application Fee: ₹1,000 for General/OBC candidates, ₹500 for SC/ST/PWD candidates
• Exam Dates: April 15-30, 2025 (Session 1), May 20-30, 2025 (Session 2)
• Eligibility: 12th pass or appearing candidates with Physics, Chemistry, and Mathematics

The examination will be conducted in Computer Based Test (CBT) mode across multiple centers nationwide. Students are advised to complete their applications well before the deadline to avoid last-minute technical issues.

Important Documents Required:
- Class 10th and 12th mark sheets
- Category certificate (if applicable)
- PWD certificate (if applicable)
- Passport-size photographs
- Valid email ID and mobile number

The JEE Main score is used for admission to NITs, IIITs, and other centrally funded technical institutions. It also serves as a qualifying exam for JEE Advanced, which is the gateway to IITs.`,
    category: "Exam",
    tags: ["JEE Main", "Engineering", "NTA", "Registration", "2025"],
    author: "Education Desk",
    readTime: 8,
    featured: true,
    priority: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        alt: "Students preparing for JEE Main exam",
        caption: "JEE Main 2025 registration is now open for aspiring engineers"
      }
    ],
    views: 15420,
    likes: 892,
    shares: 156,
    status: "published"
  },
  {
    title: "New Scholarship Program for Undergraduate Students - Apply Now",
    subtitle: "₹2 lakh per year scholarship for meritorious students",
    summary: "The Ministry of Education launches a comprehensive scholarship program offering financial assistance up to ₹2 lakh annually for deserving undergraduate students across all disciplines.",
    fullContent: `The Government of India has announced a groundbreaking scholarship initiative aimed at supporting undergraduate students from economically weaker sections. This comprehensive program will provide financial assistance to ensure that no deserving student is denied quality education due to financial constraints.

Scholarship Details:
• Maximum Amount: ₹2,00,000 per year
• Duration: Complete course duration (3-4 years)
• Eligibility: Family income below ₹6 lakh per annum
• Merit Criteria: Minimum 75% in 12th standard
• Coverage: All undergraduate courses in recognized institutions

The scholarship covers tuition fees, accommodation charges, study materials, and a monthly stipend for living expenses. Special preference will be given to girl students, first-generation learners, and students from rural areas.

Application Process:
1. Visit the official scholarship portal
2. Complete online registration
3. Upload required documents
4. Submit income certificate
5. Await verification and selection

Selection will be based on academic merit, family income, and a personal interview. The program aims to support 50,000 students annually across India.

This initiative is part of the government's broader vision to achieve inclusive education and reduce dropout rates among talented students from disadvantaged backgrounds.`,
    category: "Scholarship",
    tags: ["Scholarship", "Undergraduate", "Financial Aid", "Government", "Education"],
    author: "Scholarship Team",
    readTime: 6,
    featured: true,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        alt: "Students celebrating scholarship achievement",
        caption: "New scholarship program opens doors for deserving students"
      }
    ],
    views: 12850,
    likes: 675,
    shares: 234,
    status: "published"
  },
  {
    title: "Top Tech Companies Campus Placement Drive 2025 Schedule",
    subtitle: "Microsoft, Google, Amazon to visit 200+ colleges",
    summary: "Major technology companies announce their campus recruitment schedule for 2025. Over 10,000 positions available across software development, data science, and product management roles.",
    fullContent: `The campus placement season 2025 is set to be one of the most promising in recent years, with top technology companies confirming their participation in recruitment drives across premier institutions.

Participating Companies:
• Microsoft - 1,200 positions
• Google - 800 positions  
• Amazon - 1,500 positions
• Meta - 600 positions
• Apple - 400 positions
• Adobe - 500 positions

Role Categories:
- Software Development Engineer (60% of positions)
- Data Scientist & Analyst (20% of positions)
- Product Manager (10% of positions)
- UI/UX Designer (5% of positions)
- Other technical roles (5% of positions)

Salary Packages:
• Tier-1 institutions: ₹15-45 LPA
• Tier-2 institutions: ₹8-25 LPA
• Average package increase: 18% from 2024

Key Dates:
- Registration opens: February 1, 2025
- Pre-placement talks: February 15-28, 2025
- Written tests: March 1-15, 2025
- Interviews: March 16-31, 2025
- Results: April 1-7, 2025

Companies are specifically looking for candidates with strong problem-solving skills, proficiency in multiple programming languages, and experience with cloud technologies, AI/ML, and system design.

Students are advised to prepare thoroughly for coding interviews, practice system design concepts, and develop strong communication skills to excel in the selection process.`,
    category: "Career",
    tags: ["Placements", "Tech Jobs", "Campus Recruitment", "Software Engineer", "Career"],
    author: "Career Counseling",
    readTime: 7,
    featured: false,
    priority: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        alt: "Campus placement interview session",
        caption: "Tech giants gear up for massive campus recruitment drive"
      }
    ],
    views: 9876,
    likes: 543,
    shares: 189,
    status: "published"
  },
  {
    title: "AI and Machine Learning Course Enrollment Surge by 300%",
    subtitle: "Universities report unprecedented demand for AI programs",
    summary: "Educational institutions across India witness a massive surge in AI and ML course enrollments. New specialized programs launched to meet growing industry demand.",
    fullContent: `Artificial Intelligence and Machine Learning courses have witnessed an unprecedented surge in enrollment, with universities reporting a 300% increase compared to the previous year. This dramatic rise reflects the growing awareness among students about career opportunities in emerging technologies.

Enrollment Statistics:
• Total AI/ML enrollments: 2,45,000 (2025)
• Previous year: 61,250 (2024)
• Growth rate: 300%
• New programs launched: 150+ across India

Top Universities Leading the Way:
1. IIT Delhi - Advanced AI Program
2. IIT Bombay - ML Specialization
3. IIIT Hyderabad - Data Science & AI
4. IISc Bangalore - Computational Data Science
5. Delhi University - Applied AI

Course Categories in High Demand:
- Machine Learning Fundamentals (40% of enrollments)
- Deep Learning & Neural Networks (25%)
- Natural Language Processing (15%)
- Computer Vision (12%)
- Robotics & AI (8%)

Industry Demand Driving Growth:
The surge is primarily driven by industry requirements, with companies actively seeking AI/ML professionals. Starting salaries for AI specialists range from ₹12-35 LPA, significantly higher than traditional IT roles.

Key Skills in Demand:
• Python programming
• TensorFlow and PyTorch
• Statistical analysis
• Data visualization
• Cloud computing (AWS, Azure, GCP)

Universities are rapidly scaling up infrastructure, hiring specialized faculty, and partnering with tech companies to provide industry-relevant curriculum and hands-on experience through internships and projects.`,
    category: "Technology",
    tags: ["AI", "Machine Learning", "Education", "Technology", "Career"],
    author: "Tech Education",
    readTime: 5,
    featured: false,
    priority: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
        alt: "AI and ML programming interface",
        caption: "AI and ML courses see massive enrollment surge across universities"
      }
    ],
    views: 7654,
    likes: 432,
    shares: 98,
    status: "published"
  },
  {
    title: "National Sports Championship University Results 2025",
    subtitle: "Delhi University tops medal tally with 45 gold medals",
    summary: "The annual inter-university sports championship concludes with record-breaking performances. Over 5,000 athletes from 300 universities participated in 25 sporting events.",
    fullContent: `The National Sports Championship for Universities 2025 has concluded with spectacular performances and record-breaking achievements. Delhi University emerged as the overall champion, topping the medal tally with an impressive haul of 45 gold, 38 silver, and 42 bronze medals.

Medal Tally - Top 10 Universities:
1. Delhi University - 45G, 38S, 42B (Total: 125)
2. Panjab University - 38G, 35S, 40B (Total: 113)
3. Jawaharlal Nehru University - 32G, 42S, 38B (Total: 112)
4. University of Mumbai - 29G, 33S, 41B (Total: 103)
5. Banaras Hindu University - 26G, 31S, 39B (Total: 96)

Championship Highlights:
• Total Participants: 5,247 athletes
• Universities Represented: 312
• Sports Categories: 25
• New Records Set: 23
• Days of Competition: 12

Record-Breaking Performances:
- Women's 100m Sprint: 10.89 seconds (New National Record)
- Men's Long Jump: 8.24 meters
- Women's Shot Put: 18.45 meters
- Mixed Relay 4x400m: 3:08.45

Outstanding Individual Performers:
1. Priya Sharma (DU) - 4 Gold medals in Athletics
2. Rohan Kumar (PU) - 3 Gold medals in Swimming
3. Ankit Singh (JNU) - 2 Gold medals in Wrestling
4. Meera Patel (Mumbai) - 3 Gold medals in Badminton

The championship served as a crucial platform for identifying talent for national and international competitions. Several athletes have been shortlisted for upcoming Asian Games trials.

Special Recognition:
The event also emphasized sportsmanship and fair play, with the 'Fair Play Award' going to Anna University for their exemplary conduct throughout the championship.`,
    category: "Sports",
    tags: ["Sports", "University", "Championship", "Athletics", "Competition"],
    author: "Sports Correspondent",
    readTime: 4,
    featured: false,
    priority: 2,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        alt: "University sports championship ceremony",
        caption: "Delhi University celebrates victory at National Sports Championship"
      }
    ],
    views: 5432,
    likes: 298,
    shares: 67,
    status: "published"
  }
];

async function seedNewsData() {
  try {
    console.log('Starting news data seeding...');
    
    // Insert sample news articles
    const insertedArticles = await db
      .insert(newsArticles)
      .values(sampleNews)
      .returning();

    console.log(`Successfully seeded ${insertedArticles.length} news articles`);
    console.log('Sample articles:');
    insertedArticles.forEach(article => {
      console.log(`- ${article.title} (ID: ${article.id})`);
    });

  } catch (error) {
    console.error('Error seeding news data:', error);
  }
}

// Run the seeding
seedNewsData();

export { seedNewsData };