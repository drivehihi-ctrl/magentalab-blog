import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { EvidenceData, AIRevision, AIBackup, AILog } from '../lib/ai-revisions';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DATA_DIR = path.join(process.cwd(), 'data');

async function migrateRevisions(dryRun: boolean) {
  const filePath = path.join(DATA_DIR, 'revisions.json');
  if (!existsSync(filePath)) return;
  const revisions: AIRevision[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`Found ${revisions.length} revisions to migrate.`);
  
  if (!dryRun) {
    for (const rev of revisions) {
      const { error } = await supabaseAdmin.from('ai_revisions').upsert({
        revision_id: rev.revision_id,
        wordpress_id: rev.wordpress_id,
        content_id: rev.content_id,
        language: rev.language,
        slug: rev.slug,
        source_modified_at: rev.source_modified_at,
        previous_title: rev.previous_title,
        new_title: rev.new_title,
        previous_content: rev.previous_content,
        new_content: rev.new_content,
        previous_excerpt: rev.previous_excerpt,
        new_excerpt: rev.new_excerpt,
        previous_meta_description: rev.previous_meta_description,
        new_meta_description: rev.new_meta_description,
        media_changes: rev.media_changes,
        evidence: rev.evidence,
        reason: rev.reason,
        source: rev.source,
        status: rev.status,
        created_at: rev.created_at,
        updated_at: new Date().toISOString()
      }, { onConflict: 'revision_id' });
      if (error) console.error(`Error upserting revision ${rev.revision_id}:`, error);
    }
    console.log(`Migrated ${revisions.length} revisions.`);
  }
}

async function migrateBackups(dryRun: boolean) {
  const filePath = path.join(DATA_DIR, 'backups.json');
  if (!existsSync(filePath)) return;
  const backups: AIBackup[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`Found ${backups.length} backups to migrate.`);
  
  if (!dryRun) {
    for (const bk of backups) {
      const { error } = await supabaseAdmin.from('ai_backups').upsert({
        backup_id: bk.backup_id,
        revision_id: bk.revision_id,
        wordpress_id: bk.wordpress_id,
        title: bk.title,
        content: bk.content,
        excerpt: bk.excerpt,
        meta_description: bk.meta_description,
        slug: bk.slug,
        featured_media_id: bk.featured_media,
        evidence: bk.evidence,
        source_modified_at: bk.modified_at,
        created_at: bk.created_at
      }, { onConflict: 'backup_id' });
      if (error) console.error(`Error upserting backup ${bk.backup_id}:`, error);
    }
    console.log(`Migrated ${backups.length} backups.`);
  }
}

async function migrateEvidence(dryRun: boolean) {
  const filePath = path.join(DATA_DIR, 'evidence.json');
  if (!existsSync(filePath)) return;
  const data: Record<string, EvidenceData> = JSON.parse(readFileSync(filePath, 'utf-8'));
  const entries = Object.entries(data);
  console.log(`Found ${entries.length} evidence entries to migrate.`);
  
  if (!dryRun) {
    for (const [postId, ev] of entries) {
      const { error } = await supabaseAdmin.from('ai_evidence').upsert({
        wordpress_id: parseInt(postId, 10),
        key_insight: ev.keyInsight,
        caution_note: ev.cautionNote,
        references: ev.references,
        updated_at: new Date().toISOString()
      }, { onConflict: 'wordpress_id' });
      if (error) console.error(`Error upserting evidence for post ${postId}:`, error);
    }
    console.log(`Migrated ${entries.length} evidence entries.`);
  }
}

async function migrateAuditLogs(dryRun: boolean) {
  const filePath = path.join(DATA_DIR, 'audit_log.json');
  if (!existsSync(filePath)) return;
  const logs: AILog[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`Found ${logs.length} audit logs to migrate.`);
  
  if (!dryRun) {
    // Audit logs are append-only. To avoid duplicates if run multiple times, 
    // it's tricky without a unique ID in the original JSON.
    // For this one-time migration, we'll just insert them.
    // If we want idempotency we might need to wipe them or ignore.
    // We'll just insert all.
    for (const log of logs) {
      const { error } = await supabaseAdmin.from('ai_audit_logs').insert({
        timestamp: log.timestamp,
        action: log.action,
        wordpress_id: log.wordpress_id,
        content_id: log.content_id,
        revision_id: log.revision_id,
        source: log.source,
        status: log.status,
        message: log.message
      });
      if (error) console.error(`Error inserting audit log:`, error);
    }
    console.log(`Migrated ${logs.length} audit logs.`);
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(isDryRun ? "=== DRY RUN MODE ===" : "=== MIGRATION MODE ===");
  
  await migrateRevisions(isDryRun);
  await migrateBackups(isDryRun);
  await migrateEvidence(isDryRun);
  await migrateAuditLogs(isDryRun);
  
  console.log("Migration script finished.");
}

main().catch(console.error);
