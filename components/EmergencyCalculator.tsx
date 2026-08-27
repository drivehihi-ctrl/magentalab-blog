"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  RotateCcw, 
  Weight, 
  Activity,
  Skull,
  ShieldAlert
} from "lucide-react";
import { evaluateToxicity } from "@/lib/toxicity";
import { ToxicityInput, ToxicityResult } from "@/lib/toxicity/types";
import { getToxicityDict } from "@/lib/toxicity/i18n";

interface EmergencyCalculatorProps {
  lang?: "ko" | "en" | "ja";
}

type SubstanceId = "chocolate" | "grapes" | "xylitol" | "allium" | "lilies";

export default function EmergencyCalculator({ lang = "ko" }: EmergencyCalculatorProps) {
  const t = getToxicityDict(lang);

  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [weight, setWeight] = useState<string>("5.0");
  const [substanceId, setSubstanceId] = useState<SubstanceId>("chocolate");
  const [substanceSubtype, setSubstanceSubtype] = useState<string>("MILK_CHOCOLATE");
  
  const [ingestionAmount, setIngestionAmount] = useState<string>("10");
  const [isAmountUnknown, setIsAmountUnknown] = useState<boolean>(false);

  // Xylitol specific
  const [xylitolMode, setXylitolMode] = useState<"percent" | "actual" | "unknown">("percent");
  const [productTotalGram, setProductTotalGram] = useState<string>("");
  const [xylitolPercent, setXylitolPercent] = useState<string>("");
  const [xylitolContentGram, setXylitolContentGram] = useState<string>("");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ToxicityResult | null>(null);

  // Change default substance when pet type changes
  useEffect(() => {
    if (petType === "dog") {
      setSubstanceId("chocolate");
      setSubstanceSubtype("MILK_CHOCOLATE");
    } else {
      setSubstanceId("lilies");
      setSubstanceSubtype("TRUE_LILY_LILIUM");
    }
    setResult(null);
  }, [petType]);

  // Reset subtype when substance changes
  useEffect(() => {
    if (substanceId === "chocolate") setSubstanceSubtype("MILK_CHOCOLATE");
    else if (substanceId === "allium") setSubstanceSubtype("ONION_FRESH");
    else if (substanceId === "lilies") setSubstanceSubtype("TRUE_LILY_LILIUM");
    else setSubstanceSubtype("");
    setResult(null);
  }, [substanceId]);

  const triggerCalculation = async () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(async () => {
      const input: ToxicityInput = {
        species: petType,
        weightKg: parseFloat(weight) || 0,
        substanceId: substanceId,
        substanceSubtype: substanceSubtype || undefined,
        ingestionAmountGram: parseFloat(ingestionAmount) || 0,
        isAmountUnknown: isAmountUnknown,
      };

      if (substanceId === "xylitol") {
        if (xylitolMode === "percent") {
          input.productTotalGram = parseFloat(productTotalGram) || 0;
          input.xylitolPercent = parseFloat(xylitolPercent) || 0;
          input.ingredientKnown = true;
        } else if (xylitolMode === "actual") {
          input.xylitolContentGram = parseFloat(xylitolContentGram) || 0;
          input.ingredientKnown = true;
        } else {
          input.ingredientKnown = false;
        }
      }

      try {
        const res = evaluateToxicity(input);
        setResult(res);

        // API Log (fire and forget)
        fetch("/api/emergency-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            species: input.species,
            weightKg: input.weightKg,
            substance: input.substanceId,
            substanceSubtype: input.substanceSubtype,
            ingestionAmount: input.ingestionAmountGram,
            decisionMode: res.decisionMode,
            riskAssessment: res.riskAssessment,
            actionLevel: res.actionLevel,
            calculatedDose: res.calculatedDose,
            doseUnit: res.doseUnit,
            ingredientKnown: res.ingredientKnown,
            timestamp: new Date().toISOString(),
          })
        }).catch(err => console.error(err));

      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setWeight("5.0");
    setIngestionAmount("10");
    setIsAmountUnknown(false);
    setXylitolMode("percent");
    setProductTotalGram("");
    setXylitolPercent("");
    setXylitolContentGram("");
    setResult(null);
  };


  const tUI = {
    ko: {
      title: "반려동물 중독 응급 계산기 V2",
      desc: "의학적 근거에 기반한 다단계 독성 판정 시스템",
      dog: "강아지",
      cat: "고양이",
      weight: "현재 몸무게 (kg)",
      substance: "섭취 물질",
      subtype: "상세 종류",
      amount: "섭취량 (g)",
      calculate: "응급 진단하기",
      reset: "초기화",
      analyzing: "분석 중...",
      resultTitle: "의학적 위험 평가",
      actionTitle: "권장 행동",
    },
    en: {
      title: "Pet Toxicity Emergency Calculator V2",
      desc: "Evidence-based multi-tier toxicity assessment system",
      dog: "Dog",
      cat: "Cat",
      weight: "Weight (kg)",
      substance: "Substance",
      subtype: "Subtype",
      amount: "Amount (g)",
      calculate: "Run Diagnosis",
      reset: "Reset",
      analyzing: "Analyzing...",
      resultTitle: "Medical Risk Assessment",
      actionTitle: "Recommended Action",
    },
    ja: {
      title: "ペット中毒応急計算機 V2",
      desc: "医学的根拠に基づく多段階毒性判定システム",
      dog: "犬",
      cat: "猫",
      weight: "体重 (kg)",
      substance: "摂取物質",
      subtype: "詳細種類",
      amount: "摂取量 (g)",
      calculate: "緊急診断を実行",
      reset: "リセット",
      analyzing: "分析中...",
      resultTitle: "医学的リスク評価",
      actionTitle: "推奨行動",
    }
  }[lang] || { title: "Emergency Calculator", desc: "", dog: "Dog", cat: "Cat", weight: "Weight (kg)", substance: "Substance", subtype: "Subtype", amount: "Amount (g)", calculate: "Calculate", reset: "Reset", analyzing: "Analyzing...", resultTitle: "Risk Assessment", actionTitle: "Recommended Action" };

  const getBadgeColors = (action: string) => {
    switch (action) {
      case "EMERGENCY_VET_CONTACT": return "bg-rose-600 text-white shadow-rose-600/30 animate-pulse";
      case "PROMPT_VET_CONTACT": return "bg-orange-500 text-white shadow-orange-500/30";
      case "CONTACT_VET": return "bg-amber-500 text-white shadow-amber-500/30";
      default: return "bg-emerald-500 text-white shadow-emerald-500/30";
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono tracking-widest uppercase animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Pet Tool V2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{tUI.title}</h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{tUI.desc}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
          
          <div className="flex p-1.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 w-full">
            <button
              onClick={() => setPetType("dog")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${petType === "dog" ? "bg-white/15 text-white" : "text-slate-400"}`}
            >
              <span>🐶</span> {tUI.dog}
            </button>
            <button
              onClick={() => setPetType("cat")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${petType === "cat" ? "bg-white/15 text-white" : "text-slate-400"}`}
            >
              <span>🐱</span> {tUI.cat}
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300">{tUI.substance}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "chocolate", icon: "🍫", name: "초콜릿/Chocolate" },
                { id: "grapes", icon: "🍇", name: "포도/Grapes" },
                { id: "xylitol", icon: "🍬", name: "자일리톨/Xylitol" },
                { id: "allium", icon: "🧅", name: "양파·파/Allium" },
                { id: "lilies", icon: "🪻", name: "백합/Lilies" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSubstanceId(item.id as SubstanceId)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-24 ${substanceId === item.id ? "border-rose-600 bg-rose-950/20 text-rose-400" : "border-white/5 bg-white/5 text-slate-400"}`}
                >
                  <span className="text-2xl mb-1.5">{item.icon}</span>
                  <span className="text-xs font-black">{item.name.split('/')[lang === 'ko' ? 0 : 1] || item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {substanceId === "chocolate" && petType === "dog" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">{tUI.subtype}</label>
              <select value={substanceSubtype} onChange={e => setSubstanceSubtype(e.target.value)} className="w-full h-14 px-4 bg-slate-900/60 border border-white/10 rounded-2xl text-slate-200">
                <option value="MILK_CHOCOLATE">Milk Chocolate</option>
                <option value="DARK_SEMISWEET_CHOCOLATE">Dark / Semi-sweet Chocolate</option>
                <option value="BAKERS_UNSWEETENED_CHOCOLATE">Baker's / Unsweetened Chocolate</option>
                <option value="COCOA_POWDER">Cocoa Powder</option>
                <option value="UNKNOWN_CHOCOLATE">Unknown Chocolate</option>
              </select>
            </div>
          )}

          {substanceId === "allium" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">{tUI.subtype}</label>
              <select value={substanceSubtype} onChange={e => setSubstanceSubtype(e.target.value)} className="w-full h-14 px-4 bg-slate-900/60 border border-white/10 rounded-2xl text-slate-200">
                <option value="ONION_FRESH">Fresh Onion</option>
                <option value="GARLIC_FRESH">Fresh Garlic</option>
                <option value="GREEN_ONION_LEEK_CHIVE">Green Onion / Leek / Chive</option>
                <option value="ALLIUM_POWDER">Powder (Onion/Garlic)</option>
                <option value="ALLIUM_DRY">Dried (Onion/Garlic)</option>
                <option value="MIXED_FOOD_UNKNOWN_ALLIUM">Mixed Food / Unknown Form</option>
              </select>
            </div>
          )}

          {substanceId === "lilies" && petType === "cat" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">{tUI.subtype}</label>
              <select value={substanceSubtype} onChange={e => setSubstanceSubtype(e.target.value)} className="w-full h-14 px-4 bg-slate-900/60 border border-white/10 rounded-2xl text-slate-200">
                <option value="TRUE_LILY_LILIUM">True Lily (Lilium)</option>
                <option value="DAYLILY_HEMEROCALLIS">Daylily (Hemerocallis)</option>
                <option value="PEACE_LILY">Peace Lily (Spathiphyllum)</option>
                <option value="CALLA_LILY">Calla Lily (Zantedeschia)</option>
                <option value="UNKNOWN_LILY">Unknown Lily</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5"><Weight className="w-4 h-4 text-rose-500" />{tUI.weight}</label>
              <input type="text" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} className="w-full h-16 px-5 bg-white/5 border border-white/10 rounded-2xl text-slate-200 font-black text-lg" />
            </div>

            {substanceId !== "xylitol" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex justify-between">
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-rose-500" />{tUI.amount}</span>
                  <label className="flex items-center gap-1 text-xs cursor-pointer text-slate-400">
                    <input type="checkbox" checked={isAmountUnknown} onChange={e => setIsAmountUnknown(e.target.checked)} className="rounded bg-slate-900 border-white/10" />
                    {(t as any).AMOUNT_UNKNOWN_CHECKBOX}
                  </label>
                </label>
                <input type="text" inputMode="decimal" value={ingestionAmount} disabled={isAmountUnknown} onChange={e => setIngestionAmount(e.target.value)} className="w-full h-16 px-5 bg-white/5 border border-white/10 rounded-2xl text-slate-200 font-black text-lg disabled:opacity-50" />
              </div>
            )}
          </div>

          {substanceId === "xylitol" && (
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setXylitolMode("percent")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${xylitolMode === "percent" ? "bg-white/20 text-white" : "text-slate-400"}`}>% 입력</button>
                <button onClick={() => setXylitolMode("actual")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${xylitolMode === "actual" ? "bg-white/20 text-white" : "text-slate-400"}`}>실제 함량 입력</button>
                <button onClick={() => setXylitolMode("unknown")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${xylitolMode === "unknown" ? "bg-white/20 text-white" : "text-slate-400"}`}>모름</button>
              </div>

              {xylitolMode === "percent" && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 block mb-1">{(t as any).PRODUCT_TOTAL_GRAM}</label>
                    <input type="text" value={productTotalGram} onChange={e => setProductTotalGram(e.target.value)} className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-xl text-slate-200" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 block mb-1">{(t as any).INGREDIENT_PERCENT}</label>
                    <input type="text" value={xylitolPercent} onChange={e => setXylitolPercent(e.target.value)} className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-xl text-slate-200" />
                  </div>
                </div>
              )}

              {xylitolMode === "actual" && (
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">{(t as any).ACTUAL_INGREDIENT_GRAM}</label>
                  <input type="text" value={xylitolContentGram} onChange={e => setXylitolContentGram(e.target.value)} className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-xl text-slate-200" />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={triggerCalculation} disabled={isAnalyzing} className="flex-grow h-16 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2.5">
              {isAnalyzing ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><Skull className="w-5 h-5 animate-pulse" /> {tUI.calculate}</>}
            </button>
            <button onClick={handleReset} className="px-6 h-16 bg-white/5 text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 border border-white/10">
              <RotateCcw className="w-4 h-4" /> {tUI.reset}
            </button>
          </div>

          {result && (
            <div className="border-t border-white/10 pt-6 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase">{tUI.resultTitle}</h3>
                  <div className="text-xl font-black text-white">
                    {(t as any)[result.riskAssessment] || result.riskAssessment}
                  </div>
                  {result.calculatedDose !== undefined && (
                    <div className="text-sm font-medium text-rose-400">
                      추정 노출량: {result.calculatedDose} {result.doseUnit}
                    </div>
                  )}
                </div>

                <div className={`border rounded-2xl p-5 space-y-3 ${getBadgeColors(result.actionLevel)}`}>
                  <h3 className="text-xs font-bold opacity-80 uppercase">{tUI.actionTitle}</h3>
                  <div className="text-xl font-black">
                    {(t as any)[result.actionLevel] || result.actionLevel}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 text-sm text-slate-300 leading-relaxed font-medium">
                {(t as any)[result.messageKey]}
              </div>

              {result.detailsKey && (
                <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-4 text-sm text-rose-300">
                  ⚠️ {(t as any)[result.detailsKey]}
                </div>
              )}

              <div className="p-4 border-l-4 border-amber-500 bg-amber-950/20 text-amber-200 text-xs leading-relaxed">
                {(t as any).GENERAL_VOMIT_WARNING}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
