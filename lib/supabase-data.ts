import { getSupabaseBrowserClient } from "@/lib/supabase";

export type CurrencyCode = "GHS" | "USD" | "EUR" | "GBP";
export type TransactionKind = "income" | "expense";

export type Profile = {
  id: string;
  display_name: string;
  currency: CurrencyCode;
  created_at: string;
  updated_at: string;
};

export type TransactionRecord = {
  id: string;
  user_id: string;
  kind: TransactionKind;
  category: string;
  description: string;
  amount: number;
  transaction_date: string;
  source: string;
  created_at: string;
};

export type BudgetRecord = {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  month_start: string;
  created_at: string;
  updated_at: string;
};

export type SavingsGoalRecord = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  target_date: string;
  created_at: string;
  updated_at: string;
};

export type SavingsMovementRecord = {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  movement_date: string;
  note: string;
  created_at: string;
};

const client = () => getSupabaseBrowserClient();

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const { data, error } = await client().auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { display_name: displayName.trim() } },
  });
  if (error) throw error;
  return data;
}

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await client().auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutFromSupabase() {
  const { error } = await client().auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile() {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) return null;
  const { data, error } = await client().from("profiles").select("*").eq("id", authData.user.id).single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(patch: Pick<Profile, "display_name" | "currency">) {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Sign in before updating your profile.");
  const { data, error } = await client().from("profiles").update(patch).eq("id", authData.user.id).select().single();
  if (error) throw error;
  return data as Profile;
}

export async function listTransactions(startDate?: string, endDate?: string) {
  let query = client().from("transactions").select("*").order("transaction_date", { ascending: false });
  if (startDate) query = query.gte("transaction_date", startDate);
  if (endDate) query = query.lte("transaction_date", endDate);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TransactionRecord[];
}

export async function saveTransaction(input: Pick<TransactionRecord, "kind" | "category" | "description" | "amount" | "transaction_date" | "source">, id?: string) {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Sign in before saving transactions.");
  const payload = { ...input, user_id: authData.user.id };
  const query = id
    ? client().from("transactions").update(payload).eq("id", id)
    : client().from("transactions").insert(payload);
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data as TransactionRecord;
}

export async function deleteTransaction(id: string) {
  const { error } = await client().from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export async function listBudgets(monthStart: string) {
  const { data, error } = await client().from("budgets").select("*").eq("month_start", monthStart).order("category");
  if (error) throw error;
  return (data ?? []) as BudgetRecord[];
}

export async function saveBudget(input: Pick<BudgetRecord, "category" | "monthly_limit" | "month_start">) {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Sign in before saving budgets.");
  const { data, error } = await client().from("budgets").upsert(
    { ...input, user_id: authData.user.id },
    { onConflict: "user_id,category,month_start" }
  ).select().single();
  if (error) throw error;
  return data as BudgetRecord;
}

export async function listSavingsGoals() {
  const { data, error } = await client().from("savings_goals").select("*, savings_movements(*)").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSavingsGoal(input: Pick<SavingsGoalRecord, "title" | "description" | "target_amount" | "target_date">) {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Sign in before creating savings goals.");
  const { data, error } = await client().from("savings_goals").insert({ ...input, user_id: authData.user.id }).select().single();
  if (error) throw error;
  return data as SavingsGoalRecord;
}

export async function recordSavingsMovement(input: Pick<SavingsMovementRecord, "goal_id" | "amount" | "movement_date" | "note">) {
  const { data: authData, error: authError } = await client().auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Sign in before recording savings movements.");
  const { data, error } = await client().from("savings_movements").insert({ ...input, user_id: authData.user.id }).select().single();
  if (error) throw error;
  return data as SavingsMovementRecord;
}
