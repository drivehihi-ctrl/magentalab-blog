"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Camera, Trash2, Edit, PlayCircle, Image as ImageIcon, Sparkles, Plus, X } from "lucide-react";
import AICommentAssistant from "@/components/AICommentAssistant";

interface ProductOption {
  name: string;
  price?: number;
}

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
  options?: ProductOption[];
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
  
  // Option State
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState<number | "">("");

  // Media States
  const [uploading, setUploading] = useState(false);
  
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
      // if (currentUrl) await deleteOldFile(currentUrl, folder); // Optional: delete old file
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", folder); 
      formData.append("folder", ""); 

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
      alert("업로드 실패: " + error.message); 
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
      detail_images: updateData.detail_images || [],
      options: updateData.options || []
    };
    let result;
    if (id) result = await supabase.from("products").update(payload).eq("id", id);
    else result = await supabase.from("products").insert([payload]);
    
    if (result.error) alert("저장 실패: " + result.error.message);
    else { setIsEditing(false); fetchProducts(); }
  }

  const addOption = () => {
    if (!newOptionName) return;
    const newOption: ProductOption = { name: newOptionName };
    if (newOptionPrice !== "") newOption.price = Number(newOptionPrice);
    
    setCurrentProduct({
      ...currentProduct,
      options: [...(currentProduct.options || []), newOption]
    });
    setNewOptionName("");
    setNewOptionPrice("");
  };

  const removeOption = (index: number) => {
    const newList = (currentProduct.options || []).filter((_, i) => i !== index);
    setCurrentProduct({ ...currentProduct, options: newList });
  };

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
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from(table).delete().eq("id", id);
    if (table === "products") fetchProducts();
    if (table === "shop_banners") fetchBanners();
    if (table === "care_guides") fetchCareGuides();
  }

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
            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              <button onClick={() => { setActiveTab("products"); setIsEditing(false); }} style={{ ...tabBtnStyle, background: activeTab === "products" ? "#E5007E" : "rgba(255,255,255,0.05)" }}>📦 상품 관리</button>
              <button onClick={() => { setActiveTab("banners"); setIsEditing(false); }} style={{ ...tabBtnStyle, background: activeTab === "banners" ? "#E5007E" : "rgba(255,255,255,0.05)" }}>🖼️ 배너 제어</button>
              <button onClick={() => { setActiveTab("guides"); setIsEditing(false); }} style={{ ...tabBtnStyle, background: activeTab === "guides" ? "#E5007E" : "rgba(255,255,255,0.05)" }}>🎬 케어 가이드</button>
              <button onClick={() => { setActiveTab("ai"); setIsEditing(false); }} style={{ ...tabBtnStyle, background: activeTab === "ai" ? "#E5007E" : "rgba(255,255,255,0.05)" }}>🤖 AI 연구 지원</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {activeTab !== "ai" && (
              <button onClick={() => { 
                setIsEditing(true); 
                if (activeTab === "products") setCurrentProduct({ category: "supplement", options: [], detail_images: [] });
                if (activeTab === "banners") setCurrentBanner({ bg_gradient: "linear-gradient(135deg, #E5007E, #7C3AED)", emoji: "🔬" });
                if (activeTab === "guides") setCurrentGuide({ emoji: "🎬", gradient: "linear-gradient(135deg, #E5007E, #FF6B9D)" });
              }} style={addBtnStyle}>+ New Item</button>
            )}
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </div>
        </header>

        {isEditing && (
          <div style={editorContainerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900 }}>{activeTab === "products" ? "🧪 상품 실험 정보" : "기타 관리"}</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>✕ 닫기</button>
            </div>

            {activeTab === "products" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
                <div>
                   <label style={labelStyle}>메인 이미지</label>
                   <div style={dropzoneStyle}>
                     {uploading ? <p>업로드 중...</p> : (currentProduct.image_url ? <img src={currentProduct.image_url} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'24px'}} /> : <input type="file" onChange={(e) => e.target.files && uploadMedia(e.target.files[0], "products")} />)}
                   </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <input style={inputStyle} placeholder="브랜드" value={currentProduct.brand || ""} onChange={(e) => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                  <input style={inputStyle} placeholder="상품명" value={currentProduct.name || ""} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} />
                  <input type="number" style={inputStyle} placeholder="가격" value={currentProduct.price || ""} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                  <select style={inputStyle} value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}>
                    <option value="food">사료·간식</option><option value="supplement">영양제</option><option value="hygiene">위생·목욕</option>
                  </select>
                  
                  {/* 옵션 관리 섹션 */}
                  <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <label style={labelStyle}>상품 옵션 (예: 소고기, 연어)</label>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                      <input style={inputStyle} placeholder="옵션 이름" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
                      <input type="number" style={inputStyle} placeholder="추가 금액 (없으면 비우기)" value={newOptionPrice} onChange={(e) => setNewOptionPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                      <button onClick={addOption} style={{ ...miniBtnStyle, background: "#E5007E", padding: "0 20px" }}>추가</button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {(currentProduct.options || []).map((opt, idx) => (
                        <div key={idx} style={{ background: "rgba(229, 0, 126, 0.1)", border: "1px solid #E5007E", padding: "6px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px" }}>{opt.name} {opt.price ? `(+${opt.price}원)` : ""}</span>
                          <button onClick={() => removeOption(idx)} style={{ background: "none", border: "none", color: "#E5007E", cursor: "pointer" }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSaveProduct} style={{ ...saveActionBtnStyle, gridColumn: "span 2" }}>저장하기 🚀</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={tableWrapperStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th style={thStyle}>PREVIEW</th>
                <th style={thStyle}>INFO</th>
                <th style={thStyle}>OPTIONS</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "products" && products.map(p => (
                <tr key={p.id} style={trStyle}>
                  <td style={tdPadding}><img src={p.image_url} style={previewImgStyle} /></td>
                  <td style={tdPadding}>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{p.brand} | {p.price.toLocaleString()}원</div>
                  </td>
                  <td style={tdPadding}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(p.options || []).map((o, i) => <span key={i} style={{fontSize:'10px', background:'rgba(255,255,255,0.05)', padding:'2px 6px', borderRadius:'4px'}}>{o.name}</span>)}
                    </div>
                  </td>
                  <td style={tdPadding}><ActionButtons onEdit={() => { setCurrentProduct(p); setIsEditing(true); }} onDelete={() => handleDelete(p.id, "products")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Styles
const authCardStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "48px 40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" };
const authInputStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textAlign: "center", fontSize: "18px", marginBottom: "16px" };
const authBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#E5007E", color: "#fff", border: "none", fontSize: "16px", fontWeight: 800, cursor: "pointer" };
const addBtnStyle: React.CSSProperties = { padding: "12px 24px", borderRadius: "12px", background: "#E5007E", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" };
const logoutBtnStyle: React.CSSProperties = { padding: "12px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontWeight: 700, cursor: "pointer" };
const tabBtnStyle: React.CSSProperties = { padding: "10px 18px", borderRadius: "10px", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "13px", transition: "all 0.2s" };
const editorContainerStyle: React.CSSProperties = { background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", marginBottom: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: "14px" };
const dropzoneStyle: React.CSSProperties = { width: "100%", height: "200px", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" };
const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.4)" };
const tdPadding: React.CSSProperties = { padding: "16px", verticalAlign: "middle" };
const tableWrapperStyle: React.CSSProperties = { background: "#0F172A", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" };
const trStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255,255,255,0.02)" };
const miniBtnStyle: React.CSSProperties = { padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" };
const saveActionBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#fff", color: "#0F172A", border: "none", fontSize: "16px", fontWeight: 900, cursor: "pointer", marginTop: "20px" };
const previewImgStyle: React.CSSProperties = { width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" };

function ActionButtons({ onEdit, onDelete }: any) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={onEdit} style={miniBtnStyle}><Edit size={14} /></button>
      <button onClick={onDelete} style={{ ...miniBtnStyle, background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}><Trash2 size={14} /></button>
    </div>
  );
}
