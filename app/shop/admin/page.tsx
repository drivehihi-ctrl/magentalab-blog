"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
  details_link?: string;
  created_at?: string;
}

const ADMIN_PASSCODE = "magenta123";
const BUCKET_NAME = "shop_products";

export default function ShopAdminPage() {
  const { data: session, status } = useSession();
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [compressionMode, setCompressionMode] = useState<"standard" | "high">("standard");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewSize, setPreviewSize] = useState(0);

  // 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const auth = sessionStorage.getItem("shop_admin_authorized");
    if (auth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [isAuthorized]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthorized(true);
      sessionStorage.setItem("shop_admin_authorized", "true");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem("shop_admin_authorized");
  };

  // ─── 이미지 처리 유틸리티 ──────────────────────────────────────────

  // 이미지 압축 (Canvas 이용)
  const compressImage = async (file: File, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context failed"));

          // 최대 1200px 규모로 조정
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
              resolve(compressedFile);
            } else {
              reject(new Error("Compression failed"));
            }
          }, "image/jpeg", quality);
        };
      };
      reader.onerror = (e) => reject(e);
    });
  };

  // 기존 이미지 삭제 유틸
  const deleteOldFile = async (url: string) => {
    if (!url || !url.includes(BUCKET_NAME)) return;
    try {
      const fileName = url.split("/").pop();
      if (fileName) {
        await supabase.storage.from(BUCKET_NAME).remove([`products/${fileName}`]);
      }
    } catch (e) {
      console.error("Old file deletion failed", e);
    }
  };

  // 최종 업로드 로직
  const uploadToStorage = async (file: File) => {
    setUploading(true);
    try {
      // 기존 이미지 삭제 (수정 시)
      if (currentProduct.image_url) {
        await deleteOldFile(currentProduct.image_url);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      setCurrentProduct({ ...currentProduct, image_url: publicUrl });
      setPendingFile(null);
    } catch (error: any) {
      alert("업로드 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 파일 선택/드롭 핸들러
  const handleFileAction = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setPendingFile(file);
    // 즉시 업로드 (입력 시 바로)
    await uploadToStorage(file);
  };

  // 수동 최적화 버튼 클릭 시
  const handleOptimizeAction = async () => {
    if (!pendingFile && !currentProduct.image_url) return;
    setOptimizing(true);
    try {
      alert(`0.1% 정밀 압축(${compressionMode === "standard" ? "80%" : "고강도"})을 시작합니다...`);

      const quality = compressionMode === "standard" ? 0.8 : 0.4;
      
      if (pendingFile) {
        const compressed = await compressImage(pendingFile, quality);
        await uploadToStorage(compressed);
        alert("최적화 완료! 용량이 획기적으로 줄어들었습니다. 🧪");
      } else {
        alert("새로운 이미지를 드래그하여 업로드할 때 최적화가 적용됩니다!");
      }
    } finally {
      setOptimizing(false);
    }
  };

  // ─── 드래그 앤 드롭 이벤트 ──────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileAction(e.dataTransfer.files);
  };

  // ─── CRUD ───────────────────────────────────────────────────────

  async function handleSave() {
    if (!currentProduct.name || !currentProduct.price) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    const payload = {
      ...currentProduct,
      price: Number(currentProduct.price),
      original_price: Number(currentProduct.original_price || currentProduct.price),
      stock: Number(currentProduct.stock || 0),
    };

    if (currentProduct.id) {
      await supabase.from("products").update(payload).eq("id", currentProduct.id);
    } else {
      await supabase.from("products").insert([payload]);
    }

    setIsEditing(false);
    setCurrentProduct({});
    fetchProducts();
  }

  async function handleDelete(id: number, imageUrl?: string) {
    if (!confirm("⚠️ [자동 파쇄 경고]\n이 상품을 삭제하면 데이터베이스 정보와 함께 스토리지에 저장된 이미지 파일이 영구 삭제됩니다. 계속하시겠습니까?")) return;
    
    // 이미지 삭제
    if (imageUrl) {
      await deleteOldFile(imageUrl);
    }
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) fetchProducts();
  }

  // ─── UI ─────────────────────────────────────────────────────────

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "48px 40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
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
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.04em" }}>Shop Intelligence Dashboard</h1>
            <p style={{ color: "#94A3B8", fontSize: "14px" }}>안심 연구원의 0.1% 정밀 재고 및 미디어 라이브러리</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => { setIsEditing(true); setCurrentProduct({ category: "supplement", badge: "" }); }} style={addBtnStyle}>+ New Research Item</button>
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </div>
        </header>

        {isEditing && (
          <div style={editorContainerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900 }}>{currentProduct.id ? "🔬 아이템 수정 중" : "🧪 신규 연구 물품 등록"}</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>✕ 닫기</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
              {/* 왼쪽: 이미지 업로드 섹션 */}
              <div>
                <label style={labelStyle}>STORAGE & MEDIA</label>
                <div 
                  onDragOver={onDragOver} 
                  onDragLeave={onDragLeave} 
                  onDrop={onDrop}
                  style={{
                    ...dropzoneStyle,
                    borderColor: isDragging ? "#E5007E" : "rgba(255,255,255,0.1)",
                    background: isDragging ? "rgba(229, 0, 126, 0.05)" : "rgba(15, 23, 42, 0.4)"
                  }}
                >
                  {uploading ? (
                    <div style={{ textAlign: "center" }}>
                      <div className="shop-loading-spin" style={{ margin: "0 auto 12px" }} />
                      <p style={{ fontSize: "13px", color: "#E5007E", fontWeight: 700 }}>현미경으로 이미지 스캔 중...</p>
                    </div>
                  ) : currentProduct.image_url ? (
                    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden" }}>
                       <img src={currentProduct.image_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                       {/* Magnifying glass Effect Overlay (Css) */}
                       <div style={magnifierOverlayStyle} />
                       <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "6px", fontSize: "10px" }}>
                         0.1% 정밀 프리뷰 활성
                       </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>여기에 연구 물품 사진을 던져주세요!</p>
                      <p style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>또는 클릭하여 파일 선택 (shop_products 전용)</p>
                      <input 
                        type="file" 
                        onChange={(e) => handleFileAction(e.target.files)} 
                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} 
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                   <div style={{ width: "100%", display: "flex", background: "rgba(15, 23, 42, 0.4)", borderRadius: "12px", padding: "4px", marginBottom: "8px" }}>
                     <button 
                       onClick={() => setCompressionMode("standard")}
                       style={{ ...modeBtnStyle, background: compressionMode === "standard" ? "#E5007E" : "transparent" }}
                     >표준(80%)</button>
                     <button 
                       onClick={() => setCompressionMode("high")}
                       style={{ ...modeBtnStyle, background: compressionMode === "high" ? "#E5007E" : "transparent" }}
                     >고강도</button>
                   </div>
                   <button 
                     onClick={handleOptimizeAction}
                     disabled={!currentProduct.image_url || optimizing}
                     style={optimizeBtnStyle}
                   >
                     ⚡ {optimizing ? "최적화 중..." : "용량을 0.1% 더 가볍게 만들기"}
                   </button>
                   {currentProduct.image_url && (
                     <button 
                       onClick={() => setCurrentProduct({...currentProduct, image_url: ""})}
                       style={{ ...optimizeBtnStyle, background: "rgba(255,255,255,0.05)", flex: "0 0 auto" }}
                     >🗑️</button>
                   )}
                </div>
              </div>

              {/* 오른쪽: 상세 정보 입력 섹션 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>상품 브랜드 & 이름</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="브랜드명" value={currentProduct.brand || ""} onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                    <input style={{ ...inputStyle, flex: 2 }} placeholder="아이템 정식 명칭" value={currentProduct.name || ""} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>판매 가격 (KRW)</label>
                  <input type="number" style={inputStyle} value={currentProduct.price || ""} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={labelStyle}>정상 가격 (할인 전)</label>
                  <input type="number" style={inputStyle} value={currentProduct.original_price || ""} onChange={e => setCurrentProduct({...currentProduct, original_price: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={labelStyle}>카테고리</label>
                  <select style={inputStyle} value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}>
                    <option value="food">사료·간식</option>
                    <option value="supplement">영양제</option>
                    <option value="hygiene">위생·목욕</option>
                    <option value="toy">장난감</option>
                    <option value="bedding">침구·하우스</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>현재 재고량</label>
                  <input type="number" style={inputStyle} value={currentProduct.stock || 0} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>외부 상세 페이지 링크 URL</label>
                  <input style={inputStyle} placeholder="https://..." value={currentProduct.details_link || ""} onChange={e => setCurrentProduct({...currentProduct, details_link: e.target.value})} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                   <button onClick={handleSave} style={saveActionBtnStyle}>
                     {currentProduct.id ? "연구 결과 업데이트 완료" : "신규 필드 아이템으로 등록"}
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 제품 리스트 영역 */}
        <div style={tableWrapperStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th style={thStyle}>RESEARCH PHOTO</th>
                <th style={thStyle}>SPECIFICATIONS</th>
                <th style={thStyle}>INVENTORY</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "60px", textAlign: "center" }}>데이터 로딩 중...</td></tr>
              ) : products.map(p => (
                <tr key={p.id} style={trStyle}>
                  <td style={tdPadding}><img src={p.image_url} style={{ width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" }} /></td>
                  <td style={tdPadding}>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{p.brand} | {p.category}</div>
                    <div style={{ marginTop: "4px", fontWeight: 700, color: "#E5007E" }}>{p.price.toLocaleString()}원</div>
                  </td>
                  <td style={tdPadding}>
                    <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800, background: (p.stock || 0) < 5 ? "#FEF2F2" : "#F0FDF4", color: (p.stock || 0) < 5 ? "#EF4444" : "#22C55E" }}>
                      Stock: {p.stock || 0}
                    </div>
                  </td>
                  <td style={tdPadding}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} style={miniBtnStyle}>Edit</button>
                      <button onClick={() => handleDelete(p.id, p.image_url)} style={{ ...miniBtnStyle, background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>Delete</button>
                    </div>
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

// ─── 스타일 상수 ──────────────────────────────────────────────────

const authInputStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textAlign: "center", fontSize: "18px", marginBottom: "16px" };
const authBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#E5007E", color: "#fff", border: "none", fontSize: "16px", fontWeight: 800, cursor: "pointer" };
const addBtnStyle: React.CSSProperties = { padding: "12px 24px", borderRadius: "12px", background: "#E5007E", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" };
const logoutBtnStyle: React.CSSProperties = { padding: "12px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", fontWeight: 700, cursor: "pointer" };
const editorContainerStyle: React.CSSProperties = { background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", marginBottom: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: "14px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" };
const dropzoneStyle: React.CSSProperties = { width: "100%", height: "240px", border: "2px dashed", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all 0.2s" };
const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.4)" };
const tdPadding: React.CSSProperties = { padding: "16px", verticalAlign: "middle" };
const tableWrapperStyle: React.CSSProperties = { background: "#0F172A", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" };
const trStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255,255,255,0.02)" };
const miniBtnStyle: React.CSSProperties = { padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" };
const optimizeBtnStyle: React.CSSProperties = { flex: 1, padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #E5007E 0%, #FF41AA 100%)", color: "#fff", border: "none", fontSize: "12px", fontWeight: 800, cursor: "pointer" };
const modeBtnStyle: React.CSSProperties = { flex: 1, padding: "8px", borderRadius: "10px", border: "none", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" };
const saveActionBtnStyle: React.CSSProperties = { width: "100%", padding: "18px", borderRadius: "16px", background: "#fff", color: "#0F172A", border: "none", fontSize: "16px", fontWeight: 900, cursor: "pointer", marginTop: "20px" };
const magnifierOverlayStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "80px",
  height: "80px",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
  border: "2px solid rgba(255,255,255,0.6)",
  boxShadow: "0 0 0 9999px rgba(0,0,0,0.3)",
  pointerEvents: "none"
};
