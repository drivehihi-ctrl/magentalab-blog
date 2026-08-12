import type { Metadata } from "next";
import PatellaDiagnoser from "@/components/PatellaDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "犬の膝蓋骨脱臼(パテラ)＆関節健康チェック | マゼンタラボ",
  description: "犬の歩行姿勢や行動シグナルから、膝蓋骨脱臼(パテラ)リスクをセルフチェックし、獣医師推奨の関節ケア対策を紹介します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/patella-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/patella-diagnoser",
      en: "https://www.magentalabblog.com/en/patella-diagnoser",
      ja: "https://www.magentalabblog.com/ja/patella-diagnoser",
    },
  },
  keywords: ["犬の膝蓋骨脱臼パテラ", "犬関節健康セルフチェック", "犬が後ろ足をあげる", "小型犬関節炎予防", "マゼンタラボ"],
  openGraph: {
    title: "犬の膝蓋骨脱臼(パテラ)＆関節健康チェック | マゼンタラボ",
    description: "愛犬の跛行サインと歩き方からパテラ発症の重症リスク（グレード1-4）を簡易判定します。",
    url: "https://www.magentalabblog.com/ja/patella-diagnoser",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 犬パテラ診断器",
      }
    ]
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function PatellaDiagnoserPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Patella (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PatellaDiagnoser lang="ja" />
      
      <SeoArticle title="小型犬に多い膝蓋骨脱臼（Patellar Luxation）とは？">
        <p>
          膝蓋骨脱臼は、マルチーズ、ポメラニアン、チワワ、トイ・ミニチュア系プードルなどの<strong>小型犬で比較的よくみられる整形外科疾患</strong>です。ただし、小型犬であれば必ず発症するわけではなく、品種や個体によってリスクには差があります。
        </p>
        <p>
          膝蓋骨は膝の前方にある小さな骨で、正常では大腿骨の末端にある溝、<strong>滑車溝（Trochlear groove）</strong>の中を動きます。膝蓋骨脱臼とは、この膝蓋骨が正常な位置から内側または外側へ外れる状態を指します。小型犬では内側へ外れる<strong>内側膝蓋骨脱臼（Medial Patellar Luxation, MPL）</strong>が多くみられます。
        </p>
        <p>
          膝蓋骨脱臼は、単に膝の溝が浅いために起こる疾患とは限りません。外傷によらない膝蓋骨脱臼には遺伝的・発育的要因が関与し、大腿骨や脛骨の形状・角度、脛骨粗面の位置、大腿四頭筋から膝蓋骨、膝蓋腱へと続く伸展機構の配列異常などが複合的に関係することがあります。
        </p>
        <p>
          滑りやすい床で繰り返し滑ったり、高い場所から飛び降りたりする行動は、すでに関節や膝に問題がある犬に追加の負担やけがのリスクを与える可能性があります。ただし、こうした生活環境だけで膝蓋骨脱臼が発症したり、必ず急速に進行したりすると断定することはできません。適正体重を維持し、繰り返す滑りや無理なジャンプを減らせる環境を整えることは、関節の健康管理に役立つ可能性があります。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">膝蓋骨脱臼はどのようにグレード1～4に分類されますか？</h3>
        <p className="mb-4">
          膝蓋骨脱臼のグレードは歩き方だけで決めるものではなく、<strong>獣医師が膝蓋骨の位置や、脱臼・整復が可能かどうかを触診して評価</strong>します。
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>グレード1（Grade I）：</strong> 通常は膝蓋骨が正常な滑車溝内にありますが、検査時に手で押すと脱臼させることができます。手を離すと膝蓋骨は自然に正常な位置へ戻ります。症状がほとんどない、あるいは断続的にしか現れないこともあり、飼い主が気づかない場合もあります。</li>
          <li><strong>グレード2（Grade II）：</strong> 動いている最中に膝蓋骨が自然に外れたり、手で脱臼させることができたりし、一定時間脱臼した状態が続くことがあります。脚を伸ばしたり姿勢を変えたりすると元に戻ることもあります。歩いている途中で突然、後ろ脚を数歩上げて歩く、いわゆる<strong>スキッピング歩行（skipping gait）</strong>がみられることがあります。</li>
          <li><strong>グレード3（Grade III）：</strong> 膝蓋骨はほとんどの時間脱臼していますが、手で正常な位置へ戻すことは可能です。ただし再び容易に脱臼することがあり、長期間続くと大腿骨や脛骨の配列異常、脚の形の変形などを伴うことがあります。持続的な歩行異常や跛行がみられる場合があります。</li>
          <li><strong>グレード4（Grade IV）：</strong> 膝蓋骨が常に脱臼しており、手でも正常な滑車溝内へ戻すことが困難な最も重度の段階です。著しい骨格変形や異常歩行を伴うことがありますが、痛みの程度や歩行能力には個体差があります。</li>
        </ul>

        <p className="mt-4">
          膝蓋骨脱臼があるからといって、すべての犬に手術が必要なわけではありません。<strong>症状のない軽度の膝蓋骨脱臼では、定期的に状態を確認しながら経過観察することもあります。</strong> 一方、繰り返す跛行や痛みがある場合、脱臼の程度が重い場合、あるいは骨格変形や関節損傷が進行している場合には、外科的矯正が検討されることがあります。
        </p>
        <p className="mt-4">
          膝蓋骨が繰り返し滑車溝から外れると、時間の経過とともに関節軟骨が損傷し、変形性関節症が進行する可能性があります。また、膝のほかの構造にも負担がかかることがあります。一部の犬では前十字靱帯疾患を併発することもあります。そのため、歩き方の異常を繰り返す、または片方の後ろ脚を頻繁に上げて歩く場合は、飼い主がグレードを自己判断するのではなく、整形外科的な診察を受けることをおすすめします。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-6 font-medium text-sm">
          ⚠️ <strong>獣医学的な注意事項：</strong> 本セルフチェック機能は、歩行の様子や飼い主が観察した症状をもとに膝蓋骨脱臼の可能性を確認するための参考ツールであり、膝蓋骨脱臼の有無やグレードを確定する診断ツールではありません。膝蓋骨脱臼の診断とグレード評価では、獣医師による整形外科的触診が基本となります。X線検査は、骨の形状や配列、関節の変化、手術計画などを評価するために追加で行われることがあります。症状を繰り返す場合や、痛み、持続する跛行、患肢への荷重低下がみられる場合は、動物病院で診察を受けてください。
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="patella" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
