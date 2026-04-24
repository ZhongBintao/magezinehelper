import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

export interface Magazine {
  id: number;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  image: string;
  tags: string[];
  category: string;
  date: string;
}

interface MagazineCardProps {
  magazine: Magazine;
  language: "zh" | "en";
  onDownload: (magazine: Magazine) => void;
}

export function MagazineCard({
  magazine,
  language,
  onDownload,
}: MagazineCardProps) {
  const downloadText = language === "zh" ? "下载" : "Download";

  return (
    <Card className="group overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={magazine.image}
          alt={magazine.title[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <CardContent className="p-6 space-y-4 relative">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] text-gray-900">
          {magazine.title[language]}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {magazine.description[language]}
        </p>
        <div className="flex flex-wrap gap-2">
          {magazine.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500 font-medium">
            {magazine.date}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(magazine)}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 gap-1.5 transition-all duration-300"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">{downloadText}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}