import { createClient } from '@supabase/supabase-js';

// bang-guseog.com과 동일한 Supabase 프로젝트. anon 키는 공개되어도 안전(RLS/RPC로 보호됨).
export const supabase = createClient(
  'https://ajfdzrmowezuypjgghxo.supabase.co',
  'sb_publishable_6TmaVMfcA2juya3uoRXZgg_WFyDkIH-'
);
