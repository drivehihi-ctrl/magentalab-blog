import { fetch } from 'undici';

async function verify() {
  console.log("Fetching http://127.0.0.1:3001/bcs-calculator");
  
  try {
    const bcsRes = await fetch("http://127.0.0.1:3001/bcs-calculator");
    const bcsHtml = await bcsRes.text();
    console.log("\n--- BCS PAGE HTML VALIDATION ---");
    console.log("Has Title UI?", bcsHtml.includes("반려동물 비만도(BCS) &amp; 칼로리 계산기") || bcsHtml.includes("반려동물 비만도(BCS) & 칼로리 계산기"));

    const ageRes = await fetch("http://127.0.0.1:3001/age-calculator");
    const ageHtml = await ageRes.text();
    console.log("\n--- AGE PAGE HTML VALIDATION ---");
    console.log("Has Title UI?", ageHtml.includes("사람 나이 환산"));

    const dmRes = await fetch("http://127.0.0.1:3001/dm-calculator");
    const dmHtml = await dmRes.text();
    console.log("\n--- DM PAGE HTML VALIDATION ---");
    console.log("Has Title UI?", dmHtml.includes("하루 음수량 계산기") || dmHtml.includes("DM"));

    const ficRes = await fetch("http://127.0.0.1:3001/fic-diagnoser");
    const ficHtml = await ficRes.text();
    console.log("\n--- FIC PAGE HTML VALIDATION ---");
    console.log("Has Title UI?", ficHtml.includes("특발성 방광염"));
    console.log("Has form UI?", ficHtml.includes("프로필") || ficHtml.includes("성별"));

    const mapRes = await fetch("http://127.0.0.1:3001/map");
    const mapHtml = await mapRes.text();
    console.log("\n--- MAP PAGE HTML VALIDATION ---");
    console.log("Has sr-only SEO?", mapHtml.includes("실시간 반려동물 지도 (펫 맵) - 마젠타랩"));
    
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

verify();
