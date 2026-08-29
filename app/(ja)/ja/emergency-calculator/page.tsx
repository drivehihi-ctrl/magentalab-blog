import type { Metadata } from "next";
import EmergencyCalculator from "@/components/EmergencyCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "ペット誤食中毒症状 応急判定シミュレーター | マゼンタラボ",
  description: "チョコレート、ネギ類、ブドウ、キシリトールなど犬・猫の中毒物質誤食時に、体重と摂取量から医学的リスク評価(Risk Assessment)と推奨アクション(Action Level)を判定します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/emergency-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/emergency-calculator",
      en: "https://www.magentalabblog.com/en/emergency-calculator",
      ja: "https://www.magentalabblog.com/ja/emergency-calculator",
    },
  },
  keywords: ["ペット誤食中毒", "犬のチョコレート中毒", "キシリトール犬誤食", "ペット危険食べ物", "猫中毒判定", "マゼンタラボ"],
  openGraph: {
    title: "ペット誤食中毒症状 応急判定シミュレーター | マゼンタラボ",
    description: "誤食した成分量とペットの体重から、医学的リスク評価と家庭での初期応急処置情報を案内。",
    url: "https://www.magentalabblog.com/ja/emergency-calculator",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 800,
        height: 600,
        alt: "マゼンタラボ 中毒応急計算機",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ペット誤食中毒症状 応急判定シミュレーター | マゼンタラボ",
    description: "誤食した成分量とペットの体重から、医学的リスク評価と家庭での初期応急処置情報を案内。",
    images: ["/images/favicon.png"],
  }
};

import SeoArticle from "@/components/SeoArticle";

export default async function EmergencyCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Emergency (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <EmergencyCalculator lang="ja" />
      
      <SeoArticle title="犬と猫の中毒（Toxicity）は、迅速な対応が重要です">
        <p>
          人には安全な食べ物や植物でも、犬や猫には深刻な中毒を引き起こすことがあります。代表的な危険物質には、<strong>チョコレートに含まれるテオブロミンやカフェイン、ブドウ・レーズン、タマネギ・ニンニクなどのネギ属植物、キシリトール、そして猫にとって極めて危険な一部のユリ類</strong>などがあります。
        </p>
        <p>
          ペットが危険な物質を摂取した場合、最も重要なのは症状が現れるまで待つことではなく、<strong>できるだけ早く動物病院へ連絡すること</strong>です。毒性の程度は、摂取した物質の種類や濃度、摂取量、ペットの体重、摂取からの経過時間、現在の症状などによって大きく異なります。
        </p>
        <p>
          チョコレートやキシリトールのように、体重当たりの摂取量（mg/kg）がリスク評価に重要な物質もありますが、すべての中毒を単純な用量計算だけで判断できるわけではありません。特にブドウ・レーズンや猫のユリ類への曝露のように、安全な摂取量を正確に予測することが難しい場合には、<strong>少量に見えても獣医学的な相談が必要です。</strong>
        </p>
        <p>
          また、中毒時の処置は必ずしも嘔吐を誘発することではありません。摂取して間もない特定の物質については、獣医師が催吐処置やその他の消化管除染を検討することがありますが、摂取した物質や動物の状態によっては、吐かせることでかえって危険になる場合もあります。そのため、自己判断で処置を行うのではなく、摂取した製品や植物の名称、推定摂取量、摂取時刻、ペットの体重を確認し、動物病院へ伝えることが重要です。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">主な危険物質ごとの中毒症状</h3>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>チョコレート・ココア：</strong> チョコレートには、テオブロミン（Theobromine）とカフェイン（Caffeine）というメチルキサンチン類が含まれています。特にココアパウダー、製菓用チョコレート、カカオ含有量の高いダークチョコレートは、一般的により高濃度のメチルキサンチンを含むことがあります。中毒すると、嘔吐、下痢、落ち着きのなさ、口渇の増加、呼吸の速まり、頻脈や不整脈、震え、けいれんなどが現れることがあり、重症の場合は生命を脅かす可能性があります。リスクは、<strong>チョコレートの種類、摂取量、ペットの体重</strong>を総合して判断する必要があります。</li>
          <li><strong>ブドウ・レーズン：</strong> ブドウやレーズンは、一部の犬で<strong>急性腎障害（Acute Kidney Injury, AKI）</strong>を引き起こすことがあります。近年の研究では酒石酸（Tartaric acid）が主な毒性原因として示唆されていますが、ブドウごとに含有量が異なり、個体による感受性の差もあるため、正確な危険摂取量を予測することは困難です。そのため、犬がブドウやレーズンを食べた場合、量が少なく見えても自己判断で安全とみなさないことが大切です。</li>
          <li><strong>タマネギ・ニンニクなどのネギ属植物：</strong> タマネギ、ニンニク、ネギ、ニラなどには、赤血球に酸化障害を与える可能性のある有機硫黄化合物が含まれています。十分な量を摂取すると赤血球が損傷し、<strong>溶血性貧血</strong>を起こすことがあります。元気消失、食欲不振、嘔吐、歯ぐきが白っぽくなる、呼吸が速くなるなどの症状がみられることがあります。特に猫はネギ属植物の毒性に敏感であることが知られています。</li>
          <li><strong>ユリ類（特に猫）：</strong> 猫では、Lilium属の真正ユリとHemerocallis属のワスレグサ類が特に危険です。花や葉だけでなく、<strong>花粉や花瓶の水を摂取しただけでも重篤な急性腎障害</strong>を引き起こす可能性があります。猫がこれらのユリ類に曝露した場合は、症状がなくても直ちに動物病院へ連絡することが重要です。「ユリ」という名前が付くすべての植物が同じ腎毒性を持つわけではないため、植物の正確な種類を確認することも大切です。</li>
          <li><strong>キシリトール（犬）：</strong> キシリトールは犬で急速なインスリン分泌を引き起こし、<strong>重度の低血糖</strong>を起こすことがあります。嘔吐、元気消失、ふらつき、震え、けいれんなどが現れることがあり、より多量を摂取した一部の犬では重篤な肝障害や肝不全を起こす場合があります。ガムやキャンディだけでなく、一部の無糖食品、歯磨き粉、医薬品、サプリメントにもキシリトールが含まれていることがあるため、成分表示の確認が重要です。</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 中毒が疑われるときに飼い主がすべきこと</h3>
        <p>
          ペットが有毒物質を口にした可能性がある場合は、<strong>症状が現れるまで待たず、直ちに動物病院へ連絡してください。</strong> 可能であれば製品のパッケージや成分表示、食べた植物の写真を用意し、推定摂取量、摂取した時刻、ペットの体重もあわせて伝えると診療に役立ちます。
        </p>
        <p>
          <strong>飼い主の自己判断で塩水や薬剤などを使って無理に吐かせてはいけません。</strong> 特に猫に過酸化水素を使って嘔吐を誘発することは危険です。犬では3％過酸化水素が特定の状況で獣医師の指示のもと使用されることがありますが、すべての中毒に適した方法ではなく、誤った使用は消化管の損傷や誤嚥などの合併症を引き起こす可能性があります。必ず獣医師から具体的な指示を受けた場合にのみ実施してください。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>獣医学的な注意事項：</strong> 中毒リスクの計算結果は、緊急性を判断するための参考情報であり、安全性を確定したり獣医師の診療に代わったりするものではありません。有毒物質ごとに危険量、吸収速度、治療方法が異なり、ブドウ・レーズンやユリ類のように計算だけでは安全性を判断しにくい物質もあります。危険物質を摂取した、または摂取したかどうか確実でなくても中毒の可能性がある場合は、できるだけ早く動物病院へ相談してください。
        </p>
      </SeoArticle>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="emergency" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
