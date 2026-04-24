import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import {
  MagazineCard,
  Magazine,
} from "./components/MagazineCard";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { DownloadDialog } from "./components/DownloadDialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function App() {
  const [magazinesData, setMagazinesData] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [downloadDialogOpen, setDownloadDialogOpen] =
    useState(false);
  const [selectedMagazine, setSelectedMagazine] =
    useState<Magazine | null>(null);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-adc0d2a4/api/magazines`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
              apikey: publicAnonKey,
            },
          }
        );
        if (response.ok) {
          const json = await response.json();
          setMagazinesData(json.data || []);
        } else {
          console.error("Failed to fetch magazines:", response.status);
        }
      } catch (err) {
        console.error("Error fetching magazines:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  const translations = {
    zh: {
      title: "杂志精选",
      search: "搜索杂志...",
      filter: "筛选分类",
      sort: "排序",
      sortNewest: "最新优先",
      sortOldest: "最早优先",
      reset: "重置",
      all: "全部",
      fashion: "时尚",
      technology: "科技",
      travel: "旅行",
      food: "美食",
      business: "商业",
      lifestyle: "生活",
      noResults: "没有找到相关杂志",
    },
    en: {
      title: "Magazine Collection",
      search: "Search magazines...",
      filter: "Filter by category",
      sort: "Sort",
      sortNewest: "Newest First",
      sortOldest: "Oldest First",
      reset: "Reset",
      all: "All",
      fashion: "Fashion",
      technology: "Technology",
      travel: "Travel",
      food: "Food",
      business: "Business",
      lifestyle: "Lifestyle",
      noResults: "No magazines found",
    },
  };

  const t = translations[language];

  // 筛选杂志
  const filteredMagazines = useMemo(() => {
    return magazinesData.filter((magazine) => {
      // 分类筛选
      const categoryMatch =
        selectedCategory === "all" ||
        magazine.category === selectedCategory;

      // 搜索筛选
      const searchMatch =
        searchQuery === "" ||
        magazine.title[language]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        magazine.description[language]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        magazine.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, language, magazinesData]);

  // 排序杂志
  const sortedMagazines = useMemo(() => {
    return [...filteredMagazines].sort((a, b) => {
      if (sortOrder === "desc") {
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      } else {
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        );
      }
    });
  }, [filteredMagazines, sortOrder]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              {t.title}
            </h1>
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-600 hidden sm:block" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-gray-900">
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200">
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="fashion">
                    {t.fashion}
                  </SelectItem>
                  <SelectItem value="technology">
                    {t.technology}
                  </SelectItem>
                  <SelectItem value="travel">
                    {t.travel}
                  </SelectItem>
                  <SelectItem value="food">{t.food}</SelectItem>
                  <SelectItem value="business">
                    {t.business}
                  </SelectItem>
                  <SelectItem value="lifestyle">
                    {t.lifestyle}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex gap-2 items-center">
              <ArrowUpDown className="h-4 w-4 text-gray-600 hidden sm:block" />
              <Select
                value={sortOrder}
                onValueChange={setSortOrder}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-gray-900">
                  <SelectValue placeholder={t.sort} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200">
                  <SelectItem value="desc">
                    {t.sortNewest}
                  </SelectItem>
                  <SelectItem value="asc">
                    {t.sortOldest}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortOrder("desc");
              }}
              className="h-11 bg-gray-50 border-0 hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.reset}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Magazine Grid */}
        {!isLoading && sortedMagazines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedMagazines.map((magazine) => (
              <MagazineCard
                key={magazine.id}
                magazine={magazine}
                language={language}
                onDownload={() => {
                  setSelectedMagazine(magazine);
                  setDownloadDialogOpen(true);
                }}
              />
            ))}
          </div>
        ) : !isLoading && sortedMagazines.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl font-light">
              {t.noResults}
            </p>
          </div>
        ) : null}
      </main>

      {/* Download Dialog */}
      <DownloadDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        magazine={selectedMagazine}
        language={language}
      />
    </div>
  );
}