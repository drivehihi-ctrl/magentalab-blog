import ShopClient from "../ShopClient";

export const metadata = {
  title: "관리자 미리보기 | 마젠타몰",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ShopSecretPage() {
  return <ShopClient />;
}
