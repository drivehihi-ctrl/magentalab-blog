import type { Metadata } from "next";
import AgeCalculator from "@/components/AgeCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペット年齢の人間換算＆健康ライフステージ計算機 | マゼンタラボ (JP)",
  description: "愛犬・愛猫の年齢を人間年齢に素早く換算し、幼少期・成犬期・高齢シニア期に最適化された予防ケア情報を提供します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/age-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/age-calculator",
      en: "https://www.magentalabblog.com/en/age-calculator",
      ja: "https://www.magentalabblog.com/ja/age-calculator",
    },
  },
  keywords: ["ペットの人間年齢", "犬の年齢換算", "猫の年齢換算", "ペットライフステージ", "シニア犬ケア", "シニア猫ヘルス", "マゼンタラボ"],
  openGraph: {
    title: "ペット年齢の人間換算＆健康ライフステージ計算機 | マゼンタラボ (JP)",
    description: "誕生年月を入力するだけで、ペットの本当の年齢を人間用へ換算し、最適な獣医ケアアドバイスを提示します。",
    url: "https://www.magentalabblog.com/ja/age-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ ペット年齢計算機",
      }
    ]
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function AgeCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Age (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <AgeCalculator lang="ja" />
      
      <SeoArticle title="犬と猫の年齢は、人間の年齢にどう換算すればよいのでしょうか？">
        <p>
          「うちの犬や猫は、人間の年齢にすると何歳くらいなのだろう？」と疑問に思う飼い主の方は多いでしょう。以前は、ペットの年齢に単純に7を掛ける方法が広く知られていました。たとえば3歳なら人間の21歳と考える方法です。しかし実際の老化速度は、ライフステージや動物種、品種、体格によって異なるため、<strong>単純な掛け算だけで正確に人間の年齢へ換算することはできません。</strong>
        </p>
        <p>
          近年では、犬のDNAメチル化の変化を解析し、人と犬の老化過程を比較する<strong>エピジェネティック・クロック</strong>の研究も行われています。ただし、こうした研究結果がすべての犬や猫に共通して適用できる臨床上の標準的な年齢換算法になっているわけではありません。そのため、人間年齢への換算結果は正確な生物学的年齢ではなく、<strong>ペットのライフステージを理解するための参考情報</strong>として捉えるのが適切です。
        </p>
        <p>
          犬と猫は、<strong>生後最初の1～2年間に人間よりもはるかに速く成長し、性的に成熟</strong>します。その後は成長や老化の速度が徐々に緩やかになります。特に犬では、体格や品種によって老化の速度や平均寿命に大きな違いがあります。一般的に大型犬は小型犬より平均寿命が短く、加齢に伴う変化がより早い時期から見られる傾向があります。
        </p>
        <p>
          したがって、ペットの年齢や健康を考える際には、単純な「人間年齢」の数字だけを見るのではなく、<strong>現在のライフステージ、品種と体格、体重、活動量、健康状態を総合的に確認することがより重要です。</strong>
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">ライフステージ別の健康管理ポイント</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>子犬・子猫（成長期）：</strong> 骨格、神経系、免疫系が急速に発達する時期です。成長段階に適した<strong>栄養バランスの取れた総合栄養食</strong>を与え、必要なワクチン接種や寄生虫予防を適切なスケジュールで行うことが重要です。特に成長期にカルシウムや特定の栄養素を自己判断で過剰に補給することは、望ましくない場合があります。また、幼い時期の適切な社会化やポジティブな経験は、その後の行動発達や環境への適応に重要な影響を与える可能性があります。</li>
          <li><strong>成犬・成猫（成体期）：</strong> 身体機能や活動性が比較的安定している時期です。消費エネルギーより摂取カロリーが多い状態が続くと体重が増えやすいため、定期的な散歩や遊び、適切な給餌量によって<strong>理想的な体型とBCSを維持すること</strong>が大切です。一般的に9段階のBCSでは<strong>4～5/9程度</strong>が理想的な範囲とされていますが、正確な評価には個体の体格や筋肉量なども考慮する必要があります。</li>
          <li><strong>シニア・高齢期：</strong> シニア期が始まる時期は、すべてのペットで同じではありません。犬では品種や体格、予想される寿命によって老化の時期が異なり、獣医学では予想寿命の後半に入った時期をシニア期として評価する考え方も用いられています。猫では一般的に、<strong>10歳を超える頃からシニア期として評価する基準</strong>が広く用いられています。年齢を重ねるにつれて、関節疾患、慢性腎臓病、歯科疾患、心血管系疾患、認知機能の変化など、さまざまな健康問題が生じる可能性が高くなるため、定期的な健康状態の確認がより重要になります。</li>
        </ul>

        <p className="mt-4">
          シニア期のペットでは、若い時期よりも健康状態の変化を早期に発見することが重要です。そのため、<strong>定期的な獣医師による診察と、必要に応じた血液検査や尿検査などの健康診断</strong>を検討するとよいでしょう。超音波検査やX線検査などの追加画像検査は、すべてのペットに一律に実施するものではなく、症状、品種ごとのリスク要因、身体検査および基本検査の結果をもとに獣医師が必要性を判断します。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>獣医学的な注意事項：</strong> 人間年齢への換算結果は、一般的なライフステージや統計的な老化傾向を理解するための参考値であり、個々のペットの生物学的な老化度を正確に示す数値ではありません。品種や体格、遺伝的要因、栄養状態、運動量、生活環境、病気の有無などによって、同じ年齢のペットでも健康状態や老化の程度には大きな差が生じることがあります。人間年齢の計算結果だけに頼るのではなく、現在の体重とBCS、活動性、行動の変化、定期的な健康診断の結果を総合的に確認することが重要です。
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="age" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
