import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signUp(email: string, password: string, fullName: string, companyName: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) return { data: null, error: authError };
  
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        company_name: companyName,
      })
      .eq('id', authData.user.id);
    
    if (profileError) return { data: null, error: profileError };
  }
  
  return { data: authData, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

export async function saveOzonCredentials(userId: string, clientId: string, apiKey: string) {
  const { data, error } = await supabase
    .from('ozon_credentials')
    .insert({
      user_id: userId,
      client_id: clientId,
      api_key: apiKey,
      is_active: true
    });
  
  return { data, error };
}

export async function getBudgetSettings(userId: string) {
  const { data, error } = await supabase
    .from('budget_settings')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}

export async function updateBudgetSettings(userId: string, dailyLimit: number, notificationThreshold: number) {
  const { data, error } = await supabase
    .from('budget_settings')
    .upsert({
      user_id: userId,
      daily_limit: dailyLimit,
      notification_threshold: notificationThreshold,
      is_active: true
    });
  
  return { data, error };
}

export async function getCampaigns(userId: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}

export async function updateCampaign(campaignId: string, updates: any) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId);
  
  return { data, error };
}
