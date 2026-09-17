import { BriefcaseBusiness, Car, House, Landmark, MoreHorizontal, Sparkles, Utensils } from "lucide-react";

const icons = { BriefcaseBusiness, Car, House, Landmark, MoreHorizontal, Sparkles, Utensils };
export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? MoreHorizontal;
  return <Icon className={className} strokeWidth={1.8} />;
}
