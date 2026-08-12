import type { Metadata } from "next";
import FicDiagnoser from "@/components/FicDiagnoser";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";
import SeoArticle from "@/components/SeoArticle";

export const metadata: Metadata = {
  title: "猫の特発性膀胱炎(FIC)＆ストレス自律判定器 | マゼンタラボ",
  description: "猫の排尿トラブルや排泄姿勢から、特発性膀胱炎(FIC)リスクおよび心理的ストレスレベルを評価し、自宅での生活環境改善ガイドを提示します。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/fic-diagnoser",
    languages: {
      ko: "https://www.magentalabblog.com/fic-diagnoser",
      en: "https://www.magentalabblog.com/en/fic-diagnoser",
      ja: "https://www.magentalabblog.com/ja/fic-diagnoser",
    },
  },
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

export default async function FicDiagnoserPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for FIC (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <FicDiagnoser lang="ja" />

      <SeoArticle title="猫に多い下部尿路疾患、特発性膀胱炎（FIC）とは？">
        <p>
          猫下部尿路疾患（FLUTD, Feline Lower Urinary Tract Disease）は、ひとつの特定の病気を指すのではなく、膀胱や尿道に起こるさまざまな疾患をまとめた呼び方です。その中でも**猫特発性膀胱炎（FIC, Feline Idiopathic Cystitis）**は特に多く診断される原因のひとつで、複数の研究ではFLUTDの症状を示す猫のおよそ55～65％前後を占めると報告されています。
        </p>
        <p>
          「特発性（Idiopathic）」とは、結石、細菌感染、腫瘍など、症状を説明できる明確な原因が特定できないことを意味します。そのためFICは、尿検査や画像検査などによって他の原因を除外したうえで診断されることが多い疾患です。
        </p>
        <p>
          FICの正確な原因は、現在もひとつには特定されていません。現在の獣医学では、**ストレスや環境要因、神経系・ホルモン系のストレス反応、膀胱の感覚機能や防御機能の変化などが複合的に関与する疾患**と考えられています。
        </p>
        <p>
          猫は生活環境の変化や社会的な緊張に敏感なことがあります。引っ越し、新しい家族やペットが加わること、ほかの猫との関係の変化、生活リズムの変化、トイレ環境の変更などは、一部の猫にとってストレス要因になる可能性があります。
        </p>
        <p>
          ただし、単純に「ストレスを受けると膀胱炎になる」という意味ではありません。すべてのストレスがFICを引き起こすわけではなく、ストレスへの反応や発症リスクには個体差があります。FICを繰り返す猫では、生活環境を安定させ、ストレス要因を減らすための**環境エンリッチメントや多面的環境改善（Multimodal Environmental Modification）**が管理の重要な要素になることがあります。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">見逃しやすい猫下部尿路疾患のサイン</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>トイレ以外の場所で排尿する：</strong> 普段は問題なくトイレを使っている猫が、突然ベッド、布団、ソファ、床などで排尿するようになった場合、単なる「反抗」と判断すべきではありません。膀胱や尿道の痛み、頻繁な尿意、トイレ環境への不快感、行動学的な原因など、さまざまな可能性があります。特に排尿行動に突然の変化がみられた場合は、尿路疾患がないか確認することが大切です。</li>
          <li><strong>生殖器や下腹部を過剰に舐める：</strong> 生殖器周辺や下腹部を普段より頻繁に舐める行動は、膀胱や尿道付近の不快感や痛みと関連していることがあります。毛が抜けるほど過剰なグルーミングが続く場合は、皮膚疾患や行動上の問題だけでなく、泌尿器疾患の可能性も確認する必要があります。</li>
          <li><strong>トイレには頻繁に行くのに尿量が少ない：</strong> 普段より頻繁にトイレに入り、長時間いきんだり、尿の塊が小さくなったり、少量ずつしか排尿できなかったりする場合は、下部尿路疾患の重要なサインである可能性があります。排尿時に鳴いたり、不快そうにしたり、血尿がみられることもあります。</li>
        </ul>
        <p className="mt-4">
          これらの症状だけでFICと確定することはできません。尿路結石、尿道閉塞、尿路感染症など、ほかの疾患でも似た症状がみられるため、症状が繰り返す、または悪化する場合は獣医師の診察が必要です。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">🚨 特にオス猫の「尿が出ない状態」は緊急です</h3>
        <p>
          オス猫はメス猫に比べて尿道が長く細いため、**尿道閉塞（Urethral Obstruction）**のリスクが高くなります。FICによる炎症や尿道のけいれん、尿道栓、結石などが尿道を塞ぐと、尿を正常に排出できなくなることがあります。
        </p>
        <p>
          猫が何度もトイレに入り、排尿姿勢を取って力んでいるにもかかわらず、**尿がほとんど出ない、またはまったく出ない場合は、時間を置いて様子を見てはいけません。**
        </p>
        <p>
          完全な尿道閉塞が続くと、腎機能に重大な影響を与え、血中カリウム濃度の上昇、酸塩基平衡異常、尿毒症など、生命を脅かす合併症につながる可能性があります。そのため、特にオス猫が繰り返し排尿姿勢を取るものの実際に尿が出ていない場合は、**直ちに救急対応が可能な動物病院へ連絡し、診察を受ける必要があります。**
        </p>
        <p>
          尿道閉塞の治療は、猫の全身状態や閉塞の程度によって決まります。輸液や電解質異常に対する安定化治療が必要になる場合があり、多くのケースでは鎮静または麻酔下で尿道カテーテルなどを用いて閉塞を解除する治療が行われます。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>獣医学的な注意事項：</strong> 本セルフチェック機能は、飼い主が観察した排尿行動をもとに猫下部尿路疾患の可能性を確認するための参考ツールであり、FIC、尿路結石、尿路感染症、尿道閉塞を確定診断することはできません。特に、猫が繰り返しいきんでいるのに尿が出ない、またはごく少量しか出ず、痛み、嘔吐、元気消失などの症状を伴う場合は緊急状態の可能性があります。結果にかかわらず、直ちに動物病院で診察を受けてください。
        </p>
      </SeoArticle>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="fic" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
