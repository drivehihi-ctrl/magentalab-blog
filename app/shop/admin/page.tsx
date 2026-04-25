"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Trash2, Edit, Plus, X, 
  Settings, Image as ImageIcon, Search, 
  Download, Upload, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, GripVertical
} from "lucide-react";

// --- Types ---
interface ProductOption {
  name: string;
  price?: number;
  stock?: number;
  is_visible?: boolean;
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
  stock: number;
  use_options: boolean;
  option_groups: ProductOptionGroup[];
  detail_images: string[];
  tags: string[];
  seo_title: string;
  seo_description: string;
  created_at?: string;
}

const ADMIN_PASSCODE = "magenta123";

export default function ShopAdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    use_options: false,
    option_groups: [],
    detail_images: [],
    tags: []
  });
  const [uploading, setUploading] = useState(false);

  // Option UI States
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [tempOptionName, setTempOptionName] = useState("");
  const [tempOptionPrice, setTempOptionPrice] = useState<number | "">("");

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

  const uploadMedia = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "products"); 
      const response = await fetch("/api/shop/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUploading(false);
      return result.url;
    } catch (error: any) { 
      alert("업로드 실패: " + error.message); 
      setUploading(false);
      return null;
    }
  };

  async function handleSaveProduct() {
    const { id, created_at, ...updateData } = currentProduct as any;
    const payload = {
      ...updateData,
      price: Number(updateData.price || 0),
      original_price: Number(updateData.original_price || updateData.price || 0),
      stock: Number(updateData.stock || 0),
    };
    
    if (id) await supabase.from("products").update(payload).eq("id", id);
    else await supabase.from("products").insert([payload]);
    
    setIsEditing(false);
    fetchProducts();
  }

  // --- Render Helpers ---
  const SectionTitle = ({ icon: Icon, title, sub }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderLeft: '4px solid #00C73C', paddingLeft: '15px' }}>
      <Icon size={20} color="#00C73C" />
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{title}</h3>
        {sub && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{sub}</p>}
      </div>
    </div>
  );

  if (!isAuthorized) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A" }}>
      <form onSubmit={handleAuth} style={authCardStyle}>
        <h1 style={{color:'#fff', marginBottom:'20px'}}>안심 커머스 엔진</h1>
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={authInputStyle} placeholder="Passcode" />
        <button type="submit" style={authBtnStyle}>Unlock Dashboard</button>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#101828", color: "#F2F4F7", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900 }}>Smart Store Admin</h1>
            <p style={{ color: '#667085', fontSize: '14px' }}>마젠타 펫 연구소 전용 상품 관리 시스템</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={outlineBtnStyle}><Download size={16} /> 엑셀 다운로드</button>
            <button style={outlineBtnStyle}><Upload size={16} /> 엑셀 일괄등록</button>
            <button onClick={() => { setIsEditing(true); setCurrentProduct({ use_options: false, option_groups: [], detail_images: [], tags: [] }); }} style={primaryBtnStyle}>+ 상품 등록</button>
          </div>
        </header>

        {isEditing && (
          <div style={naverEditorStyle}>
            {/* 1. 기본 정보 */}
            <div style={formSectionStyle}>
              <SectionTitle icon={CheckCircle2} title="기본정보" sub="상품의 핵심 정보를 입력하세요." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}>
                  <label>상품명 <span style={{color:'#00C73C'}}>*</span></label>
                  <input style={naverInputStyle} placeholder="예: [마젠타] 프리미엄 강아지 간식 소고기맛" value={currentProduct.name || ""} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
                </div>
                <div style={inputGroupStyle}>
                  <label>판매가 <span style={{color:'#00C73C'}}>*</span></label>
                  <input type="number" style={naverInputStyle} placeholder="0" value={currentProduct.price || ""} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                </div>
                <div style={inputGroupStyle}>
                  <label>브랜드</label>
                  <input style={naverInputStyle} placeholder="마젠타연구소" value={currentProduct.brand || ""} onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                </div>
                <div style={inputGroupStyle}>
                  <label>재고수량</label>
                  <input type="number" style={naverInputStyle} value={currentProduct.stock || 0} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            {/* 2. 이미지 설정 */}
            <div style={formSectionStyle}>
              <SectionTitle icon={ImageIcon} title="상품이미지" sub="대표 이미지는 1000x1000 크기를 권장합니다." />
              <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{ width: '200px' }}>
                  <label style={{ fontSize:'13px', marginBottom:'10px', display:'block', fontWeight:700 }}>대표이미지</label>
                  <div style={naverDropzoneStyle}>
                    {currentProduct.image_url ? (
                      <div style={{ position:'relative', width:'100%', height:'100%' }}>
                        <img src={currentProduct.image_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        <button onClick={() => setCurrentProduct({...currentProduct, image_url: ""})} style={deleteBtnStyle}><X size={12}/></button>
                      </div>
                    ) : (
                      <div style={{ textAlign:'center' }}>
                        <Plus size={24} color="#98A2B3" />
                        <input type="file" style={fileHiddenStyle} onChange={async e => { if(e.target.files) { const url = await uploadMedia(e.target.files[0]); if(url) setCurrentProduct({...currentProduct, image_url: url}); } }} />
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize:'13px', marginBottom:'10px', display:'block', fontWeight:700 }}>추가이미지 (상세페이지용)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {(currentProduct.detail_images || []).map((img, idx) => (
                      <div key={idx} style={{ ...naverDropzoneStyle, width:'100px', height:'100px' }}>
                         <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                         <button onClick={() => {
                           const newList = [...(currentProduct.detail_images || [])];
                           newList.splice(idx, 1);
                           setCurrentProduct({...currentProduct, detail_images: newList});
                         }} style={deleteBtnStyle}><X size={10}/></button>
                      </div>
                    ))}
                    <div style={{ ...naverDropzoneStyle, width:'100px', height:'100px', borderStyle:'dashed' }}>
                       <Plus size={20} color="#98A2B3" />
                       <input type="file" multiple style={fileHiddenStyle} onChange={async e => {
                         if(e.target.files) {
                           const files = Array.from(e.target.files);
                           for(const f of files) {
                             const url = await uploadMedia(f);
                             if(url) setCurrentProduct(prev => ({ ...prev, detail_images: [...(prev.detail_images || []), url] }));
                           }
                         }
                       }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 옵션 설정 (네이버 스타일) */}
            <div style={formSectionStyle}>
              <SectionTitle icon={Settings} title="옵션" sub="맛, 용량 등 상품의 옵션을 설정하세요." />
              <div style={{ background: '#1D2939', padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <span>옵션 설정여부</span>
                  <div 
                    onClick={() => setCurrentProduct({...currentProduct, use_options: !currentProduct.use_options})}
                    style={{ ...toggleStyle, background: currentProduct.use_options ? '#00C73C' : '#475467' }}
                  >
                    <div style={{ ...toggleCircleStyle, transform: currentProduct.use_options ? 'translateX(24px)' : 'translateX(4px)' }} />
                  </div>
                  <span style={{ fontSize:'13px', color: currentProduct.use_options ? '#00C73C' : '#98A2B3' }}>
                    {currentProduct.use_options ? "설정함" : "설정안함"}
                  </span>
                </div>

                {currentProduct.use_options && (
                  <div style={{ borderTop: '1px solid #344054', paddingTop: '20px' }}>
                    <div style={{ display:'flex', gap:'10px', marginBottom:'15px' }}>
                      <input style={naverInputStyle} placeholder="옵션명 (예: 맛 선택)" value={newGroupTitle} onChange={e => setNewGroupTitle(e.target.value)} />
                      <button onClick={() => { if(newGroupTitle) { setCurrentProduct({...currentProduct, option_groups:[...(currentProduct.option_groups||[]), {title:newGroupTitle, options:[]}]}); setNewGroupTitle(""); } }} style={outlineBtnStyle}>그룹 추가</button>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                      {currentProduct.option_groups?.map((group, gIdx) => (
                        <div key={gIdx} style={{ background:'#101828', padding:'15px', borderRadius:'10px', border:'1px solid #344054' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                            <span style={{ fontWeight:800, color:'#00C73C' }}>{group.title}</span>
                            <button onClick={() => { const newList = [...(currentProduct.option_groups||[])]; newList.splice(gIdx,1); setCurrentProduct({...currentProduct, option_groups:newList}); }} style={{ color:'#F04438', fontSize:'12px', background:'none', border:'none', cursor:'pointer' }}>삭제</button>
                          </div>
                          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                             {group.options.map((opt, oIdx) => (
                               <div key={oIdx} style={optionTagStyle}>
                                 {opt.name} {opt.price ? `(+${opt.price})` : ""}
                                 <button onClick={() => { const newList = [...(currentProduct.option_groups||[])]; newList[gIdx].options.splice(oIdx,1); setCurrentProduct({...currentProduct, option_groups:newList}); }} style={{ background:'none', border:'none', color:'#fff', marginLeft:'5px', cursor:'pointer' }}>✕</button>
                               </div>
                             ))}
                             <div style={{ display:'flex', gap:'5px' }}>
                               <input style={{ ...naverInputStyle, width:'100px', height:'30px', fontSize:'12px' }} placeholder="옵션값" value={tempOptionName} onChange={e => setTempOptionName(e.target.value)} />
                               <button onClick={() => {
                                 if(!tempOptionName) return;
                                 const newList = [...(currentProduct.option_groups||[])];
                                 newList[gIdx].options.push({ name: tempOptionName });
                                 setCurrentProduct({...currentProduct, option_groups: newList});
                                 setTempOptionName("");
                               }} style={{ ...outlineBtnStyle, padding:'0 10px', height:'30px' }}>+</button>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. 검색/SEO 설정 */}
            <div style={formSectionStyle}>
              <SectionTitle icon={Search} title="검색설정" sub="검색 노출을 위한 메타 정보와 태그를 입력하세요." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={inputGroupStyle}>
                  <label>SEO 제목 (브라우저 타이틀)</label>
                  <input style={naverInputStyle} placeholder="미입력 시 상품명이 노출됩니다." value={currentProduct.seo_title || ""} onChange={e => setCurrentProduct({...currentProduct, seo_title: e.target.value})} />
                </div>
                <div style={inputGroupStyle}>
                  <label>SEO 설명 (메타 디스크립션)</label>
                  <textarea style={{ ...naverInputStyle, height:'80px', resize:'none' }} placeholder="검색 결과에 표시될 요약 문구를 입력하세요." value={currentProduct.seo_description || ""} onChange={e => setCurrentProduct({...currentProduct, seo_description: e.target.value})} />
                </div>
                <div style={inputGroupStyle}>
                  <label>검색 태그 (콤마로 구분)</label>
                  <input style={naverInputStyle} placeholder="예: 강아지간식, 건강간식, 연어" value={currentProduct.tags?.join(", ") || ""} onChange={e => setCurrentProduct({...currentProduct, tags: e.target.value.split(",").map(t => t.trim())})} />
                  <p style={{ fontSize:'11px', color:'#98A2B3', marginTop:'5px' }}>* 최대 10개까지 입력 가능합니다.</p>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'15px', marginTop:'40px' }}>
              <button onClick={() => setIsEditing(false)} style={outlineBtnStyle}>취소</button>
              <button onClick={handleSaveProduct} style={saveBtnStyle}>상품 저장하기</button>
            </div>
          </div>
        )}

        {/* --- 상품 목록 --- */}
        {!isEditing && (
          <div style={tableCardStyle}>
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ background:'#1D2939', borderBottom:'1px solid #344054' }}>
                   <th style={thStyle}>상품정보</th>
                   <th style={thStyle}>가격</th>
                   <th style={thStyle}>재고</th>
                   <th style={thStyle}>상태</th>
                   <th style={thStyle}>관리</th>
                 </tr>
               </thead>
               <tbody>
                 {products.map(p => (
                   <tr key={p.id} style={{ borderBottom:'1px solid #1D2939' }}>
                     <td style={tdStyle}>
                       <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                         <img src={p.image_url} style={{ width:'40px', height:'40px', borderRadius:'8px', objectFit:'cover' }} />
                         <div>
                           <div style={{ fontWeight:700 }}>{p.name}</div>
                           <div style={{ fontSize:'12px', color:'#98A2B3' }}>{p.brand} | {p.category}</div>
                         </div>
                       </div>
                     </td>
                     <td style={tdStyle}>{p.price.toLocaleString()}원</td>
                     <td style={tdStyle}>{p.stock}</td>
                     <td style={tdStyle}>
                       <span style={{ fontSize:'11px', color:'#00C73C', background:'rgba(0,199,60,0.1)', padding:'2px 8px', borderRadius:'10px' }}>판매중</span>
                     </td>
                     <td style={tdStyle}>
                        <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} style={{ background:'none', border:'none', color:'#98A2B3', cursor:'pointer' }}><Edit size={16} /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles (Naver Smart Store Inspired) ---
const naverEditorStyle: React.CSSProperties = { background: '#101828', borderRadius: '16px', border: '1px solid #344054', padding: '40px' };
const formSectionStyle: React.CSSProperties = { marginBottom: '48px' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const naverInputStyle: React.CSSProperties = { background: '#1D2939', border: '1px solid #344054', borderRadius: '8px', padding: '12px 16px', color: '#fff', outline: 'none', fontSize: '14px' };
const primaryBtnStyle: React.CSSProperties = { background: '#00C73C', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const outlineBtnStyle: React.CSSProperties = { background: 'none', color: '#F2F4F7', border: '1px solid #344054', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const saveBtnStyle: React.CSSProperties = { background: '#00C73C', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px 40px', fontWeight: 900, cursor: 'pointer', fontSize: '16px' };
const naverDropzoneStyle: React.CSSProperties = { width: '100%', height: '200px', border: '1px solid #344054', borderRadius: '8px', background: '#1D2939', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow:'hidden' };
const fileHiddenStyle: React.CSSProperties = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };
const deleteBtnStyle: React.CSSProperties = { position: 'absolute', top: 5, right: 5, background: 'rgba(240, 68, 56, 0.8)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' };
const toggleStyle: React.CSSProperties = { width: '52px', height: '28px', borderRadius: '14px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' };
const toggleCircleStyle: React.CSSProperties = { width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '4px', transition: 'all 0.2s' };
const optionTagStyle: React.CSSProperties = { background: '#344054', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center' };
const tableCardStyle: React.CSSProperties = { background: '#101828', border: '1px solid #344054', borderRadius: '16px', overflow: 'hidden' };
const thStyle: React.CSSProperties = { padding: '15px 20px', textAlign: 'left', fontSize: '12px', color: '#98A2B3', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '20px', fontSize: '14px' };
const authCardStyle: React.CSSProperties = { background: '#1D2939', padding: '48px', borderRadius: '24px', textAlign: 'center', border: '1px solid #344054', width: '400px' };
const authInputStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', background: '#101828', border: '1px solid #344054', color: '#fff', marginBottom: '15px', textAlign: 'center', fontSize: '18px' };
const authBtnStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', background: '#00C73C', border: 'none', color: '#fff', fontWeight: 800, fontSize: '16px', cursor: 'pointer' };
