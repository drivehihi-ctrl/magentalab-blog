export const ko = {
  // Risk Assessments
  LOW_ESTIMATED_RISK: "낮은 추정 위험",
  CLINICAL_SIGNS_POSSIBLE: "임상증상 가능",
  HIGH_RISK: "고위험",
  NON_QUANTIFIABLE: "정량 판정 불가",
  LIMITED_EVIDENCE: "근거 제한",

  // Action Levels
  OBSERVE_AND_VERIFY: "추가 정보 확인",
  CONTACT_VET: "동물병원 상담",
  PROMPT_VET_CONTACT: "빠른 수의학적 상담",
  EMERGENCY_VET_CONTACT: "즉시 응급 상담",

  // Chocolate
  CHOCOLATE_UNKNOWN: "제품 종류와 코코아 함량을 알 수 없어 정확한 계산이 어렵습니다.",
  CHOCOLATE_LOW: "현재 예상 섭취량으로는 심각한 중독 증상이 발생할 가능성이 낮습니다. 다만 개체에 따라 구토나 설사가 있을 수 있으니 지켜봐 주세요.",
  CHOCOLATE_CLINICAL: "가벼운 위장관 증상이나 흥분 상태가 나타날 수 있는 용량입니다. 증상이 발생하면 수의사와 상담하세요.",
  CHOCOLATE_HIGH_CARDIO: "심혈관계 증상(빈맥, 부정맥 등)이 발생할 수 있는 고위험 용량입니다.",
  CHOCOLATE_HIGH_NEURO: "중증 신경계 증상 및 경련이 발생할 수 있는 매우 위험한 용량입니다.",
  CHOCOLATE_CAT_LIMITED: "개의 임상 독성 자료를 참고한 추정치이며, 고양이의 확정 컷오프가 아닙니다. 섭취 시 동물병원과 상담하세요.",
  
  // Grapes
  GRAPE_DOG_PROMPT: "포도·건포도는 체중과 섭취량만으로 안전 여부를 정확히 계산할 수 없는 물질입니다. 일부 강아지에서 급성 신장손상이 발생할 수 있으며, 개체 차이와 과일 성분 차이가 큽니다. 현재 증상이 없어도 실제 섭취가 확인되거나 강하게 의심된다면 동물병원에 연락해 노출 상황을 상담하세요.",
  GRAPE_CAT_LIMITED: "개에서는 포도·건포도와 급성 신장손상의 연관성이 확립되어 있지만, 고양이에서는 근거가 제한적입니다. 근거가 적다는 것이 안전하다는 뜻은 아니므로, 실제 섭취가 있었다면 동물병원에 상담하세요.",

  // Xylitol
  XYLITOL_UNKNOWN: "제품 내 실제 자일리톨 함량을 알 수 없어 정확한 용량 계산이 어렵습니다. 제품 포장지 또는 성분표를 준비해 동물병원에 연락하세요.",
  XYLITOL_LOW: "현재 계산된 용량으로는 위험도가 명확하지 않으나, 불확실성이 있으므로 이상 증상 발생 시 즉시 병원에 연락하세요.",
  XYLITOL_HYPOGLYCEMIA: "자일리톨에 의한 저혈당(hypoglycemia) 발생 위험이 높은 용량입니다.",
  XYLITOL_HEPATIC: "간 손상(hepatic injury) 위험이 매우 높은 중증 용량입니다.",

  // Allium (Onion/Garlic)
  ALLIUM_LIMITED: "실제 원재료 종류와 형태에 따라 독성 노출량이 달라 단순 g/kg 기준만으로 안전성을 판단하기 어렵습니다. 섭취 후 동물병원에 상담하세요.",
  ALLIUM_GARLIC_WARNING: "마늘은 양파보다 더 강한 독성이 보고되어 있으므로 더욱 주의가 필요합니다.",
  ALLIUM_POWDER_WARNING: "분말/건조 형태는 독성이 농축되어 있어 소량으로도 위험할 수 있습니다.",

  // Lilies (Cats)
  LILY_TRUE_DAYLILY: "진짜 백합(Lilium)과 원추리(Hemerocallis)는 고양이에서 심각한 신장손상을 일으킬 수 있습니다. 잎, 꽃, 줄기뿐 아니라 꽃가루를 핥거나 화병 물을 마신 노출도 문제가 될 수 있으므로, 양을 계산하지 말고 즉시 동물병원에 연락하세요.",
  LILY_PEACE_CALLA: "스파티필름(Peace lily)이나 카라(Calla lily)는 진짜 백합과 달리 구강 자극을 주로 일으키지만, 다량 섭취 시 다른 문제가 생길 수 있으므로 상담을 권장합니다.",
  LILY_UNKNOWN: "정확한 식물 종 확인이 어려우므로 우선 동물병원에 섭취(또는 노출) 사실을 알리고 상담하세요.",

  // General Warnings
  GENERAL_VOMIT_WARNING: "집에서 임의로 구토를 유도하지 마세요. 섭취한 물질, 섭취 시점, 의식 상태, 흡인 위험 등에 따라 구토 유도가 적절하지 않을 수 있습니다. 과산화수소, 소금 등 가정용 방법을 임의로 사용하지 말고 먼저 동물병원에 연락하세요.",
  
  // UI Labels
  AMOUNT_UNKNOWN_CHECKBOX: "섭취량을 모름",
  INGREDIENT_PERCENT: "함유량 (%)",
  PRODUCT_TOTAL_GRAM: "제품 전체 무게 (g)",
  ACTUAL_INGREDIENT_GRAM: "성분 함량 (g)",
};
