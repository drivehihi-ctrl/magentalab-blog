import type { Metadata } from "next";
import DmCalculator from "@/components/DmCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペットフード乾物量(DM)栄養＆水分摂取量計算機 | マゼンタラボ",
  description: "キャットフード・ドッグフード表示の水分を除いた真の栄養構成比と、ペットの健康状態に適した1日の推奨飲水量を自動測定します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/dm-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/dm-calculator",
      en: "https://www.magentalabblog.com/en/dm-calculator",
      ja: "https://www.magentalabblog.com/ja/dm-calculator",
    },
  },
  keywords: ["フード乾物量計算", "犬の水分補給", "猫の飲水量", "キャットフード栄養基準", "ペット脱水予防", "マゼンタラボ"],
  openGraph: {
    title: "ペットフード乾物量(DM)栄養＆水分摂取量計算機 | マゼンタラボ",
    description: "製品ラベルから保証分析値を入力し、乾物基準(DM)への換算と個体ごとの理想的な必要水分量を調べます。",
    url: "https://www.magentalabblog.com/ja/dm-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ DM計算機",
      }
    ]
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function DmCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for DM (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <DmCalculator lang="ja" />
      
      <SeoArticle title="ペットフードの栄養成分を乾物基準（DM）に換算することが重要なのはなぜですか？">
        <p>
          ペットフードのパッケージには、関連する表示基準に基づき、粗たんぱく質、粗脂肪、粗繊維、水分などの成分値や栄養情報が表示されています。しかし、パッケージに記載されている多くの栄養成分値は、フードに含まれる<strong>水分を含んだままの給与時基準</strong>で表示されています。
        </p>
        <p>
          そのため、水分含有量が大きく異なるフード同士を、パッケージに記載された数値だけで直接比較すると、栄養成分の違いを誤って判断する可能性があります。
        </p>
        <p>
          たとえば、ウェットフードは一般的に水分含有量が非常に高く、ドライフードは比較的低くなっています。ウェットフードのたんぱく質表示値がドライフードより低く見えても、水分を除いた実際の固形分に占めるたんぱく質の割合は、むしろ高い場合があります。
        </p>
        <p>
          このように水分含有量の異なるフードについて、たんぱく質、脂肪、炭水化物などの<strong>栄養素密度を比較するには、水分を除いた乾物基準に換算することが有用です。</strong>
        </p>
        <p>
          乾物基準とは、実際にフードから水分を物理的に完全除去するという意味ではありません。計算上、水分を除いた残りの固形分を100％とした場合に、その栄養素がどの程度を占めるかを示す方法です。
        </p>
        <p>
          したがって、ドライフード、ウェットフード、フリーズドライフードなど、水分含有量が大きく異なる製品を比較する際には、パッケージに記載された数値だけでなく、<strong>乾物基準に換算した値も併せて確認する方が適切です。</strong>
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">犬と猫にとって1日の水分摂取が重要な理由</h3>
        <p>
          十分な水分摂取は、犬や猫の正常な身体機能を維持するうえで非常に重要です。水分は血液循環、体温調節、消化、代謝に必要であり、腎臓や尿路系が正常に機能するためにも重要な役割を果たします。
        </p>
        <p>
          ただし、<strong>水を多く飲めば腎不全、膀胱炎、尿路結石を必ず予防できるわけではありません。</strong> これらの疾患には、年齢、遺伝的要因、食事、尿の性状、基礎疾患など、さまざまな要因が関係します。それでも、適切な水分摂取は正常な水分バランスを保つうえで重要であり、一部の尿路疾患の管理では重要な要素となることがあります。
        </p>
        <p>
          健康な犬や猫に必要な1日の水分量は、体重、活動量、周囲の温度、フードの種類、健康状態などによって異なります。一般的な参考範囲として、<strong>体重1kgあたり1日約40～60mL前後の総水分摂取量</strong>が用いられることがありますが、すべてのペットに当てはまる固定された目標値ではありません。
        </p>
        <p>
          ここでいう1日の水分量には、<strong>水入れから直接飲む水だけでなく、ウェットフードやその他の食べ物に含まれる水分も含まれます。</strong>
        </p>
        <p>
          特にウェットフードには多くの水分が含まれているため、ウェットフードを中心に食べているペットは、水入れから飲む量が少なく見えることがあります。一方、ドライフードを食べるペットは食事から摂取する水分が少ないため、必要な水分のかなりの部分を直接水を飲むことで補うことになります。
        </p>
        <p>
          猫は犬と比べて自発的に水を飲む行動が少なく見られる場合があり、十分な水分摂取を促すために環境面での工夫が役立つ猫もいます。水入れを複数の場所に置く、新鮮な水にこまめに交換する、猫が好む場合には給水器を利用する、ウェットフードを活用するなどの方法を検討できます。
        </p>
        <p>
          ただし、ドライフードを食べているという理由だけですべての猫が慢性的な脱水状態になるわけではなく、すべてのペットにウェットフードや追加の水分補給が必ず必要というわけでもありません。<strong>大切なのは、食事に含まれる水分と直接飲む水を合わせた総水分摂取量と、個々の健康状態を総合的に確認することです。</strong>
        </p>
        <p>
          また、突然いつもより極端に多く水を飲むようになったり、尿量が大きく増えたりした場合は、単に「よく水を飲んでいる」と判断すべきではありません。多飲・多尿は、腎臓病、糖尿病、内分泌疾患など、さまざまな健康問題で見られることがあります。こうした変化が続く場合は、獣医師の診察を受ける必要があります。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>獣医学的な注意事項：</strong> 1日に必要な水分量は一般的な参考値であり、体重、フードの種類、活動量、気温、妊娠・授乳の有無、健康状態などによって異なります。特に慢性腎臓病、心疾患、尿路結石、その他の尿路疾患があるペットでは、一般的な水分摂取基準とは異なる管理が必要になる場合があります。療法食の栄養成分を比較したり、疾患管理を目的として給水量や食事内容を変更したりする場合は、獣医師の指示に従ってください。
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="dm" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
