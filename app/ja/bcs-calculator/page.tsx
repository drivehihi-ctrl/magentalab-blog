import type { Metadata } from "next";
import BCSCalculator from "@/components/BCSCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペットの肥満度(BCS)＆ダイエットカロリー計算機 | マゼンタラボ",
  description: "犬・猫の体重、去勢避妊有無、活動量、BCS 9段階を元に、1日の推奨カロリー(DER/RER)と適正な給餌量(g)を自動計算します。獣医学的食事療法標準。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/bcs-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/bcs-calculator",
      en: "https://www.magentalabblog.com/en/bcs-calculator",
      ja: "https://www.magentalabblog.com/ja/bcs-calculator",
    },
  },
  keywords: ["ペット肥満度計算", "犬カロリー計算", "猫カロリー計算", "犬のダイエット", "猫のダイエット", "RER計算機", "DER計算機", "BCS 9段階", "キャットフード計算", "マゼンタラボ"],
  openGraph: {
    title: "ペットの肥満度(BCS)＆ダイエットカロリー計算機 | マゼンタラボ",
    description: "愛犬・愛猫の体型(BCS 9段階)に合わせた、1日の目標消費カロリーと給餌量を無料リアルタイム判定。",
    url: "https://www.magentalabblog.com/ja/bcs-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ ペットBCS計算機",
      }
    ]
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function BcsCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for BCS (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <BCSCalculator lang="ja" />
      
      <SeoArticle title="犬と猫のボディ・コンディション・スコア（BCS）とは？">
        <p>
          ボディ・コンディション・スコア（BCS）は、犬や猫の体脂肪状態と体型を評価するために、獣医臨床で広く使用されている標準化された評価方法です。体重計に表示される数値だけでは、ペットが痩せすぎなのか、適正体重なのか、肥満なのかを正確に判断するのは困難です。骨格の大きさや品種、体型によって適正体重は全く異なるからです。
        </p>
        <p>
          BCSは、視覚的に体型全体を観察し、肋骨や脊椎、腰の周りなどを手で触って脂肪層の厚さを確認することで評価します。一般的に使用される9段階のBCSスケールでは、1（極度の削痩）から9（極度の肥満）まで体型を分類します。
        </p>
        <p>
          通常、BCS 4〜5/9程度が理想的な範囲と評価されます。理想的な体型では、肋骨が過度に突き出て見えることはなく、手で比較的簡単に触れることができます。上から見ると腰のくびれが確認でき、横から見ると腹部が適度に吊り上がっている（タックアップ）状態です。
        </p>
        <p>
          ただし、適正なBCSはペットの種類、年齢、品種、筋肉量、健康状態によって評価が異なる場合があるため、正確な判断が必要な場合は、獣医師による身体検査を一緒に受けることをお勧めします。
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">なぜダイエットとカロリー管理（DER/RER）が重要なのでしょうか？</h3>
        <p>
          ペットの肥満は単なる体型の問題ではなく、多くの病気のリスク増加や生活の質の低下に影響を与える重要な健康問題です。過度な体重は関節や靭帯にかかる負担を増加させ、変形性関節症をはじめとする一部の整形外科疾患のリスクや症状の悪化に関連する可能性があります。
        </p>
        <p>
          また、肥満は特に猫においてインスリン抵抗性や糖尿病のリスク増加と関連しており、ペットによっては呼吸器や心血管系にさらなる負担をかけることがあります。したがって、適正体重を維持することは、単に外見を管理することではなく、長期的な健康管理の重要な要素です。
        </p>
        <p>
          特に、過体重または肥満の猫が突然食事を食べなくなったり、過度に急激なカロリー制限を受けたりすると、体内の脂肪が過剰に肝臓に移動し、猫の肝リピドーシス（脂肪肝）が発生する危険性があります。猫の肝リピドーシスは治療が必要な深刻な病気であるため、肥満猫の減量は無理に進めてはいけません。
        </p>
        <p>
          安全な減量のためには、現在の給与量を任意に大幅に減らすのではなく、目標体重、現在のBCS、活動量、避妊・去勢の有無、年齢などを考慮して、1日の必要カロリーの初期目標を設定することが重要です。
        </p>
        <p>
          RER（安静時エネルギー要求量）は、ペットが安定した状態で生命を維持するために必要な基本的なエネルギー要求量を推定した値であり、これを基に活動量やライフステージ、減量の目的などを考慮して実際の1日の給与カロリーを調整することができます。
        </p>
        <p>
          計算によって得られたカロリーは絶対的な値ではなく、体重管理の出発点として使用することをお勧めします。実際の体重の変化とBCSを定期的に確認しながら給与量を調整することで、より安全に目標体重に近づくことができます。
        </p>
        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>獣医学的免責条項:</strong> 本計算機は、WSAVA、AAHA、APOPなどが提示するペットの体型評価およびエネルギー要求量に関する獣医学資料を参考にして作成されました。ただし、計算結果は一般的な参考値であり、個々のペットの品種、年齢、活動量、避妊・去勢の有無、筋肉量、および甲状腺機能低下症・クッシング症候群・糖尿病などの基礎疾患によって実際のエネルギー要求量は異なる場合があります。特に肥満猫の急激な食事制限は肝リピドーシスのリスクを高める可能性があるため、減量プログラムを開始する前にかかりつけの獣医師に相談することを強く推奨します。
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="bcs" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
