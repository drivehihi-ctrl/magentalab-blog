"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Camera, Trash2, Edit, PlayCircle, Image as ImageIcon, Sparkles, Plus, X, Layers } from "lucide-react";
import AICommentAssistant from "@/components/AICommentAssistant";

interface ProductOption {
  name: string;
  price?: number;
}

interface ProductOptionGroup {
  title: string;
  options: ProductOption[];
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
  option_groups?: ProductOptionGroup[];
  detail_images?: string[];
  details_link?: string;
  created_at?: string;
}

// ... (keep Banner and CareGuide interfaces if needed, but keeping simple for now)
interface Banner { id: string; title: string; sub_text: string; bg_gradient: string; emoji: string; image_url?: string; link_url?: string; order_index: number; banner_type?: "standard" | "story"; }
interface CareGuide { id: string; title: string; subtitle: string; emoji: string; video_url: string; gradient: string; order_index: number; }

const ADMIN_PASSCODE = "magenta123";

export default function ShopAdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "guides" | "ai">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [uploading, setUploading] = useState(false);

  // Option Group Edit States
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState<number | "">("");

  useEffect(() => {
    const auth = sessionStorage.getItem("shop_admin_authorized");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) fetchProducts();
  }, [isAuthorized]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthorized(true);
      sessionStorage.setItem("shop_admin_authorized", "true");
    } else alert("비밀번호 틀림");
  };

  const uploadMedia = async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", folder); 
      formData.append("folder", ""); 
      const response = await fetch("/api/shop/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const publicUrl = result.url;
      setCurrentProduct({ ...currentProduct, image_url: publicUrl });
      setUploading(false);
      return publicUrl;
    } catch (error: any) { 
      alert("업로드 실패: " + error.message); 
      setUploading(false);
      return null;
    }
  };

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
      option_groups: updateData.option_groups || []
    };
    if (id) await supabase.from("products").update(payload).eq("id", id);
    else await supabase.from("products").insert([payload]);
    setIsEditing(false); fetchProducts();
  }

  // --- Option Group Logic ---
  const addGroup = () => {
    if (!newGroupTitle) return;
    setCurrentProduct({
      ...currentProduct,
      option_groups: [...(currentProduct.option_groups || []), { title: newGroupTitle, options: [] }]
    });
    setNewGroupTitle("");
  };

  const removeGroup = (idx: number) => {
    const newList = (currentProduct.option_groups || []).filter((_, i) => i !== idx);
    setCurrentProduct({ ...currentProduct, option_groups: newList });
  };

  const addOptionToGroup = (groupIdx: number) => {
    if (!newOptionName) return;
    const newList = [...(currentProduct.option_groups || [])];
    const newOption: ProductOption = { name: newOptionName };
    if (newOptionPrice !== "") newOption.price = Number(newOptionPrice);
    
    newList[groupIdx].options.push(newOption);
    setCurrentProduct({ ...currentProduct, option_groups: newList });
    setNewOptionName("");
    setNewOptionPrice("");
  };

  const removeOptionFromGroup = (groupIdx: number, optIdx: number) => {
    const newList = [...(currentProduct.option_groups || [])];
    newList[groupIdx].options = newList[groupIdx].options.filter((_, i) => i !== optIdx);
    setCurrentProduct({ ...currentProduct, option_groups: newList });
  };

  if (!isAuthorized) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>
      <form onSubmit={handleAuth} style={authCardStyle}>
        <h1 style={{color:'#fff', marginBottom:'20px'}}>안심 관리 시스템</h1>
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={authInputStyle} />
        <button type="submit" style={authBtnStyle}>Unlock</button>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#F8FAFC", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900 }}>Shop Admin 2.0</h1>
          <button onClick={() => { setIsEditing(true); setCurrentProduct({ option_groups: [] }); }} style={addBtnStyle}>+ New Product</button>
        </header>

        {isEditing && (
          <div style={editorContainerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900 }}>🧪 상품 정밀 세팅</h2>
              <button onClick={() => setIsEditing(false)}>✕ 닫기</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
              <div>
                <label style={labelStyle}>상품 이미지</label>
                <div style={dropzoneStyle}>
                  {uploading ? "업로드 중..." : (currentProduct.image_url ? <img src={currentProduct.image_url} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'24px'}} /> : <input type="file" onChange={(e) => e.target.files && uploadMedia(e.target.files[0], "products")} />)}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <input style={inputStyle} placeholder="브랜드" value={currentProduct.brand || ""} onChange={(e) => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                <input style={inputStyle} placeholder="상품명" value={currentProduct.name || ""} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} />
                <input type="number" style={inputStyle} placeholder="가격" value={currentProduct.price || ""} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                
                {/* 옵션 그룹 섹션 */}
                <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={labelStyle}>다중 옵션 그룹 설정 (예: 맛, 용량)</label>
                  
                  {/* 새 그룹 추가 */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input style={inputStyle} placeholder="새 옵션 그룹 이름 (예: 맛 선택)" value={newGroupTitle} onChange={(e) => setNewGroupTitle(e.target.value)} />
                    <button onClick={addGroup} style={{ ...miniBtnStyle, background: "#E5007E", padding: "0 20px" }}>그룹 추가</button>
                  </div>

                  {/* 추가된 그룹 목록 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {(currentProduct.option_groups || []).map((group, gIdx) => (
                      <div key={gIdx} style={{ background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                          <h4 style={{ fontWeight: 800, color: "#E5007E" }}>{group.title}</h4>
                          <button onClick={() => removeGroup(gIdx)} style={{ color: "#EF4444", fontSize: "12px", background:'none', border:'none', cursor:'pointer' }}>그룹 삭제</button>
                        </div>
                        
                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                          <input style={{...inputStyle, padding:'8px 12px'}} placeholder="옵션명 (예: 연어)" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
                          <input type="number" style={{...inputStyle, padding:'8px 12px'}} placeholder="추가금" value={newOptionPrice} onChange={(e) => setNewOptionPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                          <button onClick={() => addOptionToGroup(gIdx)} style={{ background: "#334155", color: "#fff", border: "none", borderRadius: "8px", padding: "0 15px", cursor:'pointer' }}>+</button>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {group.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                              <span>{opt.name} {opt.price ? `(+${opt.price})` : ""}</span>
                              <button onClick={() => removeOptionFromGroup(gIdx, oIdx)} style={{ color: "rgba(255,255,255,0.3)", border:'none', background:'none', cursor:'pointer' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleSaveProduct} style={{ ...saveActionBtnStyle, gridColumn: "span 2" }}>최종 저장하기 🚀</button>
              </div>
            </div>
          </div>
        )}

        <div style={tableWrapperStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th style={thStyle}>PREVIEW</th>
                <th style={thStyle}>PRODUCT</th>
                <th style={thStyle}>OPTION GROUPS</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={trStyle}>
                  <td style={tdPadding}><img src={p.image_url} style={previewImgStyle} /></td>
                  <td style={tdPadding}>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{p.price.toLocaleString()}원</div>
                  </td>
                  <td style={tdPadding}>
                    {p.option_groups?.map((g, i) => (
                      <div key={i} style={{ fontSize: "11px", marginBottom: "4px" }}>
                        <span style={{ color: "#E5007E", fontWeight: 700 }}>{g.title}:</span> {g.options.map(o => o.name).join(", ")}
                      </div>
                    ))}
                  </td>
                  <td style={tdPadding}>
                    <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} style={miniBtnStyle}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Styles (same as before but simplified)
const authCardStyle: React.CSSProperties = { width: "100%", maxWidth: "420px", background: "rgba(30, 41, 59, 0.7)", borderRadius: "32px", padding: "48px 40px", textAlign: "center" };
const authInputStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#0F172A", color: "#fff", marginBottom: "16px" };
const authBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#E5007E", color: "#fff", fontWeight: 800 };
const addBtnStyle: React.CSSProperties = { padding: "12px 24px", borderRadius: "12px", background: "#E5007E", color: "#fff", fontWeight: 800 };
const tabBtnStyle: React.CSSProperties = { padding: "10px 18px", borderRadius: "10px", color: "#fff", fontWeight: 700 };
const editorContainerStyle: React.CSSProperties = { background: "#0F172A", borderRadius: "32px", padding: "40px", marginBottom: "40px" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.3)", marginBottom: "8px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(2, 6, 23, 0.6)", color: "#fff", border:'1px solid rgba(255,255,255,0.1)' };
const dropzoneStyle: React.CSSProperties = { width: "100%", height: "200px", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center" };
const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.4)" };
const tdPadding: React.CSSProperties = { padding: "16px", verticalAlign: "middle" };
const tableWrapperStyle: React.CSSProperties = { background: "#0F172A", borderRadius: "32px", overflow: "hidden" };
const trStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255,255,255,0.02)" };
const miniBtnStyle: React.CSSProperties = { padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", color: "#fff", cursor:'pointer' };
const saveActionBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#fff", color: "#0F172A", fontSize: "16px", fontWeight: 900, cursor: "pointer", marginTop: "20px" };
const previewImgStyle: React.CSSProperties = { width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" };
