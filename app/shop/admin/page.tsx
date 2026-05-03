"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Trash2, Edit, Plus, X, 
  Settings, ImageIcon, Search, 
  Download, Upload, CheckCircle2,
  FileText, Sparkles, Link as LinkIcon, Factory
} from "lucide-react";
import AICommentAssistant from "@/components/AICommentAssistant";

// --- Types ---
interface ProductOption { name: string; price?: number; stock?: number; }
interface ProductOptionGroup { title: string; options: ProductOption[]; }
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price: number;
  description: string;
  tag: string;
  image_url: string;
  additional_images: string[];
  detail_images: string[];
  category: string;
  badge: string; // [RESTORED]
  stock: number;
  details_link: string; // [RESTORED]
  use_options: boolean;
  option_groups: ProductOptionGroup[];
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
    use_options: false, option_groups: [], additional_images: [], detail_images: [], tags: [], badge: "", details_link: "", description: "", tag: ""
  });
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [banners, setBanners] = useState<any[]>([]);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<any>({ image_url: "", link_url: "", order_index: 0, is_active: true });

  useEffect(() => {
    const auth = sessionStorage.getItem("shop_admin_authorized");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
      fetchBanners();
    }
  }, [isAuthorized]);

  async function fetchBanners() {
    const { data } = await supabase.from("shop_banners").select("*").order("order_index", { ascending: true });
    if (data) setBanners(data);
  }

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
      setUploading(false);
      return result.url;
    } catch (error) { 
      setUploading(false);
      return null;
    }
  };

  async function handleSaveProduct() {
    try {
      const { id, created_at, ...updateData } = currentProduct as any;
      const payload = {
        ...updateData,
        price: Number(updateData.price || 0),
        original_price: Number(updateData.original_price || updateData.price || 0),
        stock: Number(updateData.stock || 0),
      };
      
      let result;
      if (id) {
        result = await supabase.from("products").update(payload).eq("id", id);
      } else {
        result = await supabase.from("products").insert([payload]);
      }

      if (result.error) throw result.error;

      alert("✅ 상품 정보가 성공적으로 저장되었습니다!");
      setIsEditing(false); 
      fetchProducts();
    } catch (error: any) {
      console.error("Save Product Error:", error);
      alert("❌ 저장 실패: " + (error.message || "알 수 없는 오류가 발생했습니다."));
    }
  }

  async function handleDeleteProduct(id: number, name: string) {
    if (confirm(`[경고] "${name}" 상품을 정말로 삭제하시겠습니까?`)) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  async function handleSaveBanner() {
    const { id, created_at, ...updateData } = currentBanner;
    if (id) await supabase.from("shop_banners").update(updateData).eq("id", id);
    else await supabase.from("shop_banners").insert([updateData]);
    setIsEditingBanner(false); fetchBanners();
  }

  async function handleDeleteBanner(id: number) {
    if (confirm(`배너를 삭제하시겠습니까?`)) {
      await supabase.from("shop_banners").delete().eq("id", id);
      fetchBanners();
    }
  }

  async function getAIRecommendations() {
    if (!currentProduct.name) return alert("상품명을 먼저 입력해주세요!");
    setAiLoading(true);
    try {
      const mockTags = ["프리미엄간식", "강아지건강", "수제간식", "마젠타랩", "반려동물영양", "기호성최고", "안심먹거리", "댕댕이맛점", "건강한성분", "검증된품질"];
      setCurrentProduct(prev => ({
        ...prev,
        seo_title: `[공식인증] ${prev.brand || '마젠타랩'} ${prev.name} - 반려동물 건강 연구소`,
        seo_description: `${prev.name}은 데이터로 검증된 최상의 원료만을 사용합니다. 우리 아이의 건강을 위한 마젠타랩의 정밀한 선택.`,
        tags: mockTags
      }));
      alert("✨ 안심이 AI가 최적의 SEO 정보를 추천했습니다!");
    } finally { setAiLoading(false); }
  }

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
            <p style={{ color: '#667085', fontSize: '14px' }}>마젠타 펫 연구소 전문 관리</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {activeTab === 'products' ? (
              <>
                <button style={outlineBtnStyle}><Download size={16} /> 엑셀 다운로드</button>
                <button style={outlineBtnStyle}><Upload size={16} /> 엑셀 일괄등록</button>
                <button onClick={() => { setIsEditing(true); setCurrentProduct({ use_options: false, option_groups: [], additional_images: [], detail_images: [], tags: [], badge: "", details_link: "", description: "", tag: "" }); }} style={primaryBtnStyle}>+ 상품 등록</button>
              </>
            ) : activeTab === 'banners' ? (
              <button onClick={() => { setIsEditingBanner(true); setCurrentBanner({ image_url: "", link_url: "", order_index: 0, is_active: true }); }} style={primaryBtnStyle}>+ 배너 등록</button>
            ) : (
              <div style={{ color: '#98A2B3', fontSize: '13px' }}>AI 페르소나 댓글 생성기 가동 중... 🧪</div>
            )}
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #344054', paddingBottom: '10px' }}>
          <button onClick={() => setActiveTab('products')} style={{ ...tabBtnStyle, color: activeTab === 'products' ? '#00C73C' : '#98A2B3', borderBottom: activeTab === 'products' ? '2px solid #00C73C' : 'none' }}>상품 관리</button>
          <button onClick={() => setActiveTab('banners')} style={{ ...tabBtnStyle, color: activeTab === 'banners' ? '#00C73C' : '#98A2B3', borderBottom: activeTab === 'banners' ? '2px solid #00C73C' : 'none' }}>메인 배너 관리</button>
          <button onClick={() => setActiveTab('ai-factory')} style={{ ...tabBtnStyle, color: activeTab === 'ai-factory' ? '#E5007E' : '#98A2B3', borderBottom: activeTab === 'ai-factory' ? '2px solid #E5007E' : 'none' }}>AI 댓글 공장</button>
        </div>

        {activeTab === 'products' && (
          <>
        {isEditing && (
          <div style={naverEditorStyle}>
            {/* 기본 정보 (전수조사 기반 완벽 복구) */}
            <div style={formSectionStyle}>
              <SectionTitle icon={CheckCircle2} title="기본정보" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}><label>상품명 *</label><input style={naverInputStyle} value={currentProduct.name || ""} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} /></div>
                <div style={inputGroupStyle}><label>브랜드 *</label><input style={naverInputStyle} value={currentProduct.brand || ""} onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})} /></div>
                <div style={inputGroupStyle}><label>판매가 *</label><input type="number" style={naverInputStyle} value={currentProduct.price || ""} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} /></div>
                <div style={inputGroupStyle}><label>할인 전 가격 (정가)</label><input type="number" style={naverInputStyle} value={currentProduct.original_price || ""} onChange={e => setCurrentProduct({...currentProduct, original_price: Number(e.target.value)})} /></div>
                <div style={inputGroupStyle}><label>재고수량</label><input type="number" style={naverInputStyle} value={currentProduct.stock || 0} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} /></div>
                <div style={inputGroupStyle}><label>카테고리</label>
                  <select style={naverInputStyle} value={currentProduct.category || ""} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}>
                    <option value="">카테고리 선택</option>
                    <option value="food">사료·간식</option>
                    <option value="supplement">영양제</option>
                    <option value="hygiene">위생·목욕</option>
                    <option value="toy">장난감</option>
                    <option value="bedding">침구·하우스</option>
                    <option value="clothing">의류·악세</option>
                  </select>
                </div>
                {/* 뱃지 및 외부링크 복구 */}
                <div style={inputGroupStyle}><label>상품 뱃지</label>
                  <select style={naverInputStyle} value={currentProduct.badge || ""} onChange={e => setCurrentProduct({...currentProduct, badge: e.target.value})}>
                    <option value="">뱃지 없음</option>
                    <option value="BEST">BEST</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT</option>
                    <option value="추천">추천</option>
                  </select>
                </div>
                <div style={inputGroupStyle}><label>상세 외부링크 (필요 시)</label><input style={naverInputStyle} value={currentProduct.details_link || ""} onChange={e => setCurrentProduct({...currentProduct, details_link: e.target.value})} /></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop:'20px' }}>
                <div style={inputGroupStyle}><label>포인트 태그 (예: 연구소 추천)</label><input style={naverInputStyle} value={currentProduct.tag || ""} onChange={e => setCurrentProduct({...currentProduct, tag: e.target.value})} /></div>
                <div style={inputGroupStyle}><label>상품 요약 설명</label><input style={naverInputStyle} value={currentProduct.description || ""} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} /></div>
              </div>
            </div>

            {/* 상품이미지 */}
            <div style={formSectionStyle}>
              <SectionTitle icon={ImageIcon} title="상품이미지" />
              <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{ width: '200px' }}>
                  <label style={subLabelStyle}>대표이미지 *</label>
                  <div style={{ ...naverDropzoneStyle, cursor: 'pointer' }}>
                    {currentProduct.image_url ? (
                      <div style={{ position:'relative', width:'100%', height:'100%' }}>
                        <img src={currentProduct.image_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        {/* 이미지 변경 오버레이 */}
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s' }} className="image-overlay">
                           <span style={{ color:'#fff', fontSize:'12px', fontWeight:800 }}>이미지 변경</span>
                        </div>
                        <input type="file" style={fileHiddenStyle} onChange={async e => { if(e.target.files) { const url = await uploadMedia(e.target.files[0]); if(url) setCurrentProduct({...currentProduct, image_url: url}); } }} />
                        <button onClick={(e) => { e.stopPropagation(); setCurrentProduct({...currentProduct, image_url: ""}); }} style={{ ...deleteBtnStyle, position:'absolute', top:5, right:5, zIndex:10 }}><X size={12}/></button>
                      </div>
                    ) : (
                      <div style={{ textAlign:'center' }}>
                        <Plus size={24} color="#98A2B3" />
                        <p style={{ fontSize:'11px', color:'#98A2B3', marginTop:'8px' }}>이미지 등록</p>
                        <input type="file" style={fileHiddenStyle} onChange={async e => { if(e.target.files) { const url = await uploadMedia(e.target.files[0]); if(url) setCurrentProduct({...currentProduct, image_url: url}); } }} />
                      </div>
                    )}
                  </div>
                  {/* CSS 호버 효과 주입을 위해 스타일 추가 */}
                  <style>{`
                    div:hover > .image-overlay { opacity: 1 !important; }
                  `}</style>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={subLabelStyle}>추가이미지 ({currentProduct.additional_images?.length || 0}/9)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {(currentProduct.additional_images || []).map((img, idx) => (
                      <div key={idx} style={{ ...naverDropzoneStyle, width:'100px', height:'100px' }}>
                         <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                         <button onClick={() => {
                           const newList = [...(currentProduct.additional_images || [])];
                           newList.splice(idx, 1);
                           setCurrentProduct({...currentProduct, additional_images: newList});
                         }} style={deleteBtnStyle}><X size={10}/></button>
                      </div>
                    ))}
                    {(!currentProduct.additional_images || currentProduct.additional_images.length < 9) && (
                      <div style={{ ...naverDropzoneStyle, width:'100px', height:'100px', borderStyle:'dashed' }}>
                         <Plus size={20} color="#98A2B3" />
                         <input type="file" multiple style={fileHiddenStyle} onChange={async e => {
                           if(e.target.files) {
                             const files = Array.from(e.target.files);
                             for(const f of files) {
                               const url = await uploadMedia(f);
                               if(url) setCurrentProduct(prev => ({ ...prev, additional_images: [...(prev.additional_images || []), url] }));
                             }
                           }
                         }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 상세설명 이미지 (detail_images로 통일) */}
            <div style={formSectionStyle}>
              <SectionTitle icon={FileText} title="상세설명 이미지" />
              <div style={{ background: '#1D2939', padding: '24px', borderRadius: '12px', border: '1px dashed #344054' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {(currentProduct.detail_images || []).map((img, idx) => (
                    <div key={idx} style={{ position:'relative', width:'100%', maxWidth:'400px', borderRadius:'8px', overflow:'hidden', background:'#101828', border:'1px solid #344054' }}>
                       <img src={img} style={{ width:'100%', height:'auto', display:'block' }} />
                       <button onClick={() => {
                         const newList = [...(currentProduct.detail_images || [])];
                         newList.splice(idx, 1);
                         setCurrentProduct({...currentProduct, detail_images: newList});
                       }} style={{ ...deleteBtnStyle, position:'absolute', top:10, right:10 }}><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <div style={{ ...naverDropzoneStyle, width:'100%', height:'100%', borderStyle:'dashed', padding:'40px' }}>
                    <div style={{ textAlign:'center' }}>
                      <Upload size={32} color="#98A2B3" style={{ marginBottom:'12px' }} />
                      <p style={{ fontSize:'14px', color:'#98A2B3', fontWeight:600 }}>상세 이미지 추가</p>
                      <p style={{ fontSize:'12px', color:'rgba(152,162,179,0.6)', marginTop:'4px' }}>클릭하거나 파일을 드래그하세요</p>
                    </div>
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

            <div style={formSectionStyle}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <SectionTitle icon={Search} title="검색설정" />
                <button onClick={getAIRecommendations} disabled={aiLoading} style={{ ...aiBtnStyle, opacity: aiLoading ? 0.5 : 1 }}>
                  <Sparkles size={16} /> {aiLoading ? "추천 분석 중..." : "안심이 AI SEO 추천"}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input style={naverInputStyle} placeholder="SEO 제목" value={currentProduct.seo_title || ""} onChange={e => setCurrentProduct({...currentProduct, seo_title: e.target.value})} />
                <textarea style={{ ...naverInputStyle, height:'80px' }} placeholder="SEO 설명" value={currentProduct.seo_description || ""} onChange={e => setCurrentProduct({...currentProduct, seo_description: e.target.value})} />
                <input style={naverInputStyle} placeholder="태그 (콤마 구분)" value={currentProduct.tags?.join(", ") || ""} onChange={e => setCurrentProduct({...currentProduct, tags: e.target.value.split(",").map(t => t.trim())})} />
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'15px', marginTop:'40px' }}>
              <button onClick={() => setIsEditing(false)} style={outlineBtnStyle}>취소</button>
              <button onClick={handleSaveProduct} style={saveBtnStyle}>상품 저장하기</button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div style={tableCardStyle}>
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ background:'#1D2939', borderBottom:'1px solid #344054' }}>
                   <th style={thStyle}>상품정보</th>
                   <th style={thStyle}>가격</th>
                   <th style={thStyle}>관리</th>
                 </tr>
               </thead>
               <tbody>
                 {products.map(p => (
                   <tr key={p.id} style={{ borderBottom:'1px solid #1D2939' }}>
                     <td style={tdStyle}>
                       <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                         <img src={p.image_url} style={{ width:'40px', height:'40px', borderRadius:'8px', objectFit:'cover' }} />
                         <div style={{ fontWeight:700 }}>{p.name}</div>
                       </div>
                     </td>
                     <td style={tdStyle}>{p.price.toLocaleString()}원</td>
                     <td style={tdStyle}>
                        <div style={{ display:'flex', gap:'15px' }}>
                          <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} style={actionBtnStyle} title="수정"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ ...actionBtnStyle, color: '#F04438' }} title="삭제"><Trash2 size={16} /></button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
        </>
        )}

        {activeTab === 'banners' && (
          <>
            {isEditingBanner ? (
              <div style={naverEditorStyle}>
                <SectionTitle icon={ImageIcon} title="배너 정보" />
                <div style={inputGroupStyle}><label>배너 이미지 (가로형 추천) *</label>
                  <div style={{...naverDropzoneStyle, height: '300px'}}>
                    {currentBanner.image_url ? (
                      <div style={{ position:'relative', width:'100%', height:'100%' }}>
                        <img src={currentBanner.image_url} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                        <button onClick={() => setCurrentBanner({...currentBanner, image_url: ""})} style={deleteBtnStyle}><X size={12}/></button>
                      </div>
                    ) : (
                      <div style={{ textAlign:'center' }}>
                        <Plus size={24} color="#98A2B3" />
                        <input type="file" style={fileHiddenStyle} onChange={async e => { if(e.target.files) { const url = await uploadMedia(e.target.files[0]); if(url) setCurrentBanner({...currentBanner, image_url: url}); } }} />
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div style={inputGroupStyle}><label>연결할 링크 URL (예: /shop/1)</label><input style={naverInputStyle} value={currentBanner.link_url || ""} onChange={e => setCurrentBanner({...currentBanner, link_url: e.target.value})} /></div>
                  <div style={inputGroupStyle}><label>정렬 순서 (숫자가 작을수록 먼저 노출)</label><input type="number" style={naverInputStyle} value={currentBanner.order_index || 0} onChange={e => setCurrentBanner({...currentBanner, order_index: Number(e.target.value)})} /></div>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:'15px', marginTop:'40px' }}>
                  <button onClick={() => setIsEditingBanner(false)} style={outlineBtnStyle}>취소</button>
                  <button onClick={handleSaveBanner} style={saveBtnStyle}>배너 저장하기</button>
                </div>
              </div>
            ) : (
              <div style={tableCardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background:'#1D2939', borderBottom:'1px solid #344054' }}>
                      <th style={thStyle}>배너 이미지</th>
                      <th style={thStyle}>링크 URL</th>
                      <th style={thStyle}>순서</th>
                      <th style={thStyle}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(b => (
                      <tr key={b.id} style={{ borderBottom:'1px solid #1D2939' }}>
                        <td style={tdStyle}><img src={b.image_url} style={{ height:'60px', borderRadius:'8px', objectFit:'cover' }} /></td>
                        <td style={tdStyle}>{b.link_url}</td>
                        <td style={tdStyle}>{b.order_index}</td>
                        <td style={tdStyle}>
                          <div style={{ display:'flex', gap:'15px' }}>
                            <button onClick={() => { setCurrentBanner(b); setIsEditingBanner(true); }} style={actionBtnStyle} title="수정"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteBanner(b.id)} style={{ ...actionBtnStyle, color: '#F04438' }} title="삭제"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'ai-factory' && (
          <div style={{ background: '#1D2939', borderRadius: '24px', padding: '40px', border: '1px solid #344054' }}>
            <SectionTitle icon={Factory} title="AI 댓글 공장" sub="안심이 AI가 5인 5색 페르소나 댓글을 찍어냅니다." />
            <AICommentAssistant variant="admin" />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const naverEditorStyle: React.CSSProperties = { background: '#101828', borderRadius: '16px', border: '1px solid #344054', padding: '40px' };
const formSectionStyle: React.CSSProperties = { marginBottom: '48px' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const naverInputStyle: React.CSSProperties = { background: '#1D2939', border: '1px solid #344054', borderRadius: '8px', padding: '12px 16px', color: '#fff', outline: 'none', fontSize: '14px' };
const primaryBtnStyle: React.CSSProperties = { background: '#00C73C', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const outlineBtnStyle: React.CSSProperties = { background: 'none', color: '#F2F4F7', border: '1px solid #344054', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const saveBtnStyle: React.CSSProperties = { background: '#00C73C', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px 40px', fontWeight: 900, cursor: 'pointer', fontSize: '16px' };
const aiBtnStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #E5007E, #7C3AED)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const actionBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#98A2B3', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' };
const naverDropzoneStyle: React.CSSProperties = { width: '100%', height: '200px', border: '1px solid #344054', borderRadius: '8px', background: '#1D2939', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow:'hidden' };
const fileHiddenStyle: React.CSSProperties = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };
const deleteBtnStyle: React.CSSProperties = { background: 'rgba(240, 68, 56, 0.8)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' };
const tableCardStyle: React.CSSProperties = { background: '#101828', border: '1px solid #344054', borderRadius: '16px', overflow: 'hidden' };
const thStyle: React.CSSProperties = { padding: '15px 20px', textAlign: 'left', fontSize: '12px', color: '#98A2B3', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '20px', fontSize: '14px' };
const subLabelStyle: React.CSSProperties = { fontSize:'13px', marginBottom:'10px', display:'block', fontWeight:700 };
const authCardStyle: React.CSSProperties = { background: '#1D2939', padding: '48px', borderRadius: '24px', textAlign: 'center', border: '1px solid #344054', width: '400px' };
const authInputStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', background: '#101828', border: '1px solid #344054', color: '#fff', marginBottom: '15px', textAlign: 'center', fontSize: '18px' };
const authBtnStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', background: '#00C73C', border: 'none', color: '#fff', fontWeight: 800, fontSize: '16px', cursor: 'pointer' };
const tabBtnStyle: React.CSSProperties = { background: 'none', padding: '10px 5px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none' };
