import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";

export const metadata: Metadata = {
  title: "ペットの生涯飼育費＆月間維持費シミュレーター | マゼンタラボ",
  description: "犬・猫の生涯飼育費と月々の固定生活費を見える化。フードグレード,消耗品,ライフステージ別の医療費・ワクチン接種費用をリアルタイム計算。",
  keywords: ["ペット生涯費用", "犬を飼う費用", "猫の生涯コスト", "ペット月間固定費", "動物ワクチン接種代", "マゼンタラボ"],
  openGraph: {
    title: "ペットの生涯飼育費＆月間維持費シミュレーター | マゼンタラボ",
    description: "年齢別に適した予防医療費を含めた、愛犬・愛猫の生涯累計コストをリアルタイム算出。",
    url: "https://www.magentalabblog.com/ja/petcare-expenses-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 生涯飼育費計算機",
      }
    ]
  }
};

export default function PetcareExpensesCalculatorPageJa() {
  return (
    <div className="bg-slate-50 pb-20">
      <PetcareExpensesCalculator lang="ja" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" lang="ja" />
      </div>
    </div>
  );
}
