import {
  UtensilsCrossed,
  NotebookPen,
  BarChart,
  CalendarCheck,
  BookMarked,
  ChartNoAxesCombined,
  CalendarClock,
  ToggleLeft,
  Wand2,
} from "lucide-react";

export const HeroFeatures = [
  {
    coming: false,
    icon: UtensilsCrossed,
    title: "Nutrition Library",
    text: "Access thousands of foods with detailed nutrition information",
  },
  {
    coming: false,
    icon: NotebookPen,
    title: "Mood Journal",
    text: "Track your thoughts and feelings daily with reflections.",
  },
  {
    coming: false,
    icon: CalendarClock,
    title: "Personal Planner",
    text: "Access thousands of foods with detailed nutrition information",
  },
  {
    coming: false,
    icon: ToggleLeft,
    title: "Personalisation",
    text: "Choose whether you want to focus on mood reflection, meal tracking, or both. Your journey, your way",
  },
  {
    coming: true,
    icon: BarChart,
    title: "Mood Analysis",
    text: "Understand how your emotions affect your eating habits",
  },
  {
    coming: true,
    icon: Wand2,
    title: "Smart Suggestions",
    text: "AI-powered meal plans aligned with your goals and diet type.",
  },
];
export const features = [
  {
    title: "Comprehensive Food Library",
    description:
      "Access our extensive database of pre-defined foods with complete nutritional information. No more guessing - get accurate data for thousands of ingredients and meals.",
    color: "var(--color-primary)",
    image:
      "https://readdy.ai/api/search-image?query=Colorful%20healthy%20food%20bowl%20with%20fresh%20fruits%20vegetables%20nuts%20and%20grains%2C%20vibrant%20rainbow%20colors%20like%20the%20emoji%20bowl%2C%20nutritious%20meal%20with%20apple%20strawberry%20blueberries%20leafy%20greens%2C%20clean%20white%20background%2C%20food%20photography%20style%20with%20soft%20natural%20lighting&width=400&height=300&seq=food-library-bowl&orientation=landscape",
  },
  {
    title: "Personalized Calorie Planning",
    description:
      "Get a customized nutrition plan tailored to your age, weight, activity level, and health goals. Our smart algorithm adapts as you progress on your wellness journey.",
    color: "var(--color-secondary)",
    image:
      "https://readdy.ai/api/search-image?query=Health%20and%20fitness%20planning%20setup%20with%20colorful%20measuring%20tools%20scales%20nutritional%20charts%2C%20vibrant%20wellness%20planning%20interface%20with%20fruits%20vegetables%20in%20background%2C%20bright%20cheerful%20colors%20promoting%20healthy%20lifestyle%20choices&width=400&height=300&seq=personal-planner-health&orientation=landscape",
  },
  {
    title: "Daily Tracking & Calendar",
    description:
      "Keep track of your meals and mood reflections with our intuitive calendar view. See patterns emerge and understand your habits over time.",
    color: "var(--color-accent)",
    image:
      "https://readdy.ai/api/search-image?query=Digital%20wellness%20calendar%20with%20colorful%20healthy%20food%20icons%20and%20happy%20mood%20indicators%2C%20bright%20cheerful%20interface%20showing%20daily%20meal%20tracking%20with%20fresh%20fruits%20vegetables%2C%20organized%20healthy%20lifestyle%20planning%20with%20vibrant%20colors&width=400&height=300&seq=calendar-wellness&orientation=landscape",
  },
  {
    title: "Mood & Food Connection",
    description:
      "Discover how your emotional state influences your food choices. Our analysis helps you identify patterns and make healthier decisions based on your feelings.",
    color: "var(--color-primary)",
    image:
      "https://readdy.ai/api/search-image?query=Happy%20healthy%20lifestyle%20concept%20with%20colorful%20fresh%20foods%20and%20positive%20emotion%20symbols%2C%20brain%20health%20and%20nutrition%20connection%20visualization%2C%20vibrant%20fruits%20vegetables%20promoting%20mental%20wellness%2C%20cheerful%20bright%20atmosphere&width=400&height=300&seq=mood-brain-food&orientation=landscape",
  },
  {
    title: "Lifestyle Blog & Tips",
    description:
      "Access our curated blog with expert advice on nutrition, mental wellness, and lifestyle management. Learn from professionals and community success stories.",
    color: "var(--color-secondary)",
    image:
      "https://readdy.ai/api/search-image?query=Wellness%20lifestyle%20blog%20interface%20with%20fresh%20green%20plants%20healthy%20foods%20and%20inspiring%20health%20content%2C%20natural%20organic%20elements%20with%20vibrant%20vegetables%20fruits%2C%20clean%20modern%20design%20promoting%20healthy%20living%20tips&width=400&height=300&seq=lifestyle-wellness-blog&orientation=landscape",
  },
  {
    title: "Detailed Analytics",
    description:
      "Visualize your progress with comprehensive charts and insights. Understanding your patterns helps you make informed decisions about your health.",
    color: "var(--color-accent)",
    image:
      "https://readdy.ai/api/search-image?query=Health%20analytics%20dashboard%20with%20colorful%20charts%20showing%20wellness%20progress%2C%20vibrant%20data%20visualization%20with%20fresh%20healthy%20foods%20in%20background%2C%20modern%20interface%20displaying%20nutrition%20and%20mood%20tracking%20statistics%20with%20bright%20cheerful%20colors&width=400&height=300&seq=health-analytics&orientation=landscape",
  },
];
export const CTAitems = [
  {
    text: "Complete nutrition database",
    icon: UtensilsCrossed,
  },
  {
    text: "Personalized meal planning",
    icon: NotebookPen,
  },
  { text: "Mood tracking & analysis", icon: BarChart },
  {
    text: "Daily reflection calendar",
    icon: CalendarCheck,
  },
  { text: "Expert lifestyle tips", icon: BookMarked },
  { text: "Progress analytics", icon: ChartNoAxesCombined },
];

export const footerLinks = [
  {
    id: "footer-features",
    title: "Features",
    links: [
      { name: "Nutrition Tracking", href: "#" },
      { name: "Mood Analysis", href: "#" },
      { name: "Meal Planning", href: "#" },
      { name: "Calendar View", href: "#" },
      { name: "Progress Analytics", href: "#" },
    ],
  },
  {
    id: "footer-support",
    title: "Support(examples)",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
];
