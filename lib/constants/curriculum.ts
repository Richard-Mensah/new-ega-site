export type ResourceType = "video" | "article" | "course" | "guide"

export interface LearningResource {
  type: ResourceType
  title: string
  source: string
  url: string
  duration: string
}

export interface LearningTopic {
  id: number
  title: string
  overview: string
  resources: LearningResource[]
}

export interface LearningModule {
  id: number
  phase: 1 | 2
  title: string
  subtitle: string
  description: string
  objectives: string[]
  weekRange: string
  estimatedHours: number
  topics: LearningTopic[]
}

export const CURRICULUM: LearningModule[] = [
  // ─── MONTH 1 ─────────────────────────────────────────────────────────────
  {
    id: 1,
    phase: 1,
    title: "Leadership Foundations",
    subtitle: "Discover your leadership identity",
    description:
      "Establish the core principles of effective leadership through evidence-based frameworks used by Harvard Business School and top global institutions. You will identify your natural leadership style, develop emotional intelligence, and build the resilience required to lead in complex, rapidly changing environments.",
    objectives: [
      "Identify and articulate your personal leadership style",
      "Apply emotional intelligence models in professional settings",
      "Communicate with clarity, confidence, and influence",
      "Build psychological resilience using research-backed methods",
    ],
    weekRange: "Weeks 1–4",
    estimatedHours: 8,
    topics: [
      {
        id: 1,
        title: "Leadership Styles & Frameworks",
        overview:
          "Leadership is not one-size-fits-all. Understanding the spectrum — from transformational to servant leadership — helps you identify where your strengths lie and when to flex your approach. Harvard Business School research shows that leaders who adapt their style to context consistently outperform those who apply a single fixed mode. This topic introduces six foundational leadership styles and the neuroscience behind what makes each effective.",
        resources: [
          {
            type: "video",
            title: "How Great Leaders Inspire Action",
            source: "TED Talks — Simon Sinek",
            url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
            duration: "18 min",
          },
          {
            type: "article",
            title: "Leadership Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/leadership",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Inspiring and Motivating Individuals",
            source: "Coursera — HEC Paris",
            url: "https://www.coursera.org/learn/inspirational-leadership",
            duration: "~5 hours",
          },
        ],
      },
      {
        id: 2,
        title: "Emotional Intelligence in Leadership",
        overview:
          "Emotional intelligence (EQ) is consistently ranked the #1 predictor of leadership success, outperforming IQ and technical expertise. Daniel Goleman's landmark research identified five dimensions: self-awareness, self-regulation, motivation, empathy, and social skill. For young African leaders operating in multicultural environments, high EQ is your most powerful tool for building trust and mobilising collective action where positional authority alone will not suffice.",
        resources: [
          {
            type: "video",
            title: "The Power of Vulnerability",
            source: "TED Talks — Brené Brown",
            url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
            duration: "20 min",
          },
          {
            type: "article",
            title: "Emotional Intelligence Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/emotional-intelligence",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Inspiring Leadership Through Emotional Intelligence",
            source: "Coursera — Case Western Reserve",
            url: "https://www.coursera.org/learn/emotional-intelligence-leadership",
            duration: "~6 hours",
          },
        ],
      },
      {
        id: 3,
        title: "Effective Communication",
        overview:
          "Stanford research shows that how leaders communicate often matters more than what they communicate. Whether you are speaking to your community, writing grant proposals, or pitching to funders, mastering persuasive communication is non-negotiable. This topic covers the science of public speaking, active listening, and the art of framing ideas to inspire action — drawing on frameworks used at the Harvard Kennedy School and MIT Media Lab.",
        resources: [
          {
            type: "video",
            title: "How to Speak So That People Want to Listen",
            source: "TED Talks — Julian Treasure",
            url: "https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen",
            duration: "10 min",
          },
          {
            type: "article",
            title: "Communication Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/communication",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Introduction to Public Speaking",
            source: "Coursera — University of Washington",
            url: "https://www.coursera.org/learn/public-speaking",
            duration: "~10 hours",
          },
        ],
      },
      {
        id: 4,
        title: "Resilience & Growth Mindset",
        overview:
          "Carol Dweck's seminal Stanford research on growth mindset — the belief that abilities can be developed through dedication — shows that leaders with this orientation are significantly more likely to succeed through adversity. For emerging leaders in Africa, where challenges are often structural and systemic, resilience is not optional: it is the foundation on which all other leadership capacity is built. This topic equips you with evidence-based tools for cultivating it deliberately.",
        resources: [
          {
            type: "video",
            title: "The Power of Believing That You Can Improve",
            source: "TED Talks — Carol Dweck",
            url: "https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve",
            duration: "10 min",
          },
          {
            type: "video",
            title: "Grit: The Power of Passion and Perseverance",
            source: "TED Talks — Angela Duckworth",
            url: "https://www.ted.com/talks/angela_lee_duckworth_grit_the_power_of_passion_and_perseverance",
            duration: "6 min",
          },
          {
            type: "article",
            title: "Resilience Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/resilience",
            duration: "Reading list",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    phase: 1,
    title: "SDG Literacy",
    subtitle: "Master the global development agenda",
    description:
      "Develop operational fluency in the 17 UN Sustainable Development Goals and understand Africa's central role in achieving the 2030 Agenda. You will learn to measure social impact using frameworks adopted by the UN and World Bank, and connect your own leadership work to the global goals in language that resonates with international funders and partners.",
    objectives: [
      "Explain all 17 SDGs, their targets, and key indicators",
      "Analyse Africa's SDG progress and the Agenda 2063 alignment",
      "Apply logic models and theories of change to measure impact",
      "Map any project or initiative to specific SDG targets",
    ],
    weekRange: "Weeks 5–8",
    estimatedHours: 8,
    topics: [
      {
        id: 1,
        title: "The 17 Goals: A Deep Dive",
        overview:
          "The UN Sustainable Development Goals are the world's most ambitious blueprint for human progress — 17 goals, 169 targets, and 232 indicators framing a 2030 roadmap to end poverty, protect the planet, and ensure prosperity for all. But knowing these goals is just the starting point. This topic gives you operational mastery of each goal, its metrics, and the practical interventions moving the needle globally so you can speak fluently with funders and partners.",
        resources: [
          {
            type: "guide",
            title: "The 17 Sustainable Development Goals",
            source: "United Nations — Official SDG Portal",
            url: "https://sdgs.un.org/goals",
            duration: "Reference",
          },
          {
            type: "course",
            title: "SDG Academy: Free SDG Courses",
            source: "SDG Academy — UN Partnership",
            url: "https://sdgacademy.org/",
            duration: "Self-paced",
          },
          {
            type: "guide",
            title: "Understanding the Sustainable Development Goals",
            source: "UNDP — United Nations Development Programme",
            url: "https://www.undp.org/sustainable-development-goals",
            duration: "Reference",
          },
        ],
      },
      {
        id: 2,
        title: "Africa & the 2030 Agenda",
        overview:
          "Africa is simultaneously the continent with the greatest SDG challenges and the greatest SDG opportunities. With 60% of the world's arable land, the youngest population on earth, and a rapidly growing innovation ecosystem, African leaders have a unique and decisive role in shaping the global development agenda. This topic explores Africa's current SDG progress, the African Union's Agenda 2063 alignment, and how young African leaders are driving bottom-up solutions at scale.",
        resources: [
          {
            type: "guide",
            title: "Agenda 2063: The Africa We Want",
            source: "African Union — Official Framework",
            url: "https://au.int/agenda2063/overview",
            duration: "Reference",
          },
          {
            type: "article",
            title: "SDG Progress in Africa",
            source: "UNDP Africa",
            url: "https://www.undp.org/africa/sustainable-development-goals",
            duration: "15 min read",
          },
          {
            type: "course",
            title: "Transforming Africa: An SDG Deep Dive",
            source: "SDG Academy",
            url: "https://sdgacademy.org/course/transforming-our-world/",
            duration: "~4 hours",
          },
        ],
      },
      {
        id: 3,
        title: "Measuring Social Impact",
        overview:
          "\"What gets measured gets managed.\" Impact measurement is the language that funders, governments, and global institutions speak. Understanding theories of change, logic models, and KPIs for social programs separates professional change-makers from well-intentioned volunteers. This topic introduces the key frameworks used by UN agencies, the World Bank, and leading social enterprises to evaluate real-world outcomes — and teaches you to use them in your own work.",
        resources: [
          {
            type: "article",
            title: "Stanford Social Innovation Review — Impact",
            source: "Stanford SSIR",
            url: "https://ssir.org/articles/category/metrics",
            duration: "Reading list",
          },
          {
            type: "guide",
            title: "Results-Based Management Handbook",
            source: "UNDP Evaluation Office",
            url: "https://www.undp.org/publications/results-based-management-handbook",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Measuring Social Impact",
            source: "Coursera — ESSEC Business School",
            url: "https://www.coursera.org/learn/social-impact",
            duration: "~8 hours",
          },
        ],
      },
      {
        id: 4,
        title: "Connecting Your Work to Global Goals",
        overview:
          "The SDGs are not just UN documents — they are a practical framework for designing programs, writing proposals, and communicating impact to donors. This topic teaches you how to map your project or community initiative to specific SDG targets, use official SDG indicators to measure and report progress, and frame your work in the language that international funders, development partners, and global institutions use when making investment decisions.",
        resources: [
          {
            type: "course",
            title: "The SDGs in Action",
            source: "Coursera — University of Copenhagen",
            url: "https://www.coursera.org/learn/sdgs",
            duration: "~6 hours",
          },
          {
            type: "guide",
            title: "SDG Indicator Framework",
            source: "UN Statistics Division",
            url: "https://unstats.un.org/sdgs/indicators/indicators-list/",
            duration: "Reference",
          },
          {
            type: "article",
            title: "How to Align Your Work With the Global Goals",
            source: "Global Goals — UN Partnership Hub",
            url: "https://sdgs.un.org/partnerships",
            duration: "20 min read",
          },
        ],
      },
    ],
  },

  {
    id: 3,
    phase: 1,
    title: "Mentorship Framework",
    subtitle: "Master the art and science of mentorship",
    description:
      "Develop the skills to get the most from your EGA mentorship relationship — and to mentor others. Drawing on research from MIT, Wharton, and Harvard, you will learn the psychological mechanisms of effective mentorship, master goal-setting and accountability systems, and build the deep listening capacity that transforms good conversations into transformative relationships.",
    objectives: [
      "Understand what research shows makes mentorship effective",
      "Set SMART goals and advanced goal frameworks with your mentor",
      "Practice active listening and deep inquiry techniques",
      "Build accountability and feedback systems that drive growth",
    ],
    weekRange: "Weeks 9–12",
    estimatedHours: 7,
    topics: [
      {
        id: 1,
        title: "The Science of Effective Mentorship",
        overview:
          "Mentorship has a 70-year evidence base showing it accelerates career growth, improves wellbeing, and transmits tacit knowledge that formal education cannot. Research from MIT and Wharton shows that structured mentorship programmes yield a 5x return on investment in leadership development. This topic unpacks what makes mentorship work — the psychological mechanisms, common failure modes, and best practices from Harvard's Leadership Development and coaching programmes.",
        resources: [
          {
            type: "article",
            title: "Mentoring Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/mentoring",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Everyday Leadership",
            source: "Coursera — Duke University",
            url: "https://www.coursera.org/learn/everyday-leadership-new-horizons",
            duration: "~5 hours",
          },
          {
            type: "guide",
            title: "Mentorship Best Practices",
            source: "MIT Leadership Center",
            url: "https://leadership.mit.edu/",
            duration: "Reference",
          },
        ],
      },
      {
        id: 2,
        title: "Goal Setting: SMART & Beyond",
        overview:
          "Edwin Locke's goal-setting theory — one of the most replicated findings in organisational psychology — demonstrates that specific, challenging goals lead to higher performance than vague or easy ones. But SMART goals are just the foundation. This topic introduces the OKR framework used by Google and Intel, the WOOP method from NYU psychologist Gabriele Oettingen, and how to set goals that balance bold ambition with the psychological safety required for honest progress.",
        resources: [
          {
            type: "article",
            title: "Goal Setting Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/goal-setting",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Work Smarter, Not Harder: Time Management",
            source: "Coursera — University of California",
            url: "https://www.coursera.org/learn/work-smarter-not-harder",
            duration: "~4 hours",
          },
          {
            type: "video",
            title: "Inside Bill's Brain: Goal Setting at Scale",
            source: "TED Talks",
            url: "https://www.ted.com/talks",
            duration: "TED collection",
          },
        ],
      },
      {
        id: 3,
        title: "Active Listening & Deep Inquiry",
        overview:
          "Most people listen to reply, not to understand. Research shows executives retain only 25% of what they hear, and that improving listening skills has a direct 10–15% impact on team performance. MIT professor Otto Scharmer's Theory U introduces \"presencing\" — listening from the future rather than from the past. This topic transforms your capacity to build genuine trust with your mentor and, eventually, those you lead and mentor yourself.",
        resources: [
          {
            type: "course",
            title: "U.Lab: Leading From the Emerging Future",
            source: "MIT — Otto Scharmer (Free)",
            url: "https://www.edx.org/learn/leadership/massachusetts-institute-of-technology-u-lab-leading-from-the-emerging-future",
            duration: "Self-paced",
          },
          {
            type: "article",
            title: "What Great Listeners Actually Do",
            source: "Harvard Business Review",
            url: "https://hbr.org/2016/07/what-great-listeners-actually-do",
            duration: "8 min read",
          },
          {
            type: "video",
            title: "5 Ways to Listen Better",
            source: "TED Talks — Julian Treasure",
            url: "https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better",
            duration: "8 min",
          },
        ],
      },
      {
        id: 4,
        title: "Accountability & Feedback Loops",
        overview:
          "The most powerful growth accelerator in any mentorship relationship is consistent, honest feedback. Yet research from Columbia Business School shows that managers overwhelmingly withhold corrective feedback despite the fact that 57% of people actually prefer it over empty praise. This topic covers how to build accountability structures, give and receive feedback without defensiveness, and use the radical candour framework to create a high-performance mentorship dynamic.",
        resources: [
          {
            type: "article",
            title: "The Feedback Fallacy",
            source: "Harvard Business Review",
            url: "https://hbr.org/2019/03/the-feedback-fallacy",
            duration: "15 min read",
          },
          {
            type: "video",
            title: "The Secret to Giving Great Feedback",
            source: "TED Talks — LeeAnn Renniger",
            url: "https://www.ted.com/talks/leeann_renniger_the_secret_to_giving_great_feedback",
            duration: "5 min",
          },
          {
            type: "course",
            title: "Feedback and Coaching for Leaders",
            source: "Coursera — University of California",
            url: "https://www.coursera.org/learn/feedback-and-coaching",
            duration: "~4 hours",
          },
        ],
      },
    ],
  },

  {
    id: 4,
    phase: 1,
    title: "Portfolio & Project Start",
    subtitle: "Build your brand and launch your first project",
    description:
      "Construct a compelling professional identity and launch your first SDG-aligned community project using design thinking methodology. You will build a portfolio that speaks the language of funders and employers, and apply participatory research methods to identify community challenges worth solving.",
    objectives: [
      "Build an authentic personal brand and professional portfolio",
      "Apply Stanford d.school design thinking to project ideation",
      "Conduct a participatory community needs assessment",
      "Launch a structured first project with clear objectives",
    ],
    weekRange: "Weeks 13–20",
    estimatedHours: 10,
    topics: [
      {
        id: 1,
        title: "Building Your Personal Brand",
        overview:
          "Your personal brand is the narrative others tell about you when you are not in the room. In the age of digital connectivity, a strong LinkedIn profile and clear professional positioning can unlock opportunities — scholarships, fellowships, board appointments — that are never formally advertised. This topic draws on research from INSEAD, Stanford GSB, and MIT on how emerging leaders can build authentic, compelling professional identities that open doors across borders.",
        resources: [
          {
            type: "course",
            title: "Personal Branding: Managing Your Professional Identity",
            source: "LinkedIn Learning (Free with LinkedIn)",
            url: "https://www.linkedin.com/learning/topics/personal-branding",
            duration: "Self-paced",
          },
          {
            type: "article",
            title: "Managing Yourself Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/managing-yourself",
            duration: "Reading list",
          },
          {
            type: "video",
            title: "How to Figure Out What You Really Want",
            source: "TED Talks — Ashley Stahl",
            url: "https://www.ted.com/talks/ashley_stahl_how_to_figure_out_what_you_really_want",
            duration: "14 min",
          },
        ],
      },
      {
        id: 2,
        title: "Portfolio Design for Impact",
        overview:
          "A portfolio is not a CV — it is a curated narrative of your leadership journey, projects, and values. Social impact leaders need portfolios that communicate outcome, not just activity. Funders and employers increasingly look for evidence of initiative, measurable impact, and values alignment. This topic draws on MIT's Communication Lab principles and design thinking to help you structure a digital portfolio that stands out in competitive global applications.",
        resources: [
          {
            type: "guide",
            title: "MIT Communication Lab — Portfolio Resources",
            source: "MIT Communication Lab",
            url: "https://mitcommlab.mit.edu/",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Everyday Excel: Building Professional Portfolios",
            source: "Coursera — University of Colorado",
            url: "https://www.coursera.org/learn/professional-development",
            duration: "~5 hours",
          },
          {
            type: "article",
            title: "How to Build a Standout Impact Portfolio",
            source: "Stanford Social Innovation Review",
            url: "https://ssir.org/",
            duration: "15 min read",
          },
        ],
      },
      {
        id: 3,
        title: "Project Ideation: Design Thinking",
        overview:
          "Stanford d.school's design thinking methodology — Empathise, Define, Ideate, Prototype, Test — is used by organisations from IDEO to the World Bank to solve complex human-centred problems. It starts not with solutions but with deep understanding of the people you serve. For EGA participants launching community projects, design thinking is the most practical, evidence-based framework for identifying problems that are genuinely worth solving at scale.",
        resources: [
          {
            type: "guide",
            title: "Design Thinking Bootleg",
            source: "Stanford d.school (Free)",
            url: "https://dschool.stanford.edu/resources/design-thinking-bootleg",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Design Thinking for Innovation",
            source: "Coursera — University of Virginia (Darden)",
            url: "https://www.coursera.org/learn/uva-darden-design-thinking",
            duration: "~8 hours",
          },
          {
            type: "video",
            title: "The Deep Dive — IDEO Design Process",
            source: "TED / IDEO",
            url: "https://www.ted.com/talks/david_kelley_how_to_build_your_creative_confidence",
            duration: "12 min",
          },
        ],
      },
      {
        id: 4,
        title: "Community Needs Assessment",
        overview:
          "Before you can lead change, you must understand the community you serve using rigorous, participatory methods. Too many projects fail because leaders solve the wrong problem. This topic introduces Participatory Rural Appraisal (PRA), asset-based community development (ABCD), and the UN's participatory assessment frameworks — the gold standard for understanding what communities need in their own words, used across Africa by leading development organisations.",
        resources: [
          {
            type: "guide",
            title: "Community-Driven Development Toolkit",
            source: "World Bank",
            url: "https://www.worldbank.org/en/topic/communitydrivendevelopment",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "Participatory Assessment Guide",
            source: "UNICEF",
            url: "https://www.unicef.org/evaluation/",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Community Organising for Social Justice",
            source: "Coursera — edX",
            url: "https://www.edx.org/learn/social-justice",
            duration: "~6 hours",
          },
        ],
      },
    ],
  },

  {
    id: 5,
    phase: 1,
    title: "Skills Development",
    subtitle: "Build the practical skills global leaders need",
    description:
      "Develop the core practical competencies that distinguish effective leaders from well-intentioned ones: public speaking, digital literacy, financial fluency, and strategic network-building. These skills are directly applicable to your EGA project work and will serve you throughout your career.",
    objectives: [
      "Deliver confident, persuasive presentations to any audience",
      "Leverage digital tools for social impact and professional growth",
      "Manage project budgets and understand financial fundamentals",
      "Build and activate a strategic professional network",
    ],
    weekRange: "Weeks 21–26",
    estimatedHours: 9,
    topics: [
      {
        id: 1,
        title: "Public Speaking & Presentations",
        overview:
          "Warren Buffett has stated that learning to communicate publicly is the single most valuable investment a young professional can make — and it can increase a person's professional value by 50%. From village halls to UN conference rooms, leaders speak. This topic blends Aristotle's classical rhetoric framework with modern neuroscience on storytelling and structured practice techniques used at Toastmasters International and Harvard Kennedy School.",
        resources: [
          {
            type: "video",
            title: "How to Speak So That People Want to Listen",
            source: "TED Talks — Julian Treasure",
            url: "https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen",
            duration: "10 min",
          },
          {
            type: "course",
            title: "Introduction to Public Speaking",
            source: "Coursera — University of Washington",
            url: "https://www.coursera.org/learn/public-speaking",
            duration: "~10 hours",
          },
          {
            type: "article",
            title: "How to Give a Killer Presentation",
            source: "Harvard Business Review — Chris Anderson",
            url: "https://hbr.org/2013/06/how-to-give-a-killer-presentation",
            duration: "10 min read",
          },
        ],
      },
      {
        id: 2,
        title: "Digital Literacy for the 21st Century",
        overview:
          "Digital literacy encompasses not just using technology, but understanding how digital systems shape power, equity, and opportunity. African leaders who master digital tools — from data analysis to social media strategy — have an outsized ability to amplify their message and impact. This topic draws on MIT Media Lab research and Google's Digital Skills for Africa programme to build practical, immediately applicable digital competence.",
        resources: [
          {
            type: "course",
            title: "Digital Skills for Africa",
            source: "Google Digital Skills for Africa (Free)",
            url: "https://learndigital.withgoogle.com/digitalskills",
            duration: "Self-paced",
          },
          {
            type: "guide",
            title: "MIT OpenCourseWare — Digital Tools",
            source: "MIT OpenCourseWare",
            url: "https://ocw.mit.edu/",
            duration: "Reference",
          },
          {
            type: "article",
            title: "Digital Transformation Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/digital-transformation",
            duration: "Reading list",
          },
        ],
      },
      {
        id: 3,
        title: "Financial Literacy for Youth Leaders",
        overview:
          "Financial illiteracy is one of the biggest barriers to leadership sustainability in Africa. Understanding budgets, grant management, financial modelling, and personal finance transforms good intentions into viable, scalable organisations. This topic uses Khan Academy's world-class financial curriculum alongside African Development Bank resources to build the financial competence that funders, donors, and boards require of credible, accountable leaders.",
        resources: [
          {
            type: "course",
            title: "Personal Finance and Economics",
            source: "Khan Academy (Free)",
            url: "https://www.khanacademy.org/college-careers-more/personal-finance",
            duration: "Self-paced",
          },
          {
            type: "course",
            title: "Financial Markets",
            source: "Coursera — Yale University (Robert Shiller)",
            url: "https://www.coursera.org/learn/financial-markets-global",
            duration: "~33 hours",
          },
          {
            type: "guide",
            title: "Financial Literacy Resources",
            source: "African Development Bank",
            url: "https://www.afdb.org/en/topics-and-sectors/topics/financial-sector-development",
            duration: "Reference",
          },
        ],
      },
      {
        id: 4,
        title: "Network Building & Strategic Relationships",
        overview:
          "Harvard Business School research shows that effective leaders spend 85% more time building and maintaining relationships than poor leaders do. In African development contexts, where personal trust and community relationships are foundational to programme success, network intelligence is a leadership superpower. This topic teaches you how to map your network, build genuine reciprocal relationships, and strategically leverage global alumni and professional communities.",
        resources: [
          {
            type: "article",
            title: "How Leaders Create and Use Networks",
            source: "Harvard Business Review",
            url: "https://hbr.org/2007/01/how-leaders-create-and-use-networks",
            duration: "12 min read",
          },
          {
            type: "video",
            title: "Why You Should Talk to Strangers",
            source: "TED Talks — Kio Stark",
            url: "https://www.ted.com/talks/kio_stark_why_you_should_talk_to_strangers",
            duration: "10 min",
          },
          {
            type: "course",
            title: "Strategic Networking for Professionals",
            source: "LinkedIn Learning (Free with LinkedIn)",
            url: "https://www.linkedin.com/learning/topics/networking",
            duration: "Self-paced",
          },
        ],
      },
    ],
  },

  // ─── MONTH 2 ─────────────────────────────────────────────────────────────
  {
    id: 6,
    phase: 2,
    title: "Advanced Leadership",
    subtitle: "Lead at the systems level",
    description:
      "Elevate your leadership from operational to strategic. Drawing on Harvard Business School case studies, MIT systems science, and real African leadership examples, you will develop the capacity to think strategically, lead complex change, engage with policy, and understand the systemic forces that shape the problems you are working to solve.",
    objectives: [
      "Apply strategic frameworks to leadership decisions",
      "Lead organisational change using Kotter's 8-Step model",
      "Engage with policy processes and civic institutions",
      "Use systems thinking to identify leverage points for change",
    ],
    weekRange: "Weeks 1–6",
    estimatedHours: 10,
    topics: [
      {
        id: 1,
        title: "Strategic Thinking & Decision Making",
        overview:
          "Strategic thinking — the ability to see the whole system, anticipate consequences, and make sound decisions under uncertainty — separates managers from leaders. McKinsey research shows strategic clarity is the #1 driver of organisational performance. This topic draws on frameworks from Harvard Business School, MIT Sloan, and the work of decision theorists to build your capacity for bold, data-informed, values-aligned strategic choices under pressure.",
        resources: [
          {
            type: "article",
            title: "Strategic Leadership: The Essential Skills",
            source: "Harvard Business Review",
            url: "https://hbr.org/2013/01/strategic-leadership-the-esssential-skills",
            duration: "10 min read",
          },
          {
            type: "course",
            title: "Strategic Leadership and Management",
            source: "Coursera — University of Illinois",
            url: "https://www.coursera.org/specializations/strategic-leadership",
            duration: "~6 months",
          },
          {
            type: "guide",
            title: "MIT Sloan Management Review — Strategy",
            source: "MIT Sloan Management Review",
            url: "https://sloanreview.mit.edu/tag/strategy/",
            duration: "Reading list",
          },
        ],
      },
      {
        id: 2,
        title: "Leading Change: Kotter's 8-Step Model",
        overview:
          "Harvard Business School professor John Kotter's decades of research show that 70% of organisational change efforts fail due to predictable, avoidable errors. His 8-Step model for leading change has been adopted by organisations from Google to the UN. This topic is a practical workshop in the psychology and process of change leadership, with case studies from African social movements and institutions that have successfully navigated structural transformation.",
        resources: [
          {
            type: "article",
            title: "Leading Change: Why Transformation Efforts Fail",
            source: "Harvard Business Review — John Kotter",
            url: "https://hbr.org/1995/05/leading-change-why-transformation-efforts-fail-2",
            duration: "12 min read",
          },
          {
            type: "course",
            title: "Leading Organisational Change",
            source: "Coursera — Northwestern University",
            url: "https://www.coursera.org/learn/organisational-leadership",
            duration: "~5 hours",
          },
          {
            type: "video",
            title: "How to Lead Change",
            source: "TED Talks collection",
            url: "https://www.ted.com/topics/leadership",
            duration: "Collection",
          },
        ],
      },
      {
        id: 3,
        title: "Policy Advocacy & Civic Engagement",
        overview:
          "Effective leaders do not just run programmes — they shape the systems and policies that determine what is possible. Understanding how to engage with government, use evidence for advocacy, and mobilise civic power is increasingly essential for leaders in Africa. This topic draws on UN Democracy Fund resources, the African Union Youth Charter, and practical case studies of policy wins driven by young African advocates working at local, national, and continental levels.",
        resources: [
          {
            type: "guide",
            title: "Youth Civic Engagement Resources",
            source: "UN Democracy Fund",
            url: "https://www.undef.org/",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "African Youth Charter",
            source: "African Union",
            url: "https://au.int/en/treaties/african-youth-charter",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Democracy and Development",
            source: "Coursera — University of Toronto",
            url: "https://www.coursera.org/learn/democracy-development",
            duration: "~10 hours",
          },
        ],
      },
      {
        id: 4,
        title: "Systems Thinking for Social Change",
        overview:
          "Many intractable social problems — poverty, inequality, climate change — are systems problems. Piecemeal interventions fail because they address symptoms rather than root causes. MIT professor Donella Meadows' \"Thinking in Systems\" is the landmark text for understanding leverage points in complex systems. This topic equips you with systems mapping tools used by the United Nations, World Bank, and leading social change organisations to design interventions that create durable impact.",
        resources: [
          {
            type: "guide",
            title: "Systems Thinking Resources",
            source: "MIT System Dynamics Group",
            url: "https://system-dynamics.org/",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Systems Thinking in Public Health",
            source: "Coursera — Johns Hopkins University",
            url: "https://www.coursera.org/learn/systems-thinking",
            duration: "~8 hours",
          },
          {
            type: "article",
            title: "Systems Thinking for Social Change",
            source: "Stanford Social Innovation Review",
            url: "https://ssir.org/articles/entry/systems_thinking_for_social_change",
            duration: "15 min read",
          },
        ],
      },
    ],
  },

  {
    id: 7,
    phase: 2,
    title: "Project Execution",
    subtitle: "Deliver measurable results in your community",
    description:
      "Move from project planning to disciplined execution. Using Agile methodology, community engagement frameworks, and data-driven evaluation tools, you will learn to deliver high-quality results in complex community settings, demonstrate evidence-based impact, and begin planning how to scale your work from local success to broader change.",
    objectives: [
      "Apply Agile project management to community initiatives",
      "Design genuine community engagement processes",
      "Build data collection and impact evaluation systems",
      "Identify a credible pathway to scaling your project",
    ],
    weekRange: "Weeks 7–12",
    estimatedHours: 9,
    topics: [
      {
        id: 1,
        title: "Agile Project Management",
        overview:
          "Traditional project management is built for predictable, stable environments. Agile — born in software development and now used by the UN, USAID, and global NGOs — is designed for complex, uncertain, rapidly changing contexts. The Scrum framework lets small teams deliver high-quality results through short iterative cycles. This topic is a practical introduction to running your community project with Agile discipline, drawing on PMI and MIT Sloan resources.",
        resources: [
          {
            type: "guide",
            title: "Agile Practice Guide (Free Download)",
            source: "Project Management Institute (PMI)",
            url: "https://www.pmi.org/learning/library/agile-practice-guide",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Agile Development Specialisation",
            source: "Coursera — University of Virginia",
            url: "https://www.coursera.org/specializations/agile-development",
            duration: "~4 months",
          },
          {
            type: "guide",
            title: "MIT Sloan: Agile for Complex Organisations",
            source: "MIT Sloan Management Review",
            url: "https://sloanreview.mit.edu/tag/agile/",
            duration: "Reading list",
          },
        ],
      },
      {
        id: 2,
        title: "Community Engagement Strategies",
        overview:
          "The failure mode of most development projects is not poor execution — it is poor co-design. UNESCO and OECD research consistently shows that community-led projects achieve three times better sustainability than externally designed interventions. This topic covers the full spectrum from tokenistic consultation to genuine co-production, using the IAP2 Spectrum of Public Participation and case studies from high-performing community development programmes across Africa.",
        resources: [
          {
            type: "guide",
            title: "IAP2 Spectrum of Public Participation",
            source: "International Association for Public Participation",
            url: "https://www.iap2.org/page/pillars",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "Community Engagement Framework",
            source: "OECD",
            url: "https://www.oecd.org/gov/open-government/community-engagement.htm",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Community Organising and Power",
            source: "edX — Harvard Kennedy School",
            url: "https://www.edx.org/school/harvardx",
            duration: "~8 hours",
          },
        ],
      },
      {
        id: 3,
        title: "Data-Driven Decision Making",
        overview:
          "The gap between leaders who instinctively \"know what works\" and those who use data to prove it is increasingly where funding and influence flow. This topic covers the basics of programme evaluation, logical frameworks (LogFrames), theory of change, and how to use simple data collection to continuously improve your project and demonstrate impact to stakeholders and funders — drawing on World Bank and UNDP Monitoring & Evaluation frameworks.",
        resources: [
          {
            type: "guide",
            title: "Monitoring and Evaluation Framework",
            source: "World Bank M&E Resources",
            url: "https://www.worldbank.org/en/topic/measuringresults",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Data-Driven Decision Making",
            source: "Coursera — PricewaterhouseCoopers",
            url: "https://www.coursera.org/learn/decision-making",
            duration: "~8 hours",
          },
          {
            type: "guide",
            title: "UNDP Results-Based Management",
            source: "UNDP Evaluation Office",
            url: "https://erc.undp.org/",
            duration: "Reference",
          },
        ],
      },
      {
        id: 4,
        title: "Scaling Impact: From Local to Global",
        overview:
          "Stanford Social Innovation Review research identifies five pathways to scale: geographic expansion, replication, policy change, market dynamics, and platform or network effects. The transition from a successful local programme to scaled impact is one of the hardest challenges in social change. This topic uses case studies from African social enterprises, Ashoka Fellows, and Skoll Award winners to map the practical journey from community project to systemic change.",
        resources: [
          {
            type: "article",
            title: "Scaling Social Impact",
            source: "Stanford Social Innovation Review",
            url: "https://ssir.org/articles/entry/scaling_social_impact",
            duration: "15 min read",
          },
          {
            type: "guide",
            title: "Skoll Foundation: Scaling Innovation",
            source: "Skoll Foundation",
            url: "https://skoll.org/",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Social Entrepreneurship",
            source: "Coursera — Copenhagen Business School",
            url: "https://www.coursera.org/learn/social-entrepreneurship-cbs",
            duration: "~8 hours",
          },
        ],
      },
    ],
  },

  {
    id: 8,
    phase: 2,
    title: "Global Network Activation",
    subtitle: "Connect to the global development ecosystem",
    description:
      "Access and activate the global networks, institutions, and opportunities that amplify African leadership. You will develop fluency in international development systems, build strategic cross-sector partnerships, navigate cross-cultural communication with confidence, and identify specific pathways into the UN system and global youth leadership programmes.",
    objectives: [
      "Navigate the international development architecture",
      "Build and manage strategic multi-sector partnerships",
      "Communicate across cultures with confidence and competence",
      "Access UN youth programmes, fellowships, and global platforms",
    ],
    weekRange: "Weeks 13–18",
    estimatedHours: 8,
    topics: [
      {
        id: 1,
        title: "Global Citizenship & International Development",
        overview:
          "Being a global citizen means understanding how international systems — trade agreements, aid flows, multilateral institutions, climate commitments — shape local realities across Africa. This topic gives you a working knowledge of how the international development architecture operates: from the UN system and World Bank to bilateral donors, private foundations, and impact investors. With this knowledge, you can navigate and leverage these systems rather than simply being subject to them.",
        resources: [
          {
            type: "guide",
            title: "How the UN System Works",
            source: "United Nations — Official Guide",
            url: "https://www.un.org/en/about-us/un-system",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Global Development: Interdisciplinary Perspectives",
            source: "Coursera — University of California San Diego",
            url: "https://www.coursera.org/learn/global-development",
            duration: "~7 hours",
          },
          {
            type: "guide",
            title: "World Bank — International Development Primer",
            source: "World Bank",
            url: "https://www.worldbank.org/en/understanding-poverty",
            duration: "Reference",
          },
        ],
      },
      {
        id: 2,
        title: "Building Strategic Partnerships",
        overview:
          "No single organisation can solve systemic challenges alone. The most effective African leaders build ecosystems of partners — governments, NGOs, universities, private sector, and diaspora. This topic covers the architecture of strategic partnerships: how to identify complementary partners, negotiate win-win agreements, manage multi-stakeholder coalitions, and build the trust infrastructure that sustains long-term collaboration across institutional, cultural, and sectoral boundaries.",
        resources: [
          {
            type: "article",
            title: "Managing Alliances with the Alliance Scorecard",
            source: "Harvard Business Review",
            url: "https://hbr.org/2007/09/managing-alliances-with-the-alliance-scorecard",
            duration: "12 min read",
          },
          {
            type: "guide",
            title: "UNDP Partnership Framework",
            source: "UNDP",
            url: "https://www.undp.org/partnerships",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Successful Negotiation: Essential Strategies",
            source: "Coursera — University of Michigan",
            url: "https://www.coursera.org/learn/negotiation-skills",
            duration: "~17 hours",
          },
        ],
      },
      {
        id: 3,
        title: "Cross-Cultural Communication",
        overview:
          "Africa's 54 countries, over 3,000 languages, and extraordinary cultural diversity make cross-cultural communication competence essential for any leader working at continental or global scale. Dutch social psychologist Geert Hofstede's cultural dimensions framework and Erin Meyer's \"The Culture Map\" provide evidence-based tools for navigating cultural differences. This topic is practical and scenario-based, using real examples from pan-African and international leadership contexts.",
        resources: [
          {
            type: "video",
            title: "The Danger of a Single Story",
            source: "TED Talks — Chimamanda Ngozi Adichie",
            url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
            duration: "19 min",
          },
          {
            type: "course",
            title: "Intercultural Communication and Conflict Resolution",
            source: "Coursera — University of California",
            url: "https://www.coursera.org/learn/intercultural-communication",
            duration: "~9 hours",
          },
          {
            type: "article",
            title: "Cross-Cultural Communication Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/cross-cultural-management",
            duration: "Reading list",
          },
        ],
      },
      {
        id: 4,
        title: "UN Youth Programmes & Global Opportunities",
        overview:
          "The United Nations system offers one of the most powerful platforms for young leaders from developing countries — if you know how to access it. This topic is a practical guide to the UN Youth Delegate Programme, UNESCO Youth Programme, UNDP Youth Advisory Panels, ECOSOC Youth Forum, and the constellation of fellowships, internships, and grants that the UN system offers specifically to young African leaders committed to the 2030 Agenda.",
        resources: [
          {
            type: "guide",
            title: "UN Youth Delegate Programme",
            source: "United Nations — Youth",
            url: "https://www.un.org/en/academic-impact/youth-delegate-programme",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "UN Youth Empowerment Programmes",
            source: "UNDP Youth",
            url: "https://www.undp.org/youth",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "Opportunities for Youth at the UN",
            source: "UN DESA — Youth",
            url: "https://www.un.org/development/desa/youth/",
            duration: "Reference",
          },
        ],
      },
    ],
  },

  {
    id: 9,
    phase: 2,
    title: "Career Pathway & Placement",
    subtitle: "Chart your high-impact career trajectory",
    description:
      "Design a post-programme career pathway that maximises your potential for positive impact. You will use Oxford University's evidence-based career planning frameworks, gain a practical guide to the world's most competitive scholarships and fellowships, and build the interview and storytelling skills that unlock doors at global institutions.",
    objectives: [
      "Map a high-impact career trajectory using evidence-based frameworks",
      "Prepare competitive applications for top African and global scholarships",
      "Build a system for continuous professional development",
      "Communicate your leadership story powerfully in interviews",
    ],
    weekRange: "Weeks 19–24",
    estimatedHours: 9,
    topics: [
      {
        id: 1,
        title: "Career Mapping for Social Impact",
        overview:
          "80,000 Hours — a research organisation at Oxford University — has spent a decade analysing which careers have the most positive impact on the world. Their findings challenge conventional career wisdom and provide evidence-based frameworks for choosing a path that aligns values, skills, and opportunity. This topic helps you map your post-EGA career trajectory using these tools alongside African-specific pathways in development, government, social enterprise, and academia.",
        resources: [
          {
            type: "guide",
            title: "Career Planning for Social Impact",
            source: "80,000 Hours — Oxford University (Free)",
            url: "https://80000hours.org/career-guide/",
            duration: "Self-paced",
          },
          {
            type: "guide",
            title: "Careers in Development",
            source: "UNDP",
            url: "https://www.undp.org/jobs",
            duration: "Reference",
          },
          {
            type: "course",
            title: "Career Success Specialisation",
            source: "Coursera — University of California",
            url: "https://www.coursera.org/specializations/career-success",
            duration: "~4 months",
          },
        ],
      },
      {
        id: 2,
        title: "Scholarships & Fellowship Applications",
        overview:
          "Africa produces extraordinary talent that the world's top universities actively want to recruit — but only for students who can navigate the competitive application process. This topic is a practical workshop covering high-value scholarships and fellowships: Chevening, Rhodes, Fulbright, Mastercard Foundation, Commonwealth, Mo Ibrahim, and DAAD. It includes real application strategies, essay frameworks, and interview preparation insights from successful African scholarship recipients.",
        resources: [
          {
            type: "guide",
            title: "Chevening Scholarships — Application Guide",
            source: "UK Government / Chevening",
            url: "https://www.chevening.org/scholarships/",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "Mastercard Foundation Scholars Programme",
            source: "Mastercard Foundation",
            url: "https://mastercardfdn.org/all/scholars/",
            duration: "Reference",
          },
          {
            type: "guide",
            title: "Mo Ibrahim Foundation: Scholarship & Leadership",
            source: "Mo Ibrahim Foundation",
            url: "https://mo.ibrahim.foundation/",
            duration: "Reference",
          },
        ],
      },
      {
        id: 3,
        title: "Professional Development & Continuous Learning",
        overview:
          "The average professional today will hold 12 different jobs in their lifetime. Building a mindset and practice of continuous learning is no longer optional — it is the core professional skill of the 21st century. This topic covers building a personal learning system, using LinkedIn Learning effectively, leveraging MOOCs and micro-credentials from top global universities, and participating in professional communities of practice — with a focus on platforms accessible to African professionals.",
        resources: [
          {
            type: "course",
            title: "Learning How to Learn",
            source: "Coursera — McMaster University (World's most enrolled MOOC)",
            url: "https://www.coursera.org/learn/learning-how-to-learn",
            duration: "~15 hours",
          },
          {
            type: "course",
            title: "Free Online Courses from MIT, Harvard, and more",
            source: "edX",
            url: "https://www.edx.org/",
            duration: "Self-paced",
          },
          {
            type: "guide",
            title: "Professional Development Resources",
            source: "LinkedIn Learning (Free with LinkedIn)",
            url: "https://www.linkedin.com/learning/",
            duration: "Self-paced",
          },
        ],
      },
      {
        id: 4,
        title: "Interview Skills & Personal Storytelling",
        overview:
          "Your leadership story — told well — is your most powerful career asset. Harvard Kennedy School research shows that candidates who frame their experience as a coherent narrative are 42% more likely to be selected over equally qualified candidates who simply list credentials. This topic covers the STAR interview method, behavioural interview frameworks, salary negotiation, and the art of authentic storytelling that conveys your values, impact, and potential to any audience.",
        resources: [
          {
            type: "video",
            title: "The Danger of a Single Story",
            source: "TED Talks — Chimamanda Ngozi Adichie",
            url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
            duration: "19 min",
          },
          {
            type: "article",
            title: "Interview Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/interviewing",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Successful Career Development",
            source: "Coursera — University System of Georgia",
            url: "https://www.coursera.org/learn/career-development",
            duration: "~8 hours",
          },
        ],
      },
    ],
  },

  {
    id: 10,
    phase: 2,
    title: "Graduation & Legacy",
    subtitle: "Define the impact you will leave behind",
    description:
      "Synthesise your EGA journey into a compelling impact narrative, set goals for your post-programme chapter, and activate your role in the EGA alumni network as a leader who mentors others. This final module is about converting everything you have learned into a clear, committed, and courageous next step for your leadership journey.",
    objectives: [
      "Document and communicate your EGA impact with evidence",
      "Articulate a clear legacy intention for your leadership",
      "Engage actively with the EGA alumni network",
      "Set a specific 90-day action plan for your post-programme chapter",
    ],
    weekRange: "Weeks 25–26",
    estimatedHours: 6,
    topics: [
      {
        id: 1,
        title: "Documenting Your Impact",
        overview:
          "At the end of your EGA journey, you should have a clear, evidence-based record of your contributions, growth, and outcomes — not just for personal satisfaction, but as the raw material of your career narrative, grant applications, and future advocacy. This topic covers impact documentation frameworks, the art of writing compelling leadership case studies, and how to use your EGA portfolio to demonstrate measurable change to funders, employers, and the communities you serve.",
        resources: [
          {
            type: "guide",
            title: "Logic Model Development Guide",
            source: "W.K. Kellogg Foundation (Free)",
            url: "https://www.wkkf.org/resource-directory/resources/2004/01/logic-model-development-guide",
            duration: "Reference",
          },
          {
            type: "article",
            title: "Impact Measurement Resources",
            source: "Stanford Social Innovation Review",
            url: "https://ssir.org/articles/category/metrics",
            duration: "Reading list",
          },
          {
            type: "course",
            title: "Storytelling and Influencing",
            source: "Coursera — Macquarie University",
            url: "https://www.coursera.org/learn/communicate-persuasively",
            duration: "~5 hours",
          },
        ],
      },
      {
        id: 2,
        title: "Legacy Planning: What Will You Leave Behind?",
        overview:
          "The greatest leaders think not about their tenure, but about the institutions, movements, and cultures they leave behind. Nelson Mandela, Wangari Maathai, and Kofi Annan built legacies that outlasted their roles by decades. This topic draws on Harvard Business School research on leader legacy and the work of organisational theorist Karl Weick to help you articulate the long-term contribution you intend to make to your community, sector, and continent.",
        resources: [
          {
            type: "video",
            title: "I Will Not Die an Unlived Life",
            source: "TED Talks",
            url: "https://www.ted.com/topics/personal-growth",
            duration: "TED collection",
          },
          {
            type: "article",
            title: "What Leaders Really Do",
            source: "Harvard Business Review — John Kotter",
            url: "https://hbr.org/2001/12/what-leaders-really-do",
            duration: "10 min read",
          },
          {
            type: "course",
            title: "Leadership Communication for Maximum Impact",
            source: "Coursera — Northwestern University",
            url: "https://www.coursera.org/learn/leadership-communication-max-impact-storytelling",
            duration: "~5 hours",
          },
        ],
      },
      {
        id: 3,
        title: "The EGA Alumni Network",
        overview:
          "Your EGA cohort is not just your classmates — it is the beginning of a lifelong professional network of leaders committed to Africa's sustainable development. The EGA Alumni Network connects graduates across every cohort for collaborative projects, mentorship, job referrals, and collective advocacy. This topic introduces how to engage with the network, how to mentor future cohorts, and how to leverage the collective intelligence of the EGA community to amplify your individual impact.",
        resources: [
          {
            type: "article",
            title: "Why Alumni Networks Matter More Than Ever",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/networking",
            duration: "Reading list",
          },
          {
            type: "guide",
            title: "Using LinkedIn to Activate Alumni Networks",
            source: "LinkedIn Learning (Free)",
            url: "https://www.linkedin.com/learning/topics/alumni",
            duration: "Self-paced",
          },
          {
            type: "guide",
            title: "Community of Practice Framework",
            source: "World Bank — Knowledge Management",
            url: "https://www.worldbank.org/en/topic/knowledgemanagement",
            duration: "Reference",
          },
        ],
      },
      {
        id: 4,
        title: "Your Next Chapter: 90-Day Action Plan",
        overview:
          "Research from Columbia University shows that people who set specific post-programme goals within 72 hours of completing a learning experience retain 65% more of what they learned and are three times more likely to apply new skills. This final topic helps you design a clear, committed 90-day action plan — identifying your first post-EGA leadership challenge, the accountability structures you will use, and the support network you will activate to keep you moving forward.",
        resources: [
          {
            type: "video",
            title: "How to Stop Screwing Yourself Over",
            source: "TEDx — Mel Robbins",
            url: "https://www.ted.com/talks/mel_robbins_how_to_stop_screwing_yourself_over",
            duration: "21 min",
          },
          {
            type: "course",
            title: "The Science of Well-Being",
            source: "Coursera — Yale University (Most enrolled Yale course ever)",
            url: "https://www.coursera.org/learn/the-science-of-well-being",
            duration: "~19 hours",
          },
          {
            type: "article",
            title: "Goal Setting Topic Hub",
            source: "Harvard Business Review",
            url: "https://hbr.org/topic/goal-setting",
            duration: "Reading list",
          },
        ],
      },
    ],
  },
]

export const PHASE_LABELS: Record<1 | 2, string> = {
  1: "Month 1",
  2: "Month 2",
}

export const PHASE_TITLES: Record<1 | 2, string> = {
  1: "Foundations & Discovery",
  2: "Advanced Practice & Impact",
}

export const TOTAL_TOPICS = CURRICULUM.reduce((sum, m) => sum + m.topics.length, 0)
