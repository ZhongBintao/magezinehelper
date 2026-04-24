import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LanguageSwitcherProps {
  currentLanguage: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100 transition-all duration-200">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">
            {currentLanguage === 'zh' ? '中文' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-gray-200">
        <DropdownMenuItem 
          onClick={() => onLanguageChange('zh')}
          className={currentLanguage === 'zh' ? 'bg-gray-100' : ''}
        >
          中文
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-gray-100' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}