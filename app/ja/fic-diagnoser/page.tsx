import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";

export const metadata: Metadata = {
  title: "猫の特発性膀胱炎(FIC)＆ストレス自律判定器 | マゼンタラボ",
  description: "猫의排尿トラブルや排泄姿勢から、特発性膀胱炎(FIC)リスクおよび心理的ストレスレベルを評価し、自宅での生活環境改善ガイドを提示します。",
  keywords: ["猫の特発性膀胱炎", "猫の尿路結石症状", "猫トイレ失敗原因", "猫ストレス解消", "マゼンタラボ"],
  openGraph: {
    title: "猫の特発性膀胱炎(FIC)＆ストレス自律判定器 | マゼンタラボ",
    description: "愛猫のトイレ環境や行動パターンからストレス指数をセルフ測定し、膀胱疾患の予防を図ります。",
    url: "https://www.magentalabblog.com/ja/fic-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 猫FIC膀胱炎診断器",
      }
    ]
  }
};

export default function FicDiagnoserPageJa() {
  return (
    <div className="bg-slate-50 pb-20">
      <FicDiagnoser lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" lang="ja" />
      </div>
    </div>
  );
}
