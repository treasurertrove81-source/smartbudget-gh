"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlarmClockCheck,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  Building2,
  Car,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  CreditCard,
  Download,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  LogOut,
  Moon,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  ShieldCheck,
  SunMedium,
  Target,
  Trash2,
  TrendingUp,
  Utensils,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TransactionType = "income" | "expense";
type ThemeMode = "light" | "dark";
type CurrencyCode = "GHS" | "USD" | "EUR" | "GBP";

type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Rent"
  | "Electricity & Water"
  | "Healthcare"
  | "Education"
  | "Family"
  | "Business"
  | "Entertainment"
  | "Investments"
  | "Other expenses";

type IncomeCategory = "Salary" | "Business income" | "Freelance income" | "Other income";

type Transaction = {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  source: string;
};

type BudgetItem = {
  category: string;
  limit: number;
};

type SavingsGoal = {
  id: string;
  title: string;
  target: number;
  current: number;
  targetDate: string;
  description: string;
};

type AppData = {
  transactions: Transaction[];
  budgets: BudgetItem[];
  savingsGoals: SavingsGoal[];
};

type AppUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  currency: CurrencyCode;
  theme: ThemeMode;
  data: AppData;
};

const STORAGE_KEYS = {
  users: "smartbudget-gh-users",
  session: "smartbudget-gh-session",
};

const incomeCategories: IncomeCategory[] = ["Salary", "Business income", "Freelance income", "Other income"];
const expenseCategories: ExpenseCategory[] = [
  "Food",
  "Transportation",
  "Rent",
  "Electricity & Water",
  "Healthcare",
  "Education",
  "Family",
  "Business",
  "Entertainment",
  "Investments",
  "Other expenses",
];
const currencyOptions: CurrencyCode[] = ["GHS", "USD", "EUR", "GBP"];

const defaultBudgets: BudgetItem[] = [
  { category: "Food", limit: 1600 },
  { category: "Transportation", limit: 700 },
  { category: "Rent", limit: 2400 },
  { category: "Electricity & Water", limit: 500 },
  { category: "Healthcare", limit: 400 },
  { category: "Education", limit: 600 },
  { category: "Family", limit: 900 },
  { category: "Business", limit: 800 },
  { category: "Entertainment", limit: 500 },
  { category: "Investments", limit: 1200 },
  { category: "Other expenses", limit: 300 },
];

const sampleTransactions: Transaction[] = [
  { id: "t1", type: "income", category: "Salary", description: "Primary salary", amount: 6500, date: "2026-11-01", source: "Employer" },
  { id: "t2", type: "income", category: "Business income", description: "Consulting clients", amount: 1850, date: "2026-11-05", source: "Client work" },
  { id: "t3", type: "income", category: "Freelance income", description: "Design contract", amount: 1200, date: "2026-11-10", source: "Freelance" },
  { id: "t4", type: "expense", category: "Food", description: "Groceries and household supplies", amount: 1200, date: "2026-11-02", source: "Marketplace" },
  { id: "t5", type: "expense", category: "Transportation", description: "Fuel and ride fares", amount: 420, date: "2026-11-03", source: "Fuel station" },
  { id: "t6", type: "expense", category: "Rent", description: "Apartment rent", amount: 2400, date: "2026-11-04", source: "Landlord" },
  { id: "t7", type: "expense", category: "Electricity & Water", description: "Utilities", amount: 360, date: "2026-11-08", source: "Power company" },
  { id: "t8", type: "expense", category: "Healthcare", description: "Pharmacy and clinic", amount: 280, date: "2026-11-11", source: "Clinic" },
  { id: "t9", type: "expense", category: "Education", description: "School fees", amount: 540, date: "2026-11-14", source: "School" },
  { id: "t10", type: "expense", category: "Family", description: "Family support", amount: 700, date: "2026-11-16", source: "Family" },
  { id: "t11", type: "expense", category: "Business", description: "Website and office costs", amount: 550, date: "2026-11-21", source: "Business" },
  { id: "t12", type: "expense", category: "Entertainment", description: "Streaming and leisure", amount: 230, date: "2026-11-22", source: "Entertainment" },
  { id: "t13", type: "expense", category: "Investments", description: "Mutual fund contribution", amount: 900, date: "2026-11-27", source: "Investment account" },
  { id: "t14", type: "income", category: "Other income", description: "Dividend payment", amount: 450, date: "2026-11-25", source: "Investment return" },
];

const sampleSavingsGoals: SavingsGoal[] = [
  { id: "g1", title: "Emergency Fund", target: 5000, current: 3200, targetDate: "2027-03-01", description: "Safety net for unexpected expenses" },
  { id: "g2", title: "Vacation Savings", target: 3000, current: 1450, targetDate: "2027-01-15", description: "Save for a year-end trip" },
  { id: "g3", title: "Home Upgrade", target: 12000, current: 7800, targetDate: "2027-06-30", description: "Renovation and household improvements" },
];

const sampleAppData: AppData = {
  transactions: sampleTransactions,
  budgets: defaultBudgets,
  savingsGoals: sampleSavingsGoals,
};

const currencyMeta: Record<CurrencyCode, { symbol: string; locale: string }> = {
  GHS: { symbol: "GH₵", locale: "en-GH" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
};

const categoryIcons: Record<string, any> = {
  Food: Utensils,
  Transportation: Car,
  Rent: House,
  "Electricity & Water": Landmark,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Family: Users,
  Business: Briefcase,
  Entertainment: CircleDollarSign,
  Investments: Coins,
  "Other expenses": CreditCard,
  Salary: Wallet,
  "Business income": Building2,
  "Freelance income": Briefcase,
  "Other income": Coins,
};

const categoryColors: Record<string, string> = {
  Food: "#10b981",
  Transportation: "#3b82f6",
  Rent: "#8b5cf6",
  "Electricity & Water": "#f59e0b",
  Healthcare: "#ef4444",
  Education: "#06b6d4",
  Family: "#ec4899",
  Business: "#84cc16",
  Entertainment: "#f97316",
  Investments: "#14b8a6",
  "Other expenses": "#64748b",
  Salary: "#10b981",
  "Business income": "#22c55e",
  "Freelance income": "#3b82f6",
  "Other income": "#8b5cf6",
};

const formatMoney = (value: number, currency: CurrencyCode) => {
  const formatter = new Intl.NumberFormat(currencyMeta[currency].locale, {
    style: "currency",
    currency: currency === "GHS" ? "GHS" : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currency === "GHS") {
    return `GH₵ ${new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
  }

  return formatter.format(value);
};

const formatShortDate = (value: string, currency: CurrencyCode) => {
  return new Intl.DateTimeFormat(currencyMeta[currency].locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const matchMonth = (date: string, month: Date) => {
  const d = new Date(date);
  return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
};

const isCurrentMonth = (date: string) => matchMonth(date, new Date());

const getBudgetSummary = (transactions: Transaction[], budgets: BudgetItem[]) => {
  return budgets.map((budget) => {
    const spent = transactions
      .filter((item) => item.type === "expense" && item.category === budget.category && isCurrentMonth(item.date))
      .reduce((sum, item) => sum + item.amount, 0);

    const remaining = budget.limit - spent;
    const pct = budget.limit === 0 ? 0 : (spent / budget.limit) * 100;

    return {
      ...budget,
      spent,
      remaining,
      pct,
      status: pct >= 100 ? "over" : pct >= 80 ? "warning" : "good",
    };
  });
};

const getSavingsDailyNeed = (goal: SavingsGoal) => {
  const remaining = Math.max(goal.target - goal.current, 0);
  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.max(Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 1);

  return {
    remaining,
    daily: remaining / daysRemaining,
    weekly: remaining / Math.max(Math.ceil(daysRemaining / 7), 1),
    monthly: remaining / Math.max(Math.ceil(daysRemaining / 30), 1),
  };
};

const safeStorageGet = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeStorageSet = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function generateSeedUser(): Promise<AppUser> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

  const passwordHash = await hashPassword("Demo1234!", salt);

  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@smartbudget.gh",
    passwordHash,
    salt,
    currency: "GHS",
    theme: "light",
    data: sampleAppData,
  };
}

export default function SmartBudgetApp() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [activeUser, setActiveUser] = useState<AppUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    type: "expense" as TransactionType,
    category: expenseCategories[0],
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    source: "",
  });
  const [budgetForm, setBudgetForm] = useState({ category: expenseCategories[0], limit: "" });
  const [goalForm, setGoalForm] = useState({
    title: "",
    target: "",
    targetDate: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [goalAmount, setGoalAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUsers = safeStorageGet<AppUser[]>(STORAGE_KEYS.users, []);
        if (storedUsers.length === 0) {
          const demoUser = await generateSeedUser();
          const nextUsers = [demoUser];
          setUsers(nextUsers);
          setActiveUser(demoUser);
          setThemeMode(demoUser.theme);
          safeStorageSet(STORAGE_KEYS.users, nextUsers);
          safeStorageSet(STORAGE_KEYS.session, demoUser.id);
        } else {
          setUsers(storedUsers);
          const storedSession = safeStorageGet<string | null>(STORAGE_KEYS.session, null);
          const current = storedUsers.find((user) => user.id === storedSession) ?? storedUsers[0];
          if (current) {
            setActiveUser(current);
            setThemeMode(current.theme);
          }
        }
      } catch {
        setError("Unable to initialize app data.");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const persistUserSnapshot = (user: AppUser) => {
    const nextUsers = users.map((item) => (item.id === user.id ? user : item));
    setUsers(nextUsers);
    safeStorageSet(STORAGE_KEYS.users, nextUsers);
    setActiveUser(user);
  };

  const currentTransactions = activeUser?.data.transactions ?? [];
  const currentBudgets = activeUser?.data.budgets ?? [];
  const currentGoals = activeUser?.data.savingsGoals ?? [];

  const totalIncome = currentTransactions.filter((item) => item.type === "income" && isCurrentMonth(item.date)).reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = currentTransactions.filter((item) => item.type === "expense" && isCurrentMonth(item.date)).reduce((sum, item) => sum + item.amount, 0);
  const availableBalance = totalIncome - totalExpenses;
  const totalSavings = currentGoals.reduce((sum, item) => sum + item.current, 0);
  const monthlyBudget = currentBudgets.reduce((sum, item) => sum + item.limit, 0);
  const budgetSpentPct = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  const budgetSummary = useMemo(() => getBudgetSummary(currentTransactions, currentBudgets), [currentTransactions, currentBudgets]);
  const recentTransactions = useMemo(
    () => [...currentTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [currentTransactions]
  );

  const filteredTransactions = useMemo(() => {
    return currentTransactions.filter((item) => {
      const matchesType = filterType === "all" || item.type === filterType;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [currentTransactions, filterType, search]);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - index));
      d.setDate(1);
      return d;
    });

    return months.map((monthDate) => {
      const income = currentTransactions.filter((item) => item.type === "income" && matchMonth(item.date, monthDate)).reduce((sum, item) => sum + item.amount, 0);
      const expenses = currentTransactions.filter((item) => item.type === "expense" && matchMonth(item.date, monthDate)).reduce((sum, item) => sum + item.amount, 0);
      return {
        name: monthDate.toLocaleString("en-US", { month: "short" }),
        income,
        expenses,
      };
    });
  }, [currentTransactions]);

  const categoryBreakdown = useMemo(() => {
    const grouped = currentTransactions
      .filter((item) => item.type === "expense")
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + item.amount;
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [currentTransactions]);

  const handleAuthSubmit = async () => {
    const email = authEmail.trim().toLowerCase();
    if (!email || !authPassword.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (authMode === "register") {
      if (!authName.trim()) {
        setError("Full name is required.");
        return;
      }
      if (authPassword.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
      if (users.some((user) => user.email.toLowerCase() === email)) {
        setError("An account with this email already exists.");
        return;
      }

      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");
      const passwordHash = await hashPassword(authPassword, salt);

      const newUser: AppUser = {
        id: `user-${Date.now()}`,
        name: authName.trim(),
        email,
        passwordHash,
        salt,
        currency: "GHS",
        theme: "light",
        data: sampleAppData,
      };

      const nextUsers = [...users, newUser];
      setUsers(nextUsers);
      safeStorageSet(STORAGE_KEYS.users, nextUsers);
      setActiveUser(newUser);
      safeStorageSet(STORAGE_KEYS.session, newUser.id);
      setThemeMode(newUser.theme);
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
      setError(null);
      return;
    }

    const user = users.find((candidate) => candidate.email.toLowerCase() === email);
    if (!user) {
      setError("No user exists for that email.");
      return;
    }

    const passwordHash = await hashPassword(authPassword, user.salt);
    if (passwordHash !== user.passwordHash) {
      setError("Incorrect password.");
      return;
    }

    setActiveUser(user);
    safeStorageSet(STORAGE_KEYS.session, user.id);
    setThemeMode(user.theme);
    setAuthEmail("");
    setAuthPassword("");
    setError(null);
  };

  const handleLogout = () => {
    setActiveUser(null);
    safeStorageSet(STORAGE_KEYS.session, null);
    setSearch("");
    setFilterType("all");
    setError(null);
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      type: "expense",
      category: expenseCategories[0],
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      source: "",
    });
    setEditingTransactionId(null);
  };

  const handleTransactionSubmit = () => {
    if (!activeUser) return;

    const amount = Number(transactionForm.amount);
    if (!transactionForm.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!transactionForm.source.trim()) {
      setError("Source is required.");
      return;
    }
    if (!transactionForm.date || Number.isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount and date.");
      return;
    }

    const nextData: AppData = { ...activeUser.data };
    const newEntry: Transaction = {
      id: editingTransactionId || `txn-${Date.now()}`,
      type: transactionForm.type,
      category: transactionForm.category,
      description: transactionForm.description.trim(),
      amount,
      date: transactionForm.date,
      source: transactionForm.source.trim(),
    };

    if (editingTransactionId) {
      nextData.transactions = nextData.transactions.map((item) => (item.id === editingTransactionId ? newEntry : item));
    } else {
      nextData.transactions = [newEntry, ...nextData.transactions];
    }

    const updatedUser = { ...activeUser, data: nextData };
    persistUserSnapshot(updatedUser);
    setTransactionFormOpen(false);
    resetTransactionForm();
    setError(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id);
    setTransactionForm({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: String(transaction.amount),
      date: transaction.date,
      source: transaction.source,
    });
    setTransactionFormOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (!activeUser) return;
    const updatedUser = {
      ...activeUser,
      data: { ...activeUser.data, transactions: activeUser.data.transactions.filter((item) => item.id !== transactionId) },
    };
    persistUserSnapshot(updatedUser);
  };

  const handleBudgetSave = () => {
    if (!activeUser) return;
    const limit = Number(budgetForm.limit);
    if (!budgetForm.category || Number.isNaN(limit) || limit <= 0) {
      setError("Budget amount must be a valid positive number.");
      return;
    }

    const existing = activeUser.data.budgets.find((item) => item.category === budgetForm.category);
    const budgets = [...activeUser.data.budgets];
    if (existing) {
      const index = budgets.findIndex((item) => item.category === budgetForm.category);
      budgets[index] = { category: budgetForm.category, limit };
    } else {
      budgets.push({ category: budgetForm.category, limit });
    }

    persistUserSnapshot({ ...activeUser, data: { ...activeUser.data, budgets } });
    setBudgetForm({ category: expenseCategories[0], limit: "" });
    setError(null);
  };

  const handleGoalAdd = () => {
    if (!activeUser) return;
    const target = Number(goalForm.target);
    if (!goalForm.title.trim()) {
      setError("Goal title is required.");
      return;
    }
    if (Number.isNaN(target) || target <= 0) {
      setError("Goal target must be a valid positive number.");
      return;
    }

    const nextGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: goalForm.title.trim(),
      target,
      current: 0,
      targetDate: goalForm.targetDate,
      description: goalForm.description.trim() || "Goal progress",
    };

    const updatedUser = {
      ...activeUser,
      data: {
        ...activeUser.data,
        savingsGoals: [nextGoal, ...activeUser.data.savingsGoals],
      },
    };

    persistUserSnapshot(updatedUser);
    setGoalForm({ title: "", target: "", targetDate: new Date().toISOString().slice(0, 10), description: "" });
    setError(null);
  };

  const handleGoalAdjust = (goalId: string, dir: 1 | -1) => {
    if (!activeUser) return;
    const amount = Number(goalAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError("Enter a valid deposit or withdrawal amount.");
      return;
    }

    const nextGoals = activeUser.data.savingsGoals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const nextCurrent = Math.max(0, goal.current + dir * amount);
      return { ...goal, current: nextCurrent };
    });

    persistUserSnapshot({ ...activeUser, data: { ...activeUser.data, savingsGoals: nextGoals } });
    setGoalAmount("");
    setSelectedGoalId(null);
    setError(null);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ["Type", "Category", "Description", "Amount", "Date", "Source"],
      ...currentTransactions.map((item) => [item.type, item.category, item.description, item.amount, item.date, item.source]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "smartbudget-gh-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
          <h2 className="text-xl font-semibold">Loading SmartBudget GH</h2>
          <p className="mt-2 text-slate-300">Preparing your budget dashboard...</p>
        </div>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="glass-card w-full max-w-md p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-600">SmartBudget GH</p>
              <h1 className="mt-2 text-2xl font-bold">Welcome back</h1>
            </div>
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
              <PiggyBank className="h-7 w-7" />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button type="button" onClick={() => setAuthMode("login")} className={`rounded-xl px-3 py-2 text-sm font-semibold ${authMode === "login" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
              Login
            </button>
            <button type="button" onClick={() => setAuthMode("register")} className={`rounded-xl px-3 py-2 text-sm font-semibold ${authMode === "register" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
              Register
            </button>
          </div>

          {authMode === "register" && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input className="input-field" value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="E.g. Akua Mensah" />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="input-field" type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="name@example.com" />
          </div>

          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input className="input-field" type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="Minimum 8 characters" />
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button type="button" className="primary-button w-full" onClick={handleAuthSubmit}>
            {authMode === "register" ? "Create account" : "Sign in"}
          </button>

          <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            Demo login: <span className="font-semibold">demo@smartbudget.gh</span> / <span className="font-semibold">Demo1234!</span>
          </div>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    { label: "Total monthly income", value: formatMoney(totalIncome, activeUser.currency), accent: "text-emerald-600", icon: ArrowUpRight, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Total monthly expenses", value: formatMoney(totalExpenses, activeUser.currency), accent: "text-rose-600", icon: ArrowDownRight, tone: "bg-rose-50 text-rose-700" },
    { label: "Available balance", value: formatMoney(availableBalance, activeUser.currency), accent: "text-sky-600", icon: Wallet, tone: "bg-sky-50 text-sky-700" },
    { label: "Total savings", value: formatMoney(totalSavings, activeUser.currency), accent: "text-violet-600", icon: PiggyBank, tone: "bg-violet-50 text-violet-700" },
    { label: "Monthly budget", value: formatMoney(monthlyBudget, activeUser.currency), accent: "text-amber-600", icon: Target, tone: "bg-amber-50 text-amber-700" },
    { label: "Budget spent", value: `${budgetSpentPct.toFixed(1)}%`, accent: "text-brand-600", icon: TrendingUp, tone: "bg-brand-50 text-brand-700" },
  ];

  return (
    <main className="min-h-screen px-3 py-4 md:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="glass-card no-print mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-600 p-3 text-white shadow-soft">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-600">SmartBudget GH</p>
              <h1 className="text-xl font-bold">Financial Overview</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <button type="button" className="nav-link active">Dashboard</button>
            <button type="button" className="nav-link">Income</button>
            <button type="button" className="nav-link">Expenses</button>
            <button type="button" className="nav-link">Budget</button>
            <button type="button" className="nav-link">Savings</button>
            <button type="button" className="nav-link">Reports</button>
          </nav>

          <div className="flex items-center gap-2">
            <select
              className="input-field w-auto min-w-[90px] bg-white/70"
              value={activeUser.currency}
              onChange={(event) => {
                const nextCurrency = event.target.value as CurrencyCode;
                const updatedUser = { ...activeUser, currency: nextCurrency };
                persistUserSnapshot(updatedUser);
              }}
            >
              {currencyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button type="button" className="secondary-button" onClick={() => {
              const nextTheme = themeMode === "light" ? "dark" : "light";
              setThemeMode(nextTheme);
              const updatedUser = { ...activeUser, theme: nextTheme };
              persistUserSnapshot(updatedUser);
            }}>
              {themeMode === "light" ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            </button>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">{error}</div>}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="glass-card p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl p-2 ${card.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">This month</span>
                </div>
                <p className="mb-2 text-sm text-slate-500">{card.label}</p>
                <p className={`text-2xl font-bold ${card.accent}`}>{card.value}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="glass-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Income vs expenses</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Expenses</span>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatMoney(Number(value), activeUser.currency)} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#expenseFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <h2 className="section-title mb-4">Spending by category</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={categoryColors[entry.name] || "#14b8a6"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatMoney(Number(value), activeUser.currency)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {categoryBreakdown.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColors[item.name] || "#14b8a6" }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatMoney(item.value, activeUser.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Recent transactions</h2>
              <button type="button" className="primary-button" onClick={() => setTransactionFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add transaction
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-500">No recent transactions yet.</p>
              ) : (
                recentTransactions.map((item) => {
                  const Icon = categoryIcons[item.category] || CreditCard;
                  const isIncome = item.type === "income";
                  return (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2 ${isIncome ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-xs text-slate-500">{item.category} · {formatShortDate(item.date, activeUser.currency)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                          {isIncome ? "+" : "-"}{formatMoney(item.amount, activeUser.currency)}
                        </p>
                        <div className="mt-1 flex justify-end gap-2">
                          <button type="button" className="text-slate-500 hover:text-slate-800" onClick={() => handleEditTransaction(item)}><Pencil className="h-4 w-4" /></button>
                          <button type="button" className="text-slate-500 hover:text-red-600" onClick={() => handleDeleteTransaction(item.id)}><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Monthly financial summary</h2>
              <Bell className="h-4 w-4 text-slate-500" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatMoney(Number(value), activeUser.currency)} />
                  <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="section-title">Transaction ledger</h2>
              <div className="relative min-w-[180px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="input-field pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions" />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "income", "expense"] as const).map((entry) => (
                <button key={entry} type="button" onClick={() => setFilterType(entry)} className={`rounded-full px-3 py-1.5 text-sm font-medium ${filterType === entry ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {entry === "all" ? "All" : entry}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 pr-3 font-medium">Type</th>
                    <th className="pb-3 pr-3 font-medium">Category</th>
                    <th className="pb-3 pr-3 font-medium">Description</th>
                    <th className="pb-3 pr-3 font-medium">Amount</th>
                    <th className="pb-3 pr-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">No transactions found.</td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-3 pr-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${item.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{item.type}</span></td>
                        <td className="py-3 pr-3">{item.category}</td>
                        <td className="py-3 pr-3">{item.description}</td>
                        <td className={`py-3 pr-3 font-medium ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{item.type === "income" ? "+" : "-"}{formatMoney(item.amount, activeUser.currency)}</td>
                        <td className="py-3 pr-3">{formatShortDate(item.date, activeUser.currency)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button type="button" className="text-slate-500 hover:text-slate-800" onClick={() => handleEditTransaction(item)}><Pencil className="h-4 w-4" /></button>
                            <button type="button" className="text-slate-500 hover:text-red-600" onClick={() => handleDeleteTransaction(item.id)}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title">Budget planner</h2>
                <ShieldCheck className="h-4 w-4 text-brand-600" />
              </div>

              <div className="space-y-3">
                {budgetSummary.map((item) => {
                  const isWarning = item.status === "warning";
                  const isOver = item.status === "over";
                  return (
                    <div key={item.category} className="rounded-2xl border border-slate-200 p-3">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className={`${isOver ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-600"}`}>{item.pct.toFixed(0)}%</span>
                      </div>
                      <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${isOver ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatMoney(item.spent, activeUser.currency)}</span>
                        <span>{formatMoney(item.remaining, activeUser.currency)} left</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-3">
                <select className="input-field" value={budgetForm.category} onChange={(event) => setBudgetForm((state) => ({ ...state, category: event.target.value }))}>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input type="number" className="input-field" value={budgetForm.limit} onChange={(event) => setBudgetForm((state) => ({ ...state, limit: event.target.value }))} placeholder="Monthly limit" />
                <button type="button" className="primary-button w-full" onClick={handleBudgetSave}>Save budget</button>
              </div>
            </div>

            <div className="glass-card p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title">Savings goals</h2>
                <PiggyBank className="h-4 w-4 text-violet-600" />
              </div>

              <div className="space-y-3">
                {currentGoals.map((goal) => {
                  const stats = getSavingsDailyNeed(goal);
                  const progress = goal.target === 0 ? 0 : (goal.current / goal.target) * 100;

                  return (
                    <div key={goal.id} className="rounded-2xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-xs text-slate-500">{goal.description}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="mb-2 h-2.5 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                        <span>{formatMoney(goal.current, activeUser.currency)} saved</span>
                        <span>{formatMoney(goal.target, activeUser.currency)} target</span>
                      </div>
                      <div className="mb-3 text-xs text-slate-500">
                        Need: {formatMoney(stats.remaining, activeUser.currency)} · Daily {formatMoney(stats.daily, activeUser.currency)} · Weekly {formatMoney(stats.weekly, activeUser.currency)} · Monthly {formatMoney(stats.monthly, activeUser.currency)}
                      </div>
                      <div className="flex gap-2">
                        <input className="input-field w-full" value={selectedGoalId === goal.id ? goalAmount : ""} onFocus={() => setSelectedGoalId(goal.id)} onChange={(event) => { setSelectedGoalId(goal.id); setGoalAmount(event.target.value); }} placeholder="Amount" />
                        <button type="button" className="primary-button" onClick={() => handleGoalAdjust(goal.id, 1)}>Deposit</button>
                        <button type="button" className="secondary-button" onClick={() => handleGoalAdjust(goal.id, -1)}>Withdraw</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 rounded-2xl bg-violet-50 p-3">
                <input className="input-field" value={goalForm.title} onChange={(event) => setGoalForm((state) => ({ ...state, title: event.target.value }))} placeholder="Goal title" />
                <input type="number" className="input-field" value={goalForm.target} onChange={(event) => setGoalForm((state) => ({ ...state, target: event.target.value }))} placeholder="Target amount" />
                <input type="date" className="input-field" value={goalForm.targetDate} onChange={(event) => setGoalForm((state) => ({ ...state, targetDate: event.target.value }))} />
                <textarea className="input-field min-h-[72px] resize-none" value={goalForm.description} onChange={(event) => setGoalForm((state) => ({ ...state, description: event.target.value }))} placeholder="Goal description" />
                <button type="button" className="primary-button w-full" onClick={handleGoalAdd}>Add goal</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Financial reports</h2>
              <div className="flex gap-2 no-print">
                <button type="button" className="secondary-button" onClick={handleDownloadCsv}><Download className="mr-2 h-4 w-4" />CSV</button>
                <button type="button" className="primary-button" onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" />PDF</button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm text-slate-500">Monthly income</p>
                <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalIncome, activeUser.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm text-slate-500">Monthly expenses</p>
                <p className="text-2xl font-bold text-rose-600">{formatMoney(totalExpenses, activeUser.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm text-slate-500">Savings growth</p>
                <p className="text-2xl font-bold text-violet-600">{formatMoney(totalSavings, activeUser.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm text-slate-500">Working balance</p>
                <p className="text-2xl font-bold text-sky-600">{formatMoney(availableBalance, activeUser.currency)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <h2 className="section-title mb-4">Security</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
                Passwords are stored with salted hashing in the browser-based local auth layer
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-sky-50 p-3 text-sky-700">
                <CheckCircle2 className="h-5 w-5" />
                Private wallet data stays associated with the signed-in user account
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-3 text-amber-700">
                <AlarmClockCheck className="h-5 w-5" />
                Budget alerts trigger when spending hits 80% or 100% of any limit
              </div>
            </div>
          </div>
        </section>
      </div>

      {transactionFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingTransactionId ? "Edit transaction" : "Add transaction"}</h2>
              <button type="button" onClick={() => { setTransactionFormOpen(false); resetTransactionForm(); }} className="text-slate-500">✕</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Type</label>
                <select
                  className="input-field"
                  value={transactionForm.type}
                  onChange={(event) => {
                    const nextType = event.target.value as TransactionType;
                    setTransactionForm((state) => ({
                      ...state,
                      type: nextType,
                      category: nextType === "income" ? incomeCategories[0] : expenseCategories[0],
                    }));
                  }}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select className="input-field" value={transactionForm.category} onChange={(event) => setTransactionForm((state) => ({ ...state, category: event.target.value }))}>
                  {(transactionForm.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <input className="input-field" value={transactionForm.description} onChange={(event) => setTransactionForm((state) => ({ ...state, description: event.target.value }))} placeholder="e.g. Grocery purchase" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Amount</label>
                <input type="number" className="input-field" value={transactionForm.amount} onChange={(event) => setTransactionForm((state) => ({ ...state, amount: event.target.value }))} placeholder="0.00" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <input type="date" className="input-field" value={transactionForm.date} onChange={(event) => setTransactionForm((state) => ({ ...state, date: event.target.value }))} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Source</label>
                <input className="input-field" value={transactionForm.source} onChange={(event) => setTransactionForm((state) => ({ ...state, source: event.target.value }))} placeholder="e.g. Salary, Shop, Employer" />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="secondary-button" onClick={() => { setTransactionFormOpen(false); resetTransactionForm(); }}>Cancel</button>
              <button type="button" className="primary-button" onClick={handleTransactionSubmit}>{editingTransactionId ? "Save changes" : "Add transaction"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
