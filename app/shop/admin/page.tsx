"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Camera, Trash2, Edit, PlayCircle, Image as ImageIcon, Sparkles, Plus } from "lucide-react";
import AICommentAssistant from "@/components/AICommentAssistant";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price: number;
  image_url: string;
  category: string;
  badge?: string;
  stock?: number;
  detail_images?: string[];
  details_link?: string;
  created_at?: string;
}

interface Banner {
  id: string;
  title: string;
  sub_text: string;
  bg_gradient: string;
  emoji: string;
  image_url?: string;
  link_url?: string;
  order_index: number;
  banner_type?: "standard" | "story";
}

interface CareGuide {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  video_url: string;
  gradient: string;
  order_index: number;
}

const ADMIN_PASSCODE = "magenta123";
const PRODUCT_BUCKET = "shop_products";

export default function ShopAdminPage() {
  const { data: session } = useSession();
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "guides" | "ai">("products");
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [careGuides, setCareGuides] = useState<CareGuide[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
  const [currentGuide, setCurrentGuide] = useState<Partial<CareGuide>>({});
  
  // Media States
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [compressionMode, setCompressionMode] = useState<"standard" | "high">("standard");

  // Authentication logic
  useEffect(() => {
    const auth = sessionStorage.getItem("shop_admin_authorized");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === "products") fetchProducts();
      if (activeTab === "banners") fetchBanners();
      if (activeTab === "guides") fetchCareGuides();
    }
  }, [isAuthorized, activeTab]);

  // Fetchers
  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  async function fetchBanners() {
    setLoading(true);
    const { data } = await supabase.from("shop_banners").select("*").order("order_index", { ascending: true });
    if (data) setBanners(data);
    setLoading(false);
  }

  async function fetchCareGuides() {
    setLoading(true);
    const { data } = await supabase.from("care_guides").select("*").order("order_index", { ascending: true });
    if (data) setCareGuides(data);
    setLoading(false);
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthorized(true);
      sessionStorage.setItem("shop_admin_authorized", "true");
    } else alert("비밀번호가 틀렸습니다.");
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem("shop_admin_authorized");
  };

  // Image Processing & Compression
  const compressImage = async (file: File, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context failed"));
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > height && width > maxDim) { height *= maxDim / width; width = maxDim; }
          else if (height > maxDim) { width *= maxDim / height; height = maxDim; }
          canvas.width = width; canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            else reject(new Error("Compression failed"));
          }, "image/jpeg", quality);
        };
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const deleteOldFile = async (url: string, bucket: string) => {
    if (!url || !url.includes(bucket)) return;
    try {
      const parts = url.split("/");
      const fileName = parts.pop();
      const folder = parts.pop();
      if (fileName && folder) await supabase.storage.from(bucket).remove([`${folder}/${fileName}`]);
    } catch (e) { console.error("File deletion failed", e); }
  };

  const uploadMedia = async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    try {
      const currentUrl = activeTab === "products" ? currentProduct.image_url : currentBanner.image_url;
      if (currentUrl) await deleteOldFile(currentUrl, folder);
      
      const formData = new FormData();
      formData.append("file", file);
      // folder 인자에 보관함 이름(products 또는 banners)이 담겨 있으므로 이를 사용합니다.
      formData.append("bucket", folder); 
      formData.append("folder", ""); // 폴더는 따로 쓰지 않고 루트에 저장합니다.

      // 서버 사이드 전용 통로(API)를 통해 RLS를 우회하여 업로드
      const response = await fetch("/api/shop/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "업로드 실패");

      const publicUrl = result.url;
      
      if (activeTab === "products") setCurrentProduct({ ...currentProduct, image_url: publicUrl });
      else setCurrentBanner({ ...currentBanner, image_url: publicUrl });
      
      setUploading(false);
      return publicUrl;
    } catch (error: any) { 
      alert("업로드 실패 (안심이 특급처방 가동 중): " + error.message); 
      setUploading(false);
      return null;
    }
  };

  // CRUD Operations
  async function handleSaveProduct() {
    const { id, created_at, ...updateData } = currentProduct as any;
    const payload = { 
      name: updateData.name,
      brand: updateData.brand,
      price: Number(updateData.price), 
      original_price: Number(updateData.original_price || updateData.price), 
      stock: Number(updateData.stock || 0),
      category: updateData.category,
      image_url: updateData.image_url,
      details_link: updateData.details_link,
      detail_images: updateData.detail_images || []
    };
    let result;
    if (id) result = await supabase.from("products").update(payload).eq("id", id);
    else result = await supabase.from("products").insert([payload]);
    if (result.error) alert("저장 실패: " + result.error.message);
    else { setIsEditing(false); fetchProducts(); }
  }

  async function handleSaveBanner() {
    const payload = { 
      title: currentBanner.title, 
      sub_text: currentBanner.sub_text, 
      bg_gradient: currentBanner.bg_gradient, 
      emoji: currentBanner.emoji,
      image_url: currentBanner.image_url,
      link_url: currentBanner.link_url,
      order_index: Number(currentBanner.order_index || 0),
      banner_type: currentBanner.banner_type || "standard"
    };
    if (currentBanner.id) await supabase.from("shop_banners").update(payload).eq("id", currentBanner.id);
    else await supabase.from("shop_banners").insert([payload]);
    setIsEditing(false); fetchBanners();
  }

  async function handleSaveGuide() {
    const payload = { 
      title: currentGuide.title, 
      subtitle: currentGuide.subtitle, 
      emoji: currentGuide.emoji, 
      video_url: currentGuide.video_url,
      gradient: currentGuide.gradient,
      order_index: Number(currentGuide.order_index || 0)
    };
    if (currentGuide.id) await supabase.from("care_guides").update(payload).eq("id", currentGuide.id);
    else await supabase.from("care_guides").insert([payload]);
    setIsEditing(false); fetchCareGuides();
  }

  async function handleDelete(id: any, table: string, imageUrl?: string) {
    if (!confirm("정말 삭제하시겠습니까? 관련 데이터와 파일이 영구 삭제됩니다.")) return;
    if (imageUrl) await deleteOldFile(imageUrl, PRODUCT_BUCKET);
    await supabase.from(table).delete().eq("id", id);
    if (table === "products") fetchProducts();
    if (table === "shop_banners") fetchBanners();
    if (table === "care_guides") fetchCareGuides();
  }

  // --- Auth Render ---
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>
        <div style={authCardStyle}>
          <div style={{ fontSize: "50px", marginBottom: "20px" }}>🛡️</div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", marginBottom: "8px" }}>안심 관리 시스템</h1>
          <form onSubmit={handleAuth} style={{ marginTop: "30px" }}>
            <input type="password" placeholder="Passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={authInputStyle} />
            <button type="submit" style={authBtnStyle}>Unlock System</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#F8FAFC", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.04em" }}>Shop Intelligence Dashboard</h1>
            <p style={{ color: "#94A3B8", fontSize: "14px" }}>안심 연구원의 0.1% 정밀 미디어 및 라이브러리 제어 센터</p>
            
            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              <button 
                onClick={() => { setActiveTab("products"); setIsEditing(false); }}
                style={{ ...tabBtnStyle, background: activeTab === "products" ? "#E5007E" : "rgba(255,255,255,0.05)" }}
              >📦 상품 관리</button>
              <button 
                onClick={() => { setActiveTab("banners"); setIsEditing(false); }}
                style={{ ...tabBtnStyle, background: activeTab === "banners" ? "#E5007E" : "rgba(255,255,255,0.05)" }}
              >🖼️ 배너 제어</button>
              <button 
                onClick={() => { setActiveTab("guides"); setIsEditing(false); }}
                style={{ ...tabBtnStyle, background: activeTab === "guides" ? "#E5007E" : "rgba(255,255,255,0.05)" }}
              >🎬 케어 가이드</button>
              <button 
                onClick={() => { setActiveTab("ai"); setIsEditing(false); }}
                style={{ ...tabBtnStyle, background: activeTab === "ai" ? "#E5007E" : "rgba(255,255,255,0.05)" }}
              >🤖 AI 연구 지원</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
            {activeTab !== "ai" && (
              <button onClick={() => { 
                setIsEditing(true); 
                if (activeTab === "products") setCurrentProduct({ category: "supplement" });
                if (activeTab === "banners") setCurrentBanner({ bg_gradient: "linear-gradient(135deg, #E5007E, #7C3AED)", emoji: "🔬" });
                if (activeTab === "guides") setCurrentGuide({ emoji: "🎬", gradient: "linear-gradient(135deg, #E5007E, #FF6B9D)" });
              }} style={addBtnStyle}>+ New Item</button>
            )}
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </div>
        </header>

        {activeTab === "ai" && !isEditing && (
          <div style={{ marginBottom: "40px" }}>
            <AICommentAssistant />
          </div>
        )}

        {isEditing && (
          <div style={editorContainerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900 }}>
                {activeTab === "products" ? "🧪 상품 실험 정보" : 
                 activeTab === "banners" ? "🖼️ 다이내믹 배너 설계" : 
                 activeTab === "guides" ? "📹 케어 가이드 기획" : "🤖 AI 정밀 댓글 연구소"}
              </h2>
              <button onClick={() => setIsEditing(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>✕ 닫기</button>
            </div>

            {/* --- Product Form --- */}
            {activeTab === "products" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
                <ImageDropzone 
                  url={currentProduct.image_url} 
                  uploading={uploading} 
                  onUpload={(file: File) => uploadMedia(file, "products")} 
                  onClear={() => setCurrentProduct({...currentProduct, image_url: ""})}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>상품 브랜드 & 이름</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input style={inputStyle} placeholder="브랜드" value={currentProduct.brand || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                      <input style={{...inputStyle, flex: 2}} placeholder="아이템명" value={currentProduct.name || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, name: e.target.value})} />
                    </div>
                  </div>
                  <input type="number" style={inputStyle} placeholder="판매가" value={currentProduct.price || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                  <input type="number" style={inputStyle} placeholder="정가" value={currentProduct.original_price || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, original_price: Number(e.target.value)})} />
                  <select style={inputStyle} value={currentProduct.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentProduct({...currentProduct, category: e.target.value})}>
                    <option value="food">사료·간식</option><option value="supplement">영양제</option><option value="hygiene">위생·목욕</option><option value="toy">장난감</option><option value="bedding">침구·하우스</option>
                  </select>
                  <input type="number" style={inputStyle} placeholder="재고" value={currentProduct.stock || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>상세페이지 이미지 갤러리 (여러 장 드래그 업로드 가능)</label>
                    <div style={{ 
                      border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px",
                      background: "rgba(15, 23, 42, 0.4)", marginBottom: "16px"
                    }}>
                      <input 
                        type="file" 
                        multiple 
                        onChange={async (e) => {
                          if (e.target.files) {
                            setUploading(true);
                            const files = Array.from(e.target.files);
                            const newUrls: string[] = [];
                            for (const file of files) {
                              const url = await uploadMedia(file, "products");
                              if (url) newUrls.push(url);
                            }
                            setCurrentProduct({
                              ...currentProduct, 
                              detail_images: [...(currentProduct.detail_images || []), ...newUrls]
                            });
                            setUploading(false);
                          }
                        }}
                        style={{ marginBottom: "16px", fontSize: "12px" }}
                      />
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {(currentProduct.detail_images || []).map((img: string, idx: number) => (
                          <div key={idx} style={{ position: "relative", width: "80px", height: "100px" }}>
                            <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} />
                            <div style={{ position: "absolute", top: "-5px", right: "-5px", display: "flex", gap: "2px" }}>
                              <button 
                                onClick={() => {
                                  const newList = [...(currentProduct.detail_images || [])];
                                  if (idx > 0) {
                                    [newList[idx], newList[idx-1]] = [newList[idx-1], newList[idx]];
                                    setCurrentProduct({...currentProduct, detail_images: newList});
                                  }
                                }}
                                style={{ background: "#334155", color: "#fff", border: "none", borderRadius: "4px", padding: "2px", fontSize: "10px", cursor: "pointer" }}
                              >◀</button>
                              <button 
                                onClick={() => {
                                  const newList = (currentProduct.detail_images || []).filter((_, i) => i !== idx);
                                  setCurrentProduct({...currentProduct, detail_images: newList});
                                }}
                                style={{ background: "#EF4444", color: "#fff", border: "none", borderRadius: "4px", padding: "2px", fontSize: "10px", cursor: "pointer" }}
                              >X</button>
                              <button 
                                onClick={() => {
                                  const newList = [...(currentProduct.detail_images || [])];
                                  if (idx < newList.length - 1) {
                                    [newList[idx], newList[idx+1]] = [newList[idx+1], newList[idx]];
                                    setCurrentProduct({...currentProduct, detail_images: newList});
                                  }
                                }}
                                style={{ background: "#334155", color: "#fff", border: "none", borderRadius: "4px", padding: "2px", fontSize: "10px", cursor: "pointer" }}
                              >▶</button>
                            </div>
                            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "10px", textAlign: "center", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
                              {idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <input style={inputStyle} placeholder="외부 사이트 상세 페이지 링크 (필요 시)" value={currentProduct.details_link || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentProduct({...currentProduct, details_link: e.target.value})} />
                    <button onClick={handleSaveProduct} style={saveActionBtnStyle}>상품 데이터 저장 🚀</button>
                  </div>
                </div>
              </div>
            )}

            {/* --- Banner Form --- */}
            {activeTab === "banners" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
                <ImageDropzone 
                  url={currentBanner.image_url} 
                  uploading={uploading} 
                  onUpload={(file: File) => uploadMedia(file, "banners")} 
                  onClear={() => setCurrentBanner({...currentBanner, image_url: ""})}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>배너 형태</label>
                      <select 
                        style={inputStyle} 
                        value={currentBanner.banner_type || "standard"} 
                        onChange={(e) => setCurrentBanner({...currentBanner, banner_type: e.target.value as any})}
                      >
                        <option value="standard">일반 가로 배너 (Main)</option>
                        <option value="story">9:16 스토리 배너 (Story)</option>
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={labelStyle}>배너 제목 (Landing Title)</label>
                      <input style={inputStyle} placeholder="예: 어린이날 특집 픽 상품" value={currentBanner.title || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, title: e.target.value})} />
                    </div>
                  </div>
                  
                  <div>
                    <label style={labelStyle}>보조 설명 (Sub-text, 공란 가능)</label>
                    <input style={inputStyle} placeholder="예: 우리 아이를 위한 특별한 선물" value={currentBanner.sub_text || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, sub_text: e.target.value})} />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>대표 이모지</label>
                      <input style={inputStyle} placeholder="🧪" value={currentBanner.emoji || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, emoji: e.target.value})} />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={labelStyle}>배경 그라데이션 (이미지 없을 때 사용)</label>
                      <input style={inputStyle} placeholder="linear-gradient(135deg, #FF6B9D, #E5007E)" value={currentBanner.bg_gradient || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, bg_gradient: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>연결 링크 (클릭 시 이동할 랜딩 페이지 URL)</label>
                    <input style={inputStyle} placeholder="https://..." value={currentBanner.link_url || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, link_url: e.target.value})} />
                  </div>

                  <div>
                    <label style={labelStyle}>노출 순서 (숫자가 작을수록 앞에 나옵니다)</label>
                    <input type="number" style={inputStyle} placeholder="1" value={currentBanner.order_index || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentBanner({...currentBanner, order_index: Number(e.target.value)})} />
                  </div>

                  <button onClick={handleSaveBanner} style={saveActionBtnStyle}>배너 라이브러리 저장 🚀</button>
                </div>
              </div>
            )}

            {/* --- Care Guide Form --- */}
            {activeTab === "guides" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <input style={inputStyle} placeholder="가이드 제목" value={currentGuide.title || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, title: e.target.value})} />
                <input style={inputStyle} placeholder="보조 제목" value={currentGuide.subtitle || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, subtitle: e.target.value})} />
                <input style={inputStyle} placeholder="YouTube 영상 URL" value={currentGuide.video_url || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, video_url: e.target.value})} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input style={inputStyle} placeholder="이모지 (🎬)" value={currentGuide.emoji || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, emoji: e.target.value})} />
                  <input style={{...inputStyle, flex: 2}} placeholder="배경 그라데이션" value={currentGuide.gradient || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, gradient: e.target.value})} />
                  <input type="number" style={inputStyle} placeholder="순서" value={currentGuide.order_index || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentGuide({...currentGuide, order_index: Number(e.target.value)})} />
                </div>
                <button onClick={handleSaveGuide} style={saveActionBtnStyle}>가이드 등록 완료</button>
              </div>
            )}
          </div>
        )}

        {/* --- Data List Area --- */}
        <div style={tableWrapperStyle}>
          {loading ? (
            <div style={{ padding: "80px", textAlign: "center" }}>데이터를 정밀 분석 중입니다...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <th style={thStyle}>MEDIA / PREVIEW</th>
                  <th style={thStyle}>CONTENT INFO</th>
                  <th style={thStyle}>STATUS / ORDER</th>
                  <th style={thStyle}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "products" && products.map(p => (
                  <tr key={p.id} style={trStyle}>
                    <td style={tdPadding}><img src={p.image_url} style={previewImgStyle} /></td>
                    <td style={tdPadding}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ fontWeight: 800 }}>{p.name}</div>
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{p.brand} | {p.category}</div>
                      <div style={{ marginTop: "4px", fontWeight: 700, color: "#E5007E" }}>{p.price.toLocaleString()}원</div>
                    </td>
                    <td style={tdPadding}>
                      <span style={{ ...badgeStyle, background: (p.stock || 0) < 5 ? "#FEF2F2" : "#F0FDF4", color: (p.stock || 0) < 5 ? "#EF4444" : "#22C55E" }}>
                        Stock: {p.stock || 0}
                      </span>
                    </td>
                    <td style={tdPadding}><ActionButtons onEdit={() => { setCurrentProduct(p); setIsEditing(true); }} onDelete={() => handleDelete(p.id, "products", p.image_url)} /></td>
                  </tr>
                ))}

                {activeTab === "banners" && banners.map(b => (
                  <tr key={b.id} style={trStyle}>
                    <td style={tdPadding}>
                      {b.image_url ? <img src={b.image_url} style={previewImgStyle} /> : <div style={{...previewImgStyle, background: b.bg_gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"}}>{b.emoji}</div>}
                    </td>
                    <td style={tdPadding}>
                      <div style={{ fontWeight: 800 }}>{b.title}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>{b.sub_text} | {b.banner_type === "story" ? "9:16 스토리" : "일반"}</div>
                    </td>
                    <td style={tdPadding}><span style={badgeStyle}>Index: {b.order_index}</span></td>
                    <td style={tdPadding}><ActionButtons onEdit={() => { setCurrentBanner(b); setIsEditing(true); }} onDelete={() => handleDelete(b.id, "shop_banners", b.image_url)} /></td>
                  </tr>
                ))}

                {activeTab === "guides" && careGuides.map(g => (
                  <tr key={g.id} style={trStyle}>
                    <td style={tdPadding}>
                      <div style={{...previewImgStyle, background: g.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"}}>{g.emoji}</div>
                    </td>
                    <td style={tdPadding}>
                      <div style={{ fontWeight: 800 }}>{g.title}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{g.subtitle}</div>
                      <div style={{ fontSize: "10px", color: "#3B82F6", marginTop: "4px" }}>{g.video_url}</div>
                    </td>
                    <td style={tdPadding}><span style={badgeStyle}>Index: {g.order_index}</span></td>
                    <td style={tdPadding}><ActionButtons onEdit={() => { setCurrentGuide(g); setIsEditing(true); }} onDelete={() => handleDelete(g.id, "care_guides")} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function ImageDropzone({ url, uploading, onUpload, onClear }: any) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div>
      <label style={labelStyle}>STORAGE & MEDIA</label>
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) onUpload(e.dataTransfer.files[0]); }}
        style={{ ...dropzoneStyle, borderColor: isDragging ? "#E5007E" : "rgba(255,255,255,0.1)", background: isDragging ? "rgba(229, 0, 126, 0.05)" : "rgba(15, 23, 42, 0.4)" }}
      >
        {uploading ? <p style={{ color: "#E5007E", fontWeight: 700 }}>현미경 스캔 중...</p> : 
          url ? <div style={{ position: "relative", width: "100%", height: "100%" }}><img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px" }} /><div style={magnifierOverlayStyle} /></div> 
          : <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>배너 이미지를 올려주세요</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>가로형 또는 9:16 세로형</p>
              <input type="file" onChange={(e) => e.target.files && onUpload(e.target.files[0])} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            </div>}
      </div>
      {url && <button onClick={onClear} style={{ ...miniBtnStyle, marginTop: "12px", width: "100%" }}>이미지 초기화 🗑️</button>}
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }: any) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={onEdit} style={miniBtnStyle}><Edit size={14} /></button>
      <button onClick={onDelete} style={{ ...miniBtnStyle, background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}><Trash2 size={14} /></button>
    </div>
  );
}

// ─── 스타일 상수 ──────────────────────────────────────────────────

const authCardStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "48px 40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" };
const authInputStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textAlign: "center", fontSize: "18px", marginBottom: "16px" };
const authBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#E5007E", color: "#fff", border: "none", fontSize: "16px", fontWeight: 800, cursor: "pointer" };
const addBtnStyle: React.CSSProperties = { padding: "12px 24px", borderRadius: "12px", background: "#E5007E", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" };
const logoutBtnStyle: React.CSSProperties = { padding: "12px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontWeight: 700, cursor: "pointer" };
const tabBtnStyle: React.CSSProperties = { padding: "10px 18px", borderRadius: "10px", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "13px", transition: "all 0.2s" };
const editorContainerStyle: React.CSSProperties = { background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", marginBottom: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: "14px" };
const dropzoneStyle: React.CSSProperties = { width: "100%", height: "240px", border: "2px dashed", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all 0.2s" };
const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.4)" };
const tdPadding: React.CSSProperties = { padding: "16px", verticalAlign: "middle" };
const tableWrapperStyle: React.CSSProperties = { background: "#0F172A", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" };
const trStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255,255,255,0.02)" };
const miniBtnStyle: React.CSSProperties = { padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" };
const badgeStyle: React.CSSProperties = { display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800 };
const saveActionBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#fff", color: "#0F172A", border: "none", fontSize: "16px", fontWeight: 900, cursor: "pointer", marginTop: "20px" };
const previewImgStyle: React.CSSProperties = { width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" };
const magnifierOverlayStyle: React.CSSProperties = {
  position: "absolute", top: "50%", left: "50%", width: "80px", height: "80px", transform: "translate(-50%, -50%)",
  borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 0 0 9999px rgba(0,0,0,0.3)", pointerEvents: "none"
};
