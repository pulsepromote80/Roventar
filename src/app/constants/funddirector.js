"use client"
import {
  FaRobot,
  FaBolt,
  FaDollarSign,
  FaEthereum,
  FaChartLine,
} from "react-icons/fa";
import { CheckCircle, Clock, Play } from "lucide-react";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Wallet, Bitcoin } from "lucide-react";
import {
  RiGlobalLine,
  RiBuildingLine,
  RiBrainLine,
  RiWallet3Line,
  RiQrCodeLine,
  RiShieldCheckLine,
  RiCalendarLine,
} from "react-icons/ri";

export const menuItemsForMobile = [
  {
    label: "Dashboard",
    href: "/pages/dashboard",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public",
  },
  {
    label: "Browse Agents",
    href: "/pages/browser-agents",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c72bec26-dba2-4af8-9217-59d8cf651300/public",
  },
  {
    label: "Fund Director",
    href: "/pages/fund-director",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/880cd4e3-a53a-41d4-30bb-425298d5cd00/public",
  },

  {
    label: "Events",
    href: "/pages/event-booking",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c7bd12cc-b142-4472-8e01-de3841d4af00/public",
  },

  {
    label: "Analytics",
    href: "/pages/analytics",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/2068afbc-3671-4a55-9cab-e3c909cc5300/public",
  },
  {
    label: "Affiliate",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c50cc896-48bc-4309-33fa-fbfae3b0ef00/public",
    isDropdown: true,
    dropdownItems: [
      { label: "AI Business Hub", href: "/pages/ai-business-hub" },
      { label: "My Direct Network", href: "/pages/my-direct-network" },
      { label: "Team Growth Matrix", href: "/pages/team-growth-matrix" },
      { label: "Intelligent Tree View", href: "/pages/intelligent-tree-view" },
    ],
  },
  {
    label: "Reports",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/f13c779d-1591-41c4-ca52-9d51708fc100/public",
    isDropdown: true,
    dropdownItems: [
      { label: "Income Report", href: "/pages/transaction-history" },
      { label: "Wallet Manager", href: "/pages/reports" },
      { label: "My Agents", href: "/pages/my-agents" },
    ],
  },
];



export const menuItems = [

  {
    label: "Dashboard",
    href: "/pages/dashboard",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public",
  },
  {
    label: "Browse Agents",
    href: "/pages/browser-agents",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c72bec26-dba2-4af8-9217-59d8cf651300/public",
  },

  {
    label: "Fund Director",
    href: "/pages/fund-director",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/880cd4e3-a53a-41d4-30bb-425298d5cd00/public",
  },

  {
    label: "Events",
    href: "/pages/event-booking",
    img:  "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c7bd12cc-b142-4472-8e01-de3841d4af00/public",
  },

  {
    label: "Analytics",
    href: "/pages/analytics",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/2068afbc-3671-4a55-9cab-e3c909cc5300/public",
  },
  {
    label: "Affiliate",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/c50cc896-48bc-4309-33fa-fbfae3b0ef00/public",
    isDropdown: true,
    dropdownItems: [
      { label: "AI Business Hub", href: "/pages/ai-business-hub" },
      { label: "My Direct Network", href: "/pages/my-direct-network" },
      {
        label: "Team Growth Matrix",
        href: "/pages/team-growth-matrix",
      },
      { label: "Intelligent Tree View", href: "/pages/intelligent-tree-view" },
    ],
  },
  {
    label: "Reports",
    img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/f13c779d-1591-41c4-ca52-9d51708fc100/public",
    isDropdown: true,
    dropdownItems: [
      { label: "Income Report", href: "/pages/transaction-history" },
      { label: "Wallet Manager", href: "/pages/reports" },
      { label: "My Agents", href: "/pages/my-agents" },
    ],
  },
];

export const FundRequestColumns = [
  {
    accessorKey: "id",
    header: "#",
    cell: (info) => <center>{info.getValue()}</center>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (info) => <center>{info.getValue()}</center>,
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => <center>{info.getValue()}</center>,
  },

  {
    accessorKey: "transactionHash",
    header: "Transaction Hash",
    cell: (info) => <center>{info.getValue()}</center>,
  },
  {
    accessorKey: "mode",
    header: "Payment Mode",
    cell: (info) => <center>{info.getValue()}</center>,
  },

  {
    accessorKey: "adminRemark",
    header: "Remark",
    cell: (info) => <center>{info.getValue()}</center>,
  },
  {
    accessorKey: "rf_Status",
    header: "Status",
    cell: (info) => <center className="text-red-600">{info.getValue()}</center>,
  },
];

export const paymentModes = [
  { value: "", label: "Select Type" },
  { value: "1", label: "BEP20 USDT" },
  { value: "2", label: "TRC20 USDT" },
];

export const fundDirectorTabs = [
  { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "deposit", label: "Self Deposit" },
  // { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "fundRequest", label: "Fund Request" },
  { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "instant", label: "Income Transfer" },
  // { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "userTransfer", label: "P2P Transfer" },
  { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "withdraw", label: "Withdrawal" },
];

export const countries = [
  { value: "", label: "Select Country", code: "" },
  { value: "1", label: "AF Afghanistan", code: "+93" },
  { value: "2", label: "AL Albania", code: "+355" },
  { value: "3", label: " AL Algeria", code: "+213" },
  { value: "4", label: " IN India", code: "+91" },
  { value: "5", label: "US United States", code: "+1" },
  { value: "6", label: "UK United Kingdom", code: "+44" },
  { value: "7", label: "CA Canada", code: "+1" },
  { value: "8", label: "AU Australia", code: "+61" },
  { value: "9", label: "CH China", code: "+86" },
  { value: "10", label: "JA Japan", code: "+81" },
  { value: "230", label: "ZI Zimbabwe" },
];

export const performanceIncomeTable = [
  {
    id: 1,
    Level: "first",
    title: "Agent Explorer",
    leftAmount: "$10K",
    rightAmount: "$10K",
    rewards: "$100 * 10 Months",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 2,
    Level: "Second",
    title: "Tech Pioneer",
    leftAmount: "$25K",
    rightAmount: "$25K",
    rewards: "$250 * 10 Months",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 3,
    Level: "Third",
    title: "Automation Architect",
    leftAmount: "$50K",
    rightAmount: "$50K",
    rewards: "$500 * 10 Months",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 4,
    Level: "fourth",
    title: "Intelligence Innovator",
    leftAmount: "$100K",
    rightAmount: "$100K",
    rewards: "$1200 * 10 Months",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 5,
    Level: "Fifth",
    title: "Revenue Ranger",
    leftAmount: "$200K",
    rightAmount: "$200K",
    rewards: "$2500 * 10 Months",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
];

export const ranks = [
  {
    id: 1,
    name: "Global Trainee",
    Income: "10%",
    DirectTeam: "2 Directs",
    SelfPackage: "$200",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    name: "Associate Partner",
    Income: "14%",
    DirectTeam: "1st Rank Holder 2 Ids",
    SelfPackage: "$500",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Elite Executive",
    Income: "18%",
    DirectTeam: "2nd Rank Holder 2 Ids",
    SelfPackage: "$1000",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 4,
    name: "Senior Strategist",
    Income: "22%",
    DirectTeam: "3rd Rank Holder 2 Ids",
    SelfPackage: "$1500",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 5,
    name: "Regional Director",
    Income: "26%",
    DirectTeam: "4th Rank Holder 2 Ids",
    SelfPackage: "$2000",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 6,
    name: "nternational Ambassador",
    Income: "30%",
    DirectTeam: "5th Rank Holder 2 Ids",
    SelfPackage: "$2500",
    status: "UnApproved",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: 7,
    name: "Premier Consultant",
    Income: "34%",
    DirectTeam: "6th Rank Holder 2 Ids",
    SelfPackage: "$300",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
  },
];

export const cards = [
  {
    title: "Active Agents",
    value: "0",
    change: "+2.5%",
    color: "text-gray-500",
    changeColor: "text-[#000000",
    icon: <FaRobot className="text-xl text-blue-500" />,
    bgIcon: "bg-[#ffffff]",
  },
  {
    title: "Total Revenue",
    value: "$0",
    change: "+12.3%",
    color: "text-gray-500",
    changeColor: "text-[#000000]",
    icon: <FaDollarSign className="text-xl text-green-500" />,
    bgIcon: "bg-[#d1fae5]",
  },
  {
    title: "Energy Usage",
    value: "0K",
    change: "+5.2%",
    color: "text-gray-500",
    changeColor: "text-[#000000]",
    icon: <FaBolt className="text-xl text-yellow-500" />,
    bgIcon: "bg-[#fef9c3]",
  },
  {
    title: "API Calls",
    value: "0K",
    change: "+8.1%",
    color: "text-gray-500",
    changeColor: "text-[#000000]",
    icon: <FaChartLine className="text-xl text-purple-500" />,
    bgIcon: "bg-[#f3e8ff]",
  },
];

export const data = [
  { time: "00:00", value1: 50, value2: 10 },
  { time: "04:00", value1: 20, value2: 5 },
  { time: "08:00", value1: 180, value2: 60 },
  { time: "12:00", value1: 240, value2: 70 },
  { time: "16:00", value1: 200, value2: 55 },
  { time: "20:00", value1: 120, value2: 40 },
];

export const deployments = [
  {
    title: "CodeGenerator v2",
    type: "deployment",
    badge: "completed",
    start: "May 15, 2024",
    end: "Jun 15, 2024",
    revenue: "$980.00",
    icon: <CheckCircle className="w-3 h-3" />,
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
  },
  {
    title: "DataAnalyzer Pro",
    type: "lease • Lessee: TechCorp",
    badge: "active",
    start: "Jun 01, 2024",
    end: "Jul 01, 2024",
    icon: <Play className="w-3 h-3" />,
    bg: "bg-emerald-100 dark:bg-emerald-900",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "NLP Assistant",
    type: "maintenance",
    badge: "active",
    start: "Jun 20, 2024",
    end: "Jun 22, 2024",
    icon: <Play className="w-3 h-3" />,
    bg: "bg-yellow-100 dark:bg-yellow-900",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  {
    title: "ImageAI Pro",
    type: "lease • Lessee: DesignStudio",
    badge: "scheduled",
    start: "Jul 01, 2024",
    end: "Aug 01, 2024",
    icon: <Clock className="w-3 h-3" />,
    bg: "bg-emerald-100 dark:bg-emerald-900",
    border: "border-emerald-200 dark:border-emerald-800",
  },
];

export const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1000 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 1400 },
  { month: "May", revenue: 1800 },
  { month: "Jun", revenue: 2100 },
  { month: "Jul", revenue: 2300 },
  { month: "Aug", revenue: 2500 },
];

export const energyData = [
  { name: "Data Analysis", value: 35, color: "#4285F4" },
  { name: "ML Training", value: 28, color: "#0F9D58" },
  { name: "Code Gen", value: 20, color: "#A142F4" },
  { name: "NLP", value: 12, color: "#FBBC05" },
  { name: "Other", value: 5, color: "#EA4335" },
];

export const tabs = [
  {
    id: "overview",
    label: "Performance Overview",
    icon: <BarChart3 className="w-4 h-4 mr-2" />,
  },
  {
    id: "timeline",
    label: "Deployment Timeline",
    icon: <Calendar className="w-4 h-4 mr-2" />,
  },
  {
    id: "insights",
    label: "AI Insights",
    icon: <TrendingUp className="w-4 h-4 mr-2" />,
  },
];

export const directMembers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    joinDate: "2024-01-10",
    status: "Active",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    joinDate: "2024-02-15",
    status: "Inactive",
  },
  {
    name: "Charlie Lee",
    email: "charlie@example.com",
    joinDate: "2024-03-05",
    status: "Active",
  },
];

export const summary = [
  { label: "Total Referrals", value: 24 },
  { label: "Total Earnings", value: "$1,250" },
  { label: "Team Size", value: 18 },
  { label: "Pending Payout", value: "$320" },
];

// Analytics  Tab
export const tools = [
  {
    id: 1,
    name: "Text Summarizer",
    description:
      "Summarizes long articles and documents into concise summaries.",
    energyUnits: 100,
    pricePerMonth: 10,
    image: "https://source.unsplash.com/featured/?ai,summary",
    rating: 4.7,
    tasksCompleted: 1200,
  },
  {
    id: 2,
    name: "Image Enhancer",
    description: "Enhances image quality using advanced AI algorithms.",
    energyUnits: 200,
    pricePerMonth: 15,
    image: "https://source.unsplash.com/featured/?ai,image",
    rating: 4.5,
    tasksCompleted: 950,
  },
  {
    id: 3,
    name: "Voice Cloner",
    description: "Clone voices for content creation and entertainment.",
    energyUnits: 300,
    pricePerMonth: 20,
    image: "https://source.unsplash.com/featured/?ai,voice",
    rating: 4.8,
    tasksCompleted: 800,
  },
  {
    id: 4,
    name: "Code Generator",
    description: "Generate code snippets and templates for various languages.",
    energyUnits: 150,
    pricePerMonth: 12,
    image: "https://source.unsplash.com/featured/?ai,code",
    rating: 4.6,
    tasksCompleted: 1100,
  },
];

export const sortOptions = [
  { value: "personalassistant", label: "Personal Assistant - $50 to $500" },
  { value: "entrepreneur", label: "Entrepreneur - $550 to $2000" },
  { value: "businessPro", label: "Business Pro - $2050 to $5000" },
  { value: "industrial", label: "Industrial - $5050 & Above" },
];

export const currencies = [
  {
    name: "USDT (BEP20)",
    network: "Binance Smart Chain",
    icon: <Wallet className="w-6 h-6 text-yellow-500" />,
    walletAddress: "0x414605B6b865134EFf97374a9B314cC6a4070Da4", // "0x08c7AD647f33EfbE861850aF0dd7F31ae36e3C33",
  },
  {
    name: "USDT (TRC20)",
    network: "TRON Network",
    icon: <Wallet className="w-6 h-6 text-yellow-500" />,
    walletAddress: "TDmd8uCkR38MYUGdUw2m4qYGyZ8tUPTjFK", // "TRir6abA1vicMsf7DBwjTioGNJhV4dWsi8",
  },
  {
    name: "Bitcoin",
    network: "Bitcoin Network",
    icon: <Bitcoin className="w-6 h-6 text-yellow-600" />,
    walletAddress: "bc1qucqwzhyts68385fdmj8dav7rx5ktjcnpwt4d2n",
  },
  {
    name: "Ethereum",
    network: "Ethereum Network",
    icon: <FaEthereum className="text-xl text-yellow-600" />,
    walletAddress: "0x08c7AD647f33EfbE861850aF0dd7F31ae36e3C33",
  },
];

export const treeData = [
  {
    name: "yvanoop",
    attributes: { sponsor: null, direct: 0, team: 0 },
    children: [
      {
        name: "yvanoop2",
        attributes: { sponsor: "yvanoop", direct: 0, team: 0 },
        children: [
          {
            name: "No User",
            attributes: { sponsor: "No Sponsor", direct: "-", team: "-" },
          },
          {
            name: "No User",
            attributes: { sponsor: "No Sponsor", direct: "-", team: "-" },
          },
        ],
      },
      {
        name: "No User",
        attributes: { sponsor: "No Sponsor", direct: "-", team: "-" },
      },
    ],
  },
];

export const flagMap = {
  'en': '🇺🇸', // English - United States
  'es': '🇪🇸', // Spanish - Spain
  'fr': '🇫🇷', // French - France
  'de': '🇩🇪', // German - Germany
  'it': '🇮🇹', // Italian - Italy
  'pt': '🇵🇹', // Portuguese - Portugal
  'ru': '🇷🇺', // Russian - Russia
  'ja': '🇯🇵', // Japanese - Japan
  'ko': '🇰🇷', // Korean - South Korea
  'zh-CN': '🇨🇳', // Chinese (Simplified) - China
  'zh-TW': '🇹🇼', // Chinese (Traditional) - Taiwan
  'ar': '🇸🇦', // Arabic - Saudi Arabia
  'hi': '🇮🇳', // Hindi - India
  'bn': '🇧🇩', // Bengali - Bangladesh
  'pa': '🇵🇰', // Punjabi - Pakistan
  'te': '🇮🇳', // Telugu - India
  'mr': '🇮🇳', // Marathi - India
  'ta': '🇮🇳', // Tamil - India
  'ur': '🇵🇰', // Urdu - Pakistan
  'gu': '🇮🇳', // Gujarati - India
  'kn': '🇮🇳', // Kannada - India
  'or': '🇮🇳', // Oriya - India
  'ml': '🇮🇳', // Malayalam - India
  'th': '🇹🇭', // Thai - Thailand
  'vi': '🇻🇳', // Vietnamese - Vietnam
  'id': '🇮🇩', // Indonesian - Indonesia
  'ms': '🇲🇾', // Malay - Malaysia
  'tl': '🇵🇭', // Filipino - Philippines
  'tr': '🇹🇷', // Turkish - Turkey
  'pl': '🇵🇱', // Polish - Poland
  'uk': '🇺🇦', // Ukrainian - Ukraine
  'ro': '🇷🇴', // Romanian - Romania
  'cs': '🇨🇿', // Czech - Czech Republic
  'sk': '🇸🇰', // Slovak - Slovakia
  'sl': '🇸🇮', // Slovenian - Slovenia
  'hr': '🇭🇷', // Croatian - Croatia
  'sr': '🇷🇸', // Serbian - Serbia
  'bg': '🇧🇬', // Bulgarian - Bulgaria
  'et': '🇪🇪', // Estonian - Estonia
  'lv': '🇱🇻', // Latvian - Latvia
  'lt': '🇱🇹', // Lithuanian - Lithuania
  'da': '🇩🇰', // Danish - Denmark
  'sv': '🇸🇪', // Swedish - Sweden
  'no': '🇳🇴', // Norwegian - Norway
  'fi': '🇫🇮', // Finnish - Finland
  'nl': '🇳🇱', // Dutch - Netherlands
  'be': '🇧🇾', // Belarusian - Belarus
  'ka': '🇬🇪', // Georgian - Georgia
  'hy': '🇦🇲', // Armenian - Armenia
  'az': '🇦🇿', // Azerbaijani - Azerbaijan
  'kk': '🇰🇿', // Kazakh - Kazakhstan
  'uz': '🇺🇿', // Uzbek - Uzbekistan
  'ky': '🇰🇬', // Kyrgyz - Kyrgyzstan
  'tg': '🇹🇯', // Tajik - Tajikistan
  'tk': '🇹🇲', // Turkmen - Turkmenistan
  'mn': '🇲🇳', // Mongolian - Mongolia
  'bo': '🇨🇳', // Tibetan - China
  'my': '🇲🇲', // Burmese - Myanmar
  'lo': '🇱🇦', // Lao - Laos
  'km': '🇰🇭', // Khmer - Cambodia
  'si': '🇱🇰', // Sinhala - Sri Lanka
  'ne': '🇳🇵', // Nepali - Nepal
  'dv': '🇲🇻', // Dhivehi - Maldives
  'am': '🇪🇹', // Amharic - Ethiopia
  'ti': '🇪🇷', // Tigrinya - Eritrea
  'om': '🇪🇹', // Oromo - Ethiopia
  'so': '🇸🇴', // Somali - Somalia
  'sw': '🇹🇿', // Swahili - Tanzania
  'rw': '🇷🇼', // Kinyarwanda - Rwanda
  'lg': '🇺🇬', // Luganda - Uganda
  'ny': '🇲🇼', // Chichewa - Malawi
  'zu': '🇿🇦', // Zulu - South Africa
  'xh': '🇿🇦', // Xhosa - South Africa
  'af': '🇿🇦', // Afrikaans - South Africa
  'st': '🇱🇸', // Sesotho - Lesotho
  'tn': '🇧🇼', // Setswana - Botswana
  'ts': '🇿🇦', // Xitsonga - South Africa
  've': '🇿🇦', // Tshivenda - South Africa
  'nr': '🇿🇦', // Ndebele - South Africa
  'ss': '🇸🇿', // Swati - Eswatini
  'yo': '🇳🇬', // Yoruba - Nigeria
  'ig': '🇳🇬', // Igbo - Nigeria
  'ha': '🇳🇬', // Hausa - Nigeria
  'ff': '🇸🇳', // Fulah - Senegal
  'bm': '🇲🇱', // Bambara - Mali
  'ee': '🇬🇭', // Ewe - Ghana
  'ak': '🇬🇭', // Akan - Ghana
  'tw': '🇬🇭', // Twi - Ghana
  'ga': '🇮🇪', // Irish - Ireland
  'gd': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', // Scottish Gaelic - Scotland
  'cy': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', // Welsh - Wales
  'br': '🇫🇷', // Breton - France
  'co': '🇫🇷', // Corsican - France
  'oc': '🇫🇷', // Occitan - France
  'ca': '🇪🇸', // Catalan - Spain
  'eu': '🇪🇸', // Basque - Spain
  'gl': '🇪🇸', // Galician - Spain
  'ast': '🇪🇸', // Asturian - Spain
  'an': '🇪🇸', // Aragonese - Spain
  'pt-BR': '🇧🇷', // Portuguese (Brazil) - Brazil
  'es-419': '🌎', // Spanish (Latin America) - Generic
  'fr-CA': '🇨🇦', // French (Canada) - Canada
  'en-GB': '🇬🇧', // English (UK) - United Kingdom
  'en-CA': '🇨🇦', // English (Canada) - Canada
  'en-AU': '🇦🇺', // English (Australia) - Australia
  'en-IN': '🇮🇳', // English (India) - India
  'zh-HK': '🇭🇰', // Chinese (Hong Kong) - Hong Kong
  'zh-MO': '🇲🇴', // Chinese (Macau) - Macau
  'zh-SG': '🇸🇬', // Chinese (Singapore) - Singapore
  'yue': '🇭🇰', // Cantonese - Hong Kong
  'hak': '🇨🇳', // Hakka - China
  'nan': '🇹🇼', // Min Nan - Taiwan
  'hsn': '🇨🇳', // Xiang - China
  'wuu': '🇨🇳', // Wu - China
  'gan': '🇨🇳', // Gan - China
  'za': '🇨🇳', // Zhuang - China
  'ii': '🇨🇳', // Yi - China
  'ug': '🇨🇳', // Uyghur - China
  'mn-Mong': '🇲🇳', // Mongolian (Traditional) - Mongolia
  'jv': '🇮🇩', // Javanese - Indonesia
  'su': '🇮🇩', // Sundanese - Indonesia
  'mad': '🇮🇩', // Madurese - Indonesia
  'btx': '🇮🇩', // Batak - Indonesia
  'bug': '🇮🇩', // Buginese - Indonesia
  'ace': '🇮🇩', // Acehnese - Indonesia
  'gor': '🇮🇩', // Gorontalo - Indonesia
  'min': '🇮🇩', // Minangkabau - Indonesia
  'bew': '🇮🇩', // Betawi - Indonesia
  'bjn': '🇮🇩', // Banjar - Indonesia
  'sas': '🇮🇩', // Sasak - Indonesia
  'mak': '🇮🇩', // Makasar - Indonesia
  'lbj': '🇮🇩', // Lak - Indonesia
  'aoz': '🇮🇩', // Uab Meto - Indonesia
  'kge': '🇮🇩', // Komering - Indonesia
  'ljp': '🇮🇩', // Lampung Api - Indonesia
  'blc': '🇨🇦', // Bella Coola - Canada
  'clc': '🇨🇦', // Chilcotin - Canada
  'crj': '🇨🇦', // Southern East Cree - Canada
  'crk': '🇨🇦', // Plains Cree - Canada
  'crl': '🇨🇦', // Northern East Cree - Canada
  'crm': '🇨🇦', // Moose Cree - Canada
  'csw': '🇨🇦', // Swampy Cree - Canada
  'cwd': '🇨🇦', // Woods Cree - Canada
  'dgr': '🇨🇦', // Dogrib - Canada
  'gwi': '🇨🇦', // Gwich'in - Canada
  'haa': '🇨🇦', // Han - Canada
  'hup': '🇨🇦', // Hupa - United States
  'ikt': '🇨🇦', // Inuinnaqtun - Canada
  'iku': '🇨🇦', // Inuktitut - Canada
  'ikt': '🇨🇦', // Inuinnaqtun - Canada
  'koy': '🇨🇦', // Koyukon - United States
  'moh': '🇨🇦', // Mohawk - Canada
  'nsk': '🇨🇦', // Naskapi - Canada
  'ojb': '🇨🇦', // Ojibwe - Canada
  'ojs': '🇨🇦', // Oji-Cree - Canada
  'oka': '🇨🇦', // Okanagan - Canada
  'slc': '🇨🇦', // Salish - Canada
  'srs': '🇨🇦', // Tsuut'ina - Canada
  'str': '🇨🇦', // Straits Salish - Canada
  'taa': '🇨🇦', // Lower Tanana - United States
  'tce': '🇨🇦', // Southern Tutchone - Canada
  'tfn': '🇨🇦', // Tanacross - United States
  'tgx': '🇨🇦', // Tagish - Canada
  'tht': '🇨🇦', // Tahltan - Canada
  'tlc': '🇨🇦', // Tlingit - Canada
  'tli': '🇨🇦', // Tlingit - United States
  'too': '🇨🇦', // Totonac - Mexico
  'ttr': '🇨🇦', // Tutchone - Canada
  'tuk': '🇨🇦', // Tukudh - Canada
  'tux': '🇨🇦', // Tutchone - Canada
  'twi': '🇨🇦', // Twi - Canada
  'woa': '🇨🇦', // Tyaraity - Canada
  'xal': '🇷🇺', // Kalmyk - Russia
  'yuf': '🇨🇦', // Yug - Canada
  'yur': '🇨🇦', // Yurok - United States
  'yux': '🇨🇦', // Southern Yukon - Canada
  'yuz': '🇨🇦', // Yurats - Canada
  'yuw': '🇨🇦', // Yauyos Quechua - Peru
  'yva': '🇨🇦', // Yawa - Canada
  'yvt': '🇨🇦', // Yavitero - Venezuela
  'ywa': '🇨🇦', // Kalou - Vanuatu
  'ywl': '🇨🇦', // Western Lalu - China
  'ywq': '🇨🇦', // Wuding-Luquan Yi - China
  'yws': '🇨🇦', // Wumeng Yi - China
  'ywt': '🇨🇦', // Xishanba Lalo - China
  'ywu': '🇨🇦', // Wusa Yi - China
  'yww': '🇨🇦', // Yawanawa - Brazil
  'yxa': '🇨🇦', // Mayangna - Nicaragua
  'yxg': '🇨🇦', // Yagara - Australia
  'yxl': '🇨🇦', // Yardliyawarra - Australia
  'yxm': '🇨🇦', // Yinwum - Papua New Guinea
  'yxn': '🇨🇦', // Yandruwandha - Australia
  'yxo': '🇨🇦', // Angan - Papua New Guinea
  'yxp': '🇨🇦', // Phuma - Laos
  'yxq': '🇨🇦', // Yinchia - China
  'yxr': '🇨🇦', // Yoron - Japan
  'yxs': '🇨🇦', // Sanumá - Brazil
  'yxt': '🇨🇦', // Sinicahua Mixtec - Mexico
  'yxu': '🇨🇦', // Yuyu - China
  'yxv': '🇨🇦', // Warawarna - Australia
  'yxw': '🇨🇦', // Mayi-Yapi - Australia
  'yxx': '🇨🇦', // Mayi-Kulan - Australia
  'yxy': '🇨🇦', // Yabula Yabula - Australia
  'yxz': '🇨🇦', // Yarli - Australia
  'yyz': '🇨🇦', // Ayizi - China
  'yza': '🇨🇦', // Tundra Yukaghir - Russia
  'yzg': '🇨🇦', // E'ma Buyang - China
  'yzk': '🇨🇦', // Zokhuo - China
  'yzn': '🇨🇦', // Yongbei Zhuang - China
  'yzo': '🇨🇦', // Yongnan Zhuang - China
  'yzt': '🇨🇦', // Sinicahua Mixtec - Mexico
  'yzu': '🇨🇦', // Yugur - China
  'yzw': '🇨🇦', // Zyphe - China
  'yzz': '🇨🇦', // Ayu - China
  'zaa': '🇲🇽', // Sierra de Juárez Zapotec - Mexico
  'zab': '🇲🇽', // San Juan Guelavía Zapotec - Mexico
  'zac': '🇲🇽', // Ocotlán Zapotec - Mexico
  'zad': '🇲🇽', // Cajonos Zapotec - Mexico
  'zae': '🇲🇽', // Yareni Zapotec - Mexico
  'zaf': '🇲🇽', // Ayoquesco Zapotec - Mexico
  'zag': '🇲🇽', // Zaghawa - Chad
  'zah': '🇲🇽', // Zangskari - India
  'zai': '🇲🇽', // Isthmus Zapotec - Mexico
  'zaj': '🇲🇽', // Zaramo - Tanzania
  'zak': '🇲🇽', // Zanaki - Tanzania
  'zal': '🇲🇽', // Zauzou - Myanmar
  'zam': '🇲🇽', // Miahuatlán Zapotec - Mexico
  'zao': '🇲🇽', // Ozolotepec Zapotec - Mexico
  'zap': '🇲🇽', // Zapotec - Mexico
  'zaq': '🇲🇽', // Aloápam Zapotec - Mexico
  'zar': '🇲🇽', // Rincón Zapotec - Mexico
  'zas': '🇲🇽', // Santo Domingo Albarradas Zapotec - Mexico
  'zat': '🇲🇽', // Tabaa Zapotec - Mexico
  'zau': '🇲🇽', // Zangskari - India
  'zav': '🇲🇽', // Yatzachi Zapotec - Mexico
  'zaw': '🇲🇽', // Mitla Zapotec - Mexico
  'zax': '🇲🇽', // Xadani Zapotec - Mexico
  'zay': '🇲🇽', // Zaysete - Ethiopia
  'zaz': '🇲🇽', // Zari - Nigeria
  'zba': '🇲🇽', // Bala - Nigeria
  'zbc': '🇲🇽', // Central Berawan - Malaysia
  'zbe': '🇲🇽', // East Berawan - Malaysia
  'zbl': '🇲🇽', // Blissymbols - International
  'zbt': '🇲🇽', // Batui - Indonesia
  'zbu': '🇲🇽', // Bu - Indonesia
  'zbw': '🇲🇽', // West Berawan - Malaysia
  'zca': '🇲🇽', // Coatecas Altas Zapotec - Mexico
  'zch': '🇲🇽', // Central Hongshuihe Zhuang - China
  'zdj': '🇲🇽', // Ngazidja Comorian - Comoros
  'zea': '🇳🇱', // Zeeuws - Netherlands
  'zeg': '🇲🇽', // Zenag - Papua New Guinea
  'zeh': '🇲🇽', // Eastern Hongshuihe Zhuang - China
  'zen': '🇲🇱', // Zenaga - Mauritania
  'zga': '🇲🇽', // Kinga - Tanzania
  'zgb': '🇲🇽', // Guibei Zhuang - China
  'zgh': '🇲🇦', // Standard Moroccan Tamazight - Morocco
  'zgm': '🇲🇽', // Minz Zhuang - China
  'zgn': '🇲🇽', // Guibian Zhuang - China
  'zgr': '🇲🇽', // Magori - Tanzania
  'zhb': '🇲🇽', // Zhaba - China
  'zhd': '🇲🇽', // Dai Zhuang - China
  'zhi': '🇲🇽', // Zhire - Ghana
  'zhn': '🇲🇽', // Nong Zhuang - China
  'zhw': '🇲🇽', // Zhoa - China
  'zhx': '🇲🇽', // Chinese - China
  'zia': '🇲🇽', // Zia - Nigeria
  'zib': '🇲🇽', // Zimbabwe Sign Language - Zimbabwe
  'zik': '🇲🇽', // Zimakani - Papua New Guinea
  'zil': '🇲🇽', // Zialo - Sierra Leone
  'zim': '🇲🇽', // Mesme - Ethiopia
  'zin': '🇲🇽', // Zinza - Tanzania
  'zir': '🇲🇽', // Ziriya - Nigeria
  'ziw': '🇲🇽', // Zigula - Tanzania
  'ziz': '🇲🇽', // Zizilivakan - Turkey
  'zka': '🇲🇽', // Kaimbulawa - Papua New Guinea
  'zkb': '🇲🇽', // Koibal - Russia
  'zkd': '🇲🇽', // Kadu - Myanmar
  'zkg': '🇲🇽', // Koguryo - Korea
  'zkh': '🇲🇽', // Khorezmian - Uzbekistan
  'zkk': '🇲🇽', // Karankawa - United States
  'zkn': '🇲🇽', // Kanan - Indonesia
  'zko': '🇲🇽', // Kott - Russia
  'zkp': '🇲🇽', // São Paulo Kaingáng - Brazil
  'zkr': '🇲🇽', // Zakhring - India
  'zkt': '🇲🇽', // Kitan - China
  'zku': '🇲🇽', // Kaurna - Australia
  'zkv': '🇲🇽', // Krevinian - Russia
  'zkz': '🇲🇽', // Khazar - Russia
  'zlj': '🇲🇽', // Liujiang Zhuang - China
  'zlm': '🇲🇾', // Malay - Malaysia
  'zln': '🇲🇽', // Lianshan Zhuang - China
  'zlq': '🇲🇽', // Liuqian Zhuang - China
  'zma': '🇲🇽', // Manda - Tanzania
  'zmb': '🇲🇽', // Zimba - Angola
  'zmc': '🇲🇽', // Margany - Australia
  'zmd': '🇲🇽', // Maridan - Australia
  'zme': '🇲🇽', // Mangerr - Australia
  'zmf': '🇲🇽', // Mfinu - Nigeria
  'zmg': '🇲🇽', // Marti Ke - Papua New Guinea
  'zmh': '🇲🇽', // Makolkol - Papua New Guinea
  'zmi': '🇲🇽', // Negeri Sembilan Malay - Malaysia
  'zmj': '🇲🇽', // Maridjabin - Australia
  'zmk': '🇲🇽', // Mandandanyi - Australia
  'zml': '🇲🇽', // Madngele - Cameroon
  'zmm': '🇲🇽', // Marimanindji - Australia
  'zmn': '🇲🇽', // Mbangwe - Zimbabwe
  'zmo': '🇲🇽', // Molo - Chad
  'zmp': '🇲🇽', // Mpuono - Angola
  'zmq': '🇲🇽', // Mituku - Angola
  'zmr': '🇲🇽', // Maranunggu - Australia
  'zms': '🇲🇽', // Mbesa - Angola
  'zmt': '🇲🇽', // Maringarr - Australia
  'zmu': '🇲🇽', // Muruwari - Australia
  'zmv': '🇲🇽', // Mbariman-Gudhinma - Australia
  'zmw': '🇲🇽', // Mbo - Cameroon
  'zmx': '🇲🇽', // Bomitaba - Angola
  'zmy': '🇲🇽', // Mariyedi - Australia
  'zmz': '🇲🇽', // Mbandja - Angola
  'zna': '🇲🇽', // Zan Gula - Angola
  'zne': '🇲🇽', // Zande - Central African Republic
  'zng': '🇲🇽', // Mang - China
  'znk': '🇲🇽', // Manangkari - Australia
  'zns': '🇲🇽', // Mangas - Indonesia
  'zoc': '🇲🇽', // Copainalá Zoque - Mexico
  'zoh': '🇲🇽', // Chimalapa Zoque - Mexico
  'zom': '🇮🇳', // Zou - India
  'zoo': '🇲🇽', // Asunción Mixtepec Zapotec - Mexico
  'zoq': '🇲🇽', // Tabasco Zoque - Mexico
  'zor': '🇲🇽', // Rayón Zoque - Mexico
  'zos': '🇲🇽', // Francisco León Zoque - Mexico
  'zpa': '🇲🇽', // Lachiguiri Zapotec - Mexico
  'zpb': '🇲🇽', // Yautepec Zapotec - Mexico
  'zpc': '🇲🇽', // Choapan Zapotec - Mexico
  'zpd': '🇲🇽', // Southeastern Ixtlán Zapotec - Mexico
  'zpe': '🇲🇽', // Petapa Zapotec - Mexico
  'zpf': '🇲🇽', // San Pedro Quiatoni Zapotec - Mexico
  'zpg': '🇲🇽', // Guevea de Humboldt Zapotec - Mexico
  'zph': '🇲🇽', // Totomachapan Zapotec - Mexico
  'zpi': '🇲🇽', // Santa María Quiegolani Zapotec - Mexico
  'zpj': '🇲🇽', // Quiavicuzas Zapotec - Mexico
  'zpk': '🇲🇽', // Tlacolulita Zapotec - Mexico
  'zpl': '🇲🇽', // Lachixío Zapotec - Mexico
  'zpm': '🇲🇽', // Mixtepec Zapotec - Mexico
  'zpn': '🇲🇽', // Santa Inés Yatzechi Zapotec - Mexico
  'zpo': '🇲🇽', // Amatlán Zapotec - Mexico
  'zpp': '🇲🇽', // El Alto Zapotec - Mexico
  'zpq': '🇲🇽', // Zoogocho Zapotec - Mexico
  'zpr': '🇲🇽', // Santiago Xanica Zapotec - Mexico
  'zps': '🇲🇽', // Coatlán Zapotec - Mexico
  'zpt': '🇲🇽', // San Vicente Coatlán Zapotec - Mexico
  'zpu': '🇲🇽', // Yalálag Zapotec - Mexico
  'zpv': '🇲🇽', // Chichicapan Zapotec - Mexico
  'zpw': '🇲🇽', // Zaniza Zapotec - Mexico
  'zpx': '🇲🇽', // San Baltazar Loxicha Zapotec - Mexico
  'zpy': '🇲🇽', // Mazatlán Villa de Flores Zapotec - Mexico
  'zpz': '🇲🇽', // Texmelucan Zapotec - Mexico
  'zqe': '🇲🇽', // Qiubei Zhuang - China
  'zra': '🇲🇽', // Kara - Nigeria
  'zrg': '🇲🇽', // Mirgan - Iraq
  'zrn': '🇲🇽', // Zirenkel - Mali
  'zro': '🇲🇽', // Záparo - Peru
  'zrp': '🇲🇽', // Zarphatic - Armenia
  'zrs': '🇲🇽', // Mairasi - Indonesia
  'zsa': '🇲🇽', // Sarasira - Vanuatu
  'zsk': '🇲🇽', // Kaskean - Russia
  'zsl': '🇲🇽', // Zambian Sign Language - Zambia
  'zsm': '🇲🇾', // Standard Malay - Malaysia
  'zsr': '🇲🇽', // Southern Rincon Zapotec - Mexico
  'zsu': '🇲🇽', // Sukurum - Nigeria
  'zte': '🇲🇽', // Elotepec Zapotec - Mexico
  'ztg': '🇲🇽', // Xanaguía Zapotec - Mexico
  'ztl': '🇲🇽', // Lapaguía-Guivini Zapotec - Mexico
  'ztm': '🇲🇽', // San Agustín Mixtepec Zapotec - Mexico
  'ztn': '🇲🇽', // Santa Catarina Albarradas Zapotec - Mexico
  'ztp': '🇲🇽', // Loxicha Zapotec - Mexico
  'ztq': '🇲🇽', // Quioquitani-Quierí Zapotec - Mexico
  'zts': '🇲🇽', // Tilquiapan Zapotec - Mexico
  'ztt': '🇲🇽', // Tejalapan Zapotec - Mexico
  'ztu': '🇲🇽', // Güilá Zapotec - Mexico
  'ztx': '🇲🇽', // Zaachila Zapotec - Mexico
  'zty': '🇲🇽', // Yatee Zapotec - Mexico
  'zua': '🇲🇽', // Zeem - Cameroon
  'zuh': '🇲🇽', // Tokano - Papua New Guinea
  'zul': '🇿🇦', // Zulu - South Africa
  'zum': '🇲🇽', // Kumzari - Oman
  'zun': '🇺🇸', // Zuni - United States
  'zuy': '🇲🇽', // Zumaya - Colombia
  'zwa': '🇲🇽', // Zay - Ethiopia
  'zxx': '🌍', // No linguistic content - Generic
  'zya': '🇲🇽', // Zhuang - China
  'zyb': '🇲🇽', // Yongbei Zhuang - China
  'zyg': '🇲🇽', // Yang Zhuang - China
  'zyj': '🇲🇽', // Youjiang Zhuang - China
  'zyn': '🇲🇽', // Yongnan Zhuang - China
  'zyp': '🇲🇽', // Zyphe - China
  'zza': '🇹🇷', // Zaza - Turkey
  'zzj': '🇲🇽', // Zuojiang Zhuang - China
};



export const pastEvents = [
  {
    id: 4,
    title: "Blockchain Technology Conference 2023",
    date: "Dec 10, 2023 at 10:00 AM",
    location: "Los Angeles Convention Center",
    organizer: "CryptoTech Events",
    price: "$199",
    seats: "Sold Out",
    seatsColor: "text-gray-400",
    type: "Venue",
    typeColor: "bg-indigo-600",
    featured: false,
    image:
      "https://readdy.ai/api/search-image?query=Blockchain%20conference%20stage%20with%20modern%20setup%2C%20blue%20lighting%2C%20technology%20displays%2C%20corporate%20audience%2C%20sleek%20presentation%20screens%2C%20futuristic%20atmosphere%2C%20business%20professional%20environment%2C%20dark%20blue%20theme&width=400&height=250&seq=blockchain-conf&orientation=landscape",
    icon: <RiBuildingLine className="mr-1" />,
  },
  {
    id: 5,
    title: "Web Development Bootcamp",
    date: "Nov 15, 2023 at 09:00 AM",
    location: "Online Event",
    organizer: "CodeMasters Academy",
    price: "$99",
    seats: "Sold Out",
    seatsColor: "text-gray-400",
    type: "Online",
    typeColor: "bg-blue-600",
    featured: false,
    image:
      "https://readdy.ai/api/search-image?query=Web%20development%20online%20bootcamp%20setup%20with%20professional%20presenter%2C%20modern%20home%20office%2C%20multiple%20screens%20showing%20code%2C%20blue%20accent%20lighting%2C%20clean%20minimalist%20background%2C%20professional%20video%20call%20environment&width=400&height=250&seq=web-dev-bootcamp&orientation=landscape",
    icon: <RiGlobalLine className="mr-1" />,
  },
  {
    id: 6,
    title: "Data Science Workshop",
    date: "Oct 20, 2023 at 01:00 PM",
    location: "Seattle Tech Center",
    organizer: "Data Insights Inc.",
    price: "$149",
    seats: "Sold Out",
    seatsColor: "text-gray-400",
    type: "Venue",
    typeColor: "bg-indigo-600",
    featured: false,
    image:
      "https://readdy.ai/api/search-image?query=Data%20science%20workshop%20stage%20with%20modern%20presentation%20setup%2C%20audience%20seating%2C%20professional%20lighting%2C%20blue%20accent%20colors%2C%20innovation%20hub%20atmosphere%2C%20analytical%20environment%2C%20sleek%20modern%20venue&width=400&height=250&seq=data-science-workshop&orientation=landscape",
    icon: <RiBuildingLine className="mr-1" />,
  },
];

export const featuredEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Summit 2024",
    date: "Mar 15, 2024 at 09:00 AM",
    location: "San Francisco Convention Center",
    organizer: "TechCorp Events",
    price: "$299",
    seats: "45 seats left",
    seatsColor: "text-red-400",
    type: "Venue",
    typeColor: "bg-indigo-600",
    featured: true,
    image:
      "https://readdy.ai/api/search-image?query=Professional%20AI%20and%20machine%20learning%20conference%20with%20modern%20stage%20setup%2C%20blue%20lighting%2C%20technology%20displays%2C%20corporate%20audience%2C%20sleek%20presentation%20screens%2C%20futuristic%20atmosphere%2C%20business%20professional%20environment%2C%20dark%20blue%20theme&width=400&height=250&seq=ai-summit&orientation=landscape",
    icon: <RiBuildingLine className="mr-1" />,
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    date: "Mar 20, 2024 at 02:00 PM",
    location: "Online Event",
    organizer: "Marketing Pro Academy",
    price: "$149",
    seats: "120 seats left",
    seatsColor: "text-green-400",
    type: "Online",
    typeColor: "bg-blue-600",
    featured: true,
    image:
      "https://readdy.ai/api/search-image?query=Digital%20marketing%20online%20webinar%20setup%20with%20professional%20presenter%2C%20modern%20home%20office%2C%20multiple%20screens%20showing%20analytics%2C%20blue%20accent%20lighting%2C%20clean%20minimalist%20background%2C%20professional%20video%20call%20environment&width=400&height=250&seq=marketing-class&orientation=landscape",
    icon: <RiGlobalLine className="mr-1" />,
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    date: "Mar 25, 2024 at 06:00 PM",
    location: "Innovation Hub NYC",
    organizer: "Startup Accelerator",
    price: "$75",
    seats: "8 seats left",
    seatsColor: "text-red-400",
    type: "Venue",
    typeColor: "bg-indigo-600",
    featured: true,
    image:
      "https://readdy.ai/api/search-image?query=Startup%20pitch%20competition%20stage%20with%20modern%20presentation%20setup%2C%20audience%20seating%2C%20professional%20lighting%2C%20blue%20accent%20colors%2C%20innovation%20hub%20atmosphere%2C%20entrepreneurial%20environment%2C%20sleek%20modern%20venue&width=400&height=250&seq=startup-pitch&orientation=landscape",
    icon: <RiBuildingLine className="mr-1" />,
  },
];

export const aiFeatures = [
  {
    id: 1,
    title: "Smart Recommendations",
    description:
      "AI-powered event suggestions based on your interests and booking history",
    icon: <RiBrainLine className="text-3xl text-white" />,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: 2,
    title: "Integrated Wallet",
    description:
      "Seamless payments with your Rentelligence wallet balance and instant transactions",
    icon: <RiWallet3Line className="text-3xl text-white" />,
    gradient: "from-indigo-600 to-blue-500",
  },
  {
    id: 3,
    title: "Digital Tickets",
    description:
      "Instant e-tickets with QR codes for quick entry and easy management",
    icon: <RiQrCodeLine className="text-3xl text-white" />,
    gradient: "from-purple-600 to-indigo-500",
  },
  {
    id: 4,
    title: "Secure Booking",
    description:
      "Enterprise-grade security with encrypted transactions and data protection",
    icon: <RiShieldCheckLine className="text-3xl text-white" />,
    gradient: "from-green-600 to-blue-500",
  },
];

export const event = {
  id: 1,
  title: "AI & Machine Learning Summit 2024",
  date: "Friday, March 15, 2024",
  time: "09:00 AM - 06:00 PM",
  location: "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103",
  organizer: "TechCorp Events",
  seats: "62 seats remaining",
  image: "/AiandMachineLearning.jpg",
  description: "Join industry leaders and innovators for a comprehensive exploration of the latest advances in artificial intelligence and machine learning. This summit features keynote presentations, hands-on workshops, and networking opportunities with top professionals in the field.",
  features: [
    "Expert-led sessions",
    "Hands-on workshops",
    "Networking opportunities",
    "Digital materials included",
    "Certificate of attendance",
    "Refreshments"
  ],
  schedule: [
    { time: "09:00 AM", event: "Registration & Welcome Coffee" },
    { time: "10:00 AM", event: "Keynote: The Future of AI" },
    { time: "11:30 AM", event: "Panel: Machine Learning in Practice" },
    { time: "01:00 PM", event: "Lunch & Networking" },
    { time: "02:30 PM", event: "Workshop: Building AI Models" },
    { time: "04:00 PM", event: "Industry Case Studies" },
    { time: "05:30 PM", event: "Closing Remarks & Networking" }
  ],
};

export const faqData = [
  {
    question: "What is AI Rentelligence?",
    answer: "AI Rentelligence is a platform that leverages artificial intelligence to provide intelligent tools, agents, and analytics for businesses and individuals. It helps in automating processes, gaining insights, and enhancing productivity through AI-powered solutions."
  },
  {
    question: "How do I get started with AI Rentelligence?",
    answer: "To get started, sign up for an account on our platform. Once registered, you can explore various AI tools, set up your dashboard, and begin using our services. If you need assistance, visit our support page or contact our help center."
  },
  {
    question: "What AI tools are available on the platform?",
    answer: "We offer a range of AI tools including AI business hubs, browser agents, intelligent tree views, analytics dashboards, and more. Each tool is designed to cater to different needs such as data analysis, automation, and decision-making."
  },
  {
    question: "How do I manage my account and profile?",
    answer: "You can manage your account by navigating to the settings page. There, you can update your profile information, change your password, and adjust other preferences. For security, we recommend enabling two-factor authentication."
  },
  {
    question: "What should I do if I encounter an issue or need support?",
    answer: "If you face any issues, first check our support page for troubleshooting guides. You can also submit a ticket through the support section or contact us directly via the contact form. Our team is here to help!"
  },
  {
    question: "Is my data secure on AI Rentelligence?",
    answer: "Yes, we prioritize data security. All data is encrypted, and we comply with industry standards for privacy and protection. For more details, refer to our Privacy Policy."
  },
  {
    question: "How can I participate in events or bookings?",
    answer: "You can browse and book events through the event-booking section. Check the event dashboard for upcoming events, and follow the instructions to register or purchase tickets."
  },
  {
    question: "What are the benefits of using AI agents?",
    answer: "AI agents automate repetitive tasks, provide real-time insights, and enhance efficiency. They can handle data processing, customer interactions, and more, allowing you to focus on strategic decisions."
  },
  {
    question: "How do I view my transaction history and reports?",
    answer: "Access your transaction history and reports from the reports section. You can filter by date, type, and other criteria to get detailed insights into your activities."
  },
  {
    question: "Can I integrate AI Rentelligence with other tools?",
    answer: "Yes, our platform supports integrations with various third-party tools and APIs. Check the documentation or contact support for guidance on setting up integrations."
  }
];


export const BASE_URL = "https://apis.rentelligence.online/api";