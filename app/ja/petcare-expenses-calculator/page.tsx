import type { Metadata } from "next";
import PetcareExpensesCalculator from "@/components/PetcareExpensesCalculator";
import CalculatorBanner from "@/components/CalculatorBanner";
import RelatedPosts from "@/components/RelatedPosts";
import { getPosts } from "@/lib/wp";
import SeoArticle from "@/components/SeoArticle";

export const metadata: Metadata = {
  title: "ペットの生涯飼育費＆月間維持費シミュレーター | マゼンタラボ",
  description: "犬・猫の生涯飼育費と月々の固定生活費を見える化。フードグレード,消耗品,ライフステージ別の医療費・ワクチン接種費用をリアルタイム計算。",
  alternates: {
    canonical: "https://www.magentalabblog.com/ja/petcare-expenses-calculator",
    languages: {
      ko: "https://www.magentalabblog.com/petcare-expenses-calculator",
      en: "https://www.magentalabblog.com/en/petcare-expenses-calculator",
      ja: "https://www.magentalabblog.com/ja/petcare-expenses-calculator",
    },
  },
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

export default async function PetcareExpensesCalculatorPageJa() {
  let relatedPosts: any[] = [];
  try {
    const postsRes = await getPosts(1, 6, undefined, undefined, "ja");
    relatedPosts = postsRes.posts;
  } catch (error) {
    console.error("Failed to fetch related posts for Petcare Expenses (ja):", error);
  }

  return (
    <div className="bg-slate-50 pb-20">
      <PetcareExpensesCalculator lang="ja" />

      <SeoArticle title="犬と猫、生涯の飼育費はいくらかかるのでしょうか？">
        <p>
          ペットを家族として迎える前には、愛情や関心だけでなく、<strong></strong>も考える必要があります。フードやおやつなどの食費から、衛生用品、予防接種や健康診断、トリミング、病気の治療まで、ペットを飼うには継続的にさまざまな費用がかかるためです。
        </p>
        <p>
          韓国農林畜産食品部が発表した<strong></strong>によると、ペット1匹あたりの月平均飼育費は約<strong></strong>でした。種類別では犬が約<strong></strong>、猫が約<strong></strong>で、全体の月平均動物病院費は約<strong></strong>でした。
        </p>
        <p>
          現在の物価がそのまま維持されると仮定し、この金額を単純に15年間合計すると、全体平均で約2,178万ウォンに相当します。ただし、これは現在の月平均調査額を単純換算した参考値にすぎません。実際の生涯飼育費は、動物の種類や体格、与えるフード、生活環境、健康状態、医療サービスの利用状況、物価の変化などによって大きく異なる可能性があります。
        </p>
        <p>
          この計算機は、これからペットを迎える方や現在の飼い主が漠然と感じている<strong></strong>です。フードやおやつなどの食費、トイレ用品や猫砂などの衛生用品費、トリミングや日常ケアの費用、予防接種や健康診断などの医療費を入力し、月々の予想支出と長期間の累積予想費用を計算できます。
        </p>
        <p>
          計算結果は将来の実際の支出額を保証するものではなく、現在の支出水準をもとに今後必要となる予算をあらかじめ考えるための目安として利用するものです。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">ライフステージによって飼育費は変わります</h3>
        <p>
          ペットにかかる費用は、生涯を通じて一定ではありません。
        </p>
        <p>
          <strong></strong>には、必要な予防接種、寄生虫予防、健康診断などが集中する場合があります。また、飼い主の選択や獣医学的な判断により、不妊・去勢手術などの一時的な費用が発生することもあります。ハーネス、キャリーケース、トイレ、食器、寝具など、基本的な生活用品を最初にそろえる費用も考慮する必要があります。
        </p>
        <p>
          <strong></strong>には、フードやおやつ、トイレ用品や猫砂、予防ケアなど、比較的定期的に発生する生活費の割合が大きくなります。ただし、皮膚疾患、歯科疾患、けが、その他の病気が発生した場合には、通常より医療費が増えることがあります。
        </p>
        <p>
          <strong></strong>になると、健康状態をより頻繁に確認する必要性が高まり、一部のペットでは慢性腎臓病、関節疾患、心血管系疾患、歯科疾患、腫瘍など、さまざまな健康問題が起こる可能性が高くなります。そのため、検査、薬、療法食、治療などにかかる費用が以前より増える場合があります。
        </p>
        <p>
          シニア期が始まる年齢は、すべてのペットで同じではありません。特に犬では、品種、体格、予想寿命によって老化の時期が大きく異なるため、単純に特定の年齢からすべての犬を高齢と判断するのは適切ではありません。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">予想外の医療費にも備えておきましょう</h3>
        <p>
          月平均の飼育費だけですべての費用を予測することは困難です。膝蓋骨脱臼や前十字靱帯疾患の手術、腫瘍の検査や治療、歯科治療、救急診療、入院など、予期しない状況では普段より高額な医療費が発生することがあります。
        </p>
        <p>
          そのため、通常の生活費に加えて、<strong></strong>も検討する価値があります。毎月一定額をペットの医療費として積み立てたり、補償範囲、自己負担額、補償対象外の項目などを比較したうえで、ペット保険への加入を検討したりする方法があります。
        </p>
        <p>
          どの方法を選ぶ場合でも大切なのは、ペットを迎える前に、<strong></strong>です。
        </p>

        <p className="bg-slate-100 p-4 rounded-xl mt-4 font-medium text-sm">
          ⚠️ <strong>費用に関する注意事項：</strong> 本計算機の結果は、ユーザーが入力した費用や公開されているペット飼育費の統計などをもとに算出した予想値であり、実際の支出額を保証するものではありません。フード価格、地域ごとの動物病院診療費、トリミングや生活用品の費用、物価変動、個々のペットの健康状態などによって、実際の費用は大きく異なる場合があります。また、救急診療、入院、手術、慢性疾患の治療など、予期しない医療費が計算結果を大きく上回る可能性もあるため、別途余裕のある予算を検討してください。
        </p>
      </SeoArticle>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <CalculatorBanner isRandom={true} excludeType="expenses" lang="ja" />
        <RelatedPosts posts={relatedPosts} lang="ja" />
      </div>
    </div>
  );
}
