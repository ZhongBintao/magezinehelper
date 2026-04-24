import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Download, CheckCircle } from "lucide-react";
import { Magazine } from "./MagazineCard";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  magazine: Magazine | null;
  language: 'zh' | 'en';
}

export function DownloadDialog({ open, onOpenChange, magazine, language }: DownloadDialogProps) {
  if (!magazine) return null;

  const translations = {
    zh: {
      title: "下载杂志",
      description: "您即将下载以下杂志：",
      tip: "下载提示",
      tips: [
        "此杂志为高清PDF格式，文件大小约为 15-20 MB",
        "下载后请使用PDF阅读器打开",
        "建议在WiFi环境下下载以节省流量",
        "下载的内容仅供个人学习和研究使用"
      ],
      confirm: "确认下载",
      cancel: "取消"
    },
    en: {
      title: "Download Magazine",
      description: "You are about to download:",
      tip: "Download Tips",
      tips: [
        "This magazine is in high-definition PDF format, approximately 15-20 MB",
        "Please use a PDF reader to open after downloading",
        "It is recommended to download via WiFi to save data",
        "Downloaded content is for personal study and research only"
      ],
      confirm: "Confirm Download",
      cancel: "Cancel"
    }
  };

  const t = translations[language];

  const handleDownload = () => {
    // 这里添加实际的下载逻辑
    console.log("Downloading:", magazine.title[language]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Magazine Info */}
          <div className="flex gap-4 p-4 rounded-xl bg-gray-50">
            <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              <img 
                src={magazine.image} 
                alt={magazine.title[language]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-gray-900 leading-tight">
                {magazine.title[language]}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {magazine.description[language]}
              </p>
              <p className="text-xs text-gray-500">{magazine.date}</p>
            </div>
          </div>

          {/* Download Tips */}
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {t.tip}
            </h5>
            <ul className="space-y-2">
              {t.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white gap-2"
          >
            <Download className="h-4 w-4" />
            {t.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
