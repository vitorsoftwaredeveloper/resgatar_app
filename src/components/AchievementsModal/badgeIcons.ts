import {
  AlarmClock,
  AudioLines,
  Award,
  BadgeCheck,
  Clapperboard,
  BookMarked,
  BookOpen,
  Compass,
  Crown,
  Ear,
  Footprints,
  Gem,
  Gift,
  GraduationCap,
  Hand,
  HandHeart,
  Headphones,
  Heart,
  Library,
  Medal,
  Mountain,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Trophy,
  User,
  UserCircle,
  Video,
  Youtube,
  type LucideIcon,
} from "lucide-react-native";

// Maps the service-level `iconId` to a concrete icon component, keeping the
// BadgeService free of UI dependencies.
const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  star: Star,
  sparkles: Sparkles,
  medal: Medal,
  crown: Crown,
  sunrise: Sunrise,
  "book-open": BookOpen,
  mountain: Mountain,
  gem: Gem,
  // contribution badges
  "hand-coins": Medal,
  shield: Shield,
  "shield-check": ShieldCheck,
  trophy: Trophy,
  diamond: Gem,
  // donation badges
  "hand-heart": HandHeart,
  heart: Heart,
  hands: Hand,
  gift: Gift,
  // profile badges
  user: User,
  "user-circle": UserCircle,
  "badge-check": BadgeCheck,
  // audio badges
  headphones: Headphones,
  ear: Ear,
  "audio-lines": AudioLines,
  // complete reading badges
  "book-marked": BookMarked,
  library: Library,
  "graduation-cap": GraduationCap,
  // early bird badges
  "alarm-clock": AlarmClock,
  sun: Sun,
  // tutorial badge
  compass: Compass,
  // video badges
  video: Video,
  clapperboard: Clapperboard,
  youtube: Youtube,
};

export function badgeIcon(iconId: string): LucideIcon {
  return ICONS[iconId] ?? Award;
}
