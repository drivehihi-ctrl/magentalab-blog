import { EvidenceData, EvidenceReference } from './ai-revisions';

export interface ParseResult {
  content: string;
  evidence: EvidenceData | undefined;
}

export function parseEvidence(rawContent: string): ParseResult {
  const marker = '[근거]';
  const markerIndex = rawContent.indexOf(marker);
  
  if (markerIndex === -1) {
    return { content: rawContent, evidence: undefined };
  }

  const content = rawContent.substring(0, markerIndex).trim();
  const evidenceText = rawContent.substring(markerIndex + marker.length).trim();

  // Extract keyInsight and cautionNote
  const keyInsightMatch = evidenceText.match(/^(?:Evidence note|根拠の解説|근거 해설|Evidence interpretation|Evidence summary|根拠解説|エビデンス解説):\s*(.*)$/im);
  const keyInsight = keyInsightMatch ? keyInsightMatch[1].trim() : '';

  const cautionMatch = evidenceText.match(/^(?:Safety note|安全上の注意|안전 주의사항|주의사항):\s*(.*)$/im);
  const cautionNote = cautionMatch ? cautionMatch[1].trim() : '';

  // Extract references
  const references: EvidenceReference[] = [];
  const lines = evidenceText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('-')) {
      const parts = line.substring(1).trim().split(/(https?:\/\/[^\s]+)/);
      let titleOrg = parts[0];
      const url = parts.length > 1 ? parts[1].trim() : '';
      
      if (titleOrg.endsWith(':')) titleOrg = titleOrg.slice(0, -1).trim();
      
      let title = titleOrg;
      let org = 'Veterinary Reference';
      let type = 'Official Veterinary Reference';
      
      if (titleOrg.includes('—')) {
        const split = titleOrg.split('—');
        org = split[0].trim();
        title = split[1].trim();
      } else if (titleOrg.includes('-')) {
        const split = titleOrg.split('-');
        org = split[0].trim();
        title = split[1].trim();
      }

      if (org.match(/AAHA|WSAVA|ACVIM|ACVS|FDA|ICADA|ACVD|BSAVA|AVSAB/i)) {
        type = 'Clinical Practice Guideline';
      } else if (org.match(/Merck/i)) {
        type = 'Medical Reference Manual';
      }

      references.push({ title, org, type, url });
    }
  }

  // Determine if valid evidence block exists
  const hasValidData = references.length > 0 || keyInsight !== '' || cautionNote !== '';

  return {
    content,
    evidence: hasValidData ? { keyInsight, cautionNote, references } : undefined
  };
}
