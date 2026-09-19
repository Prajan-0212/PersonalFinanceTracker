import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PiggyBank,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Menu,
  X,
  Trash2,
  IndianRupee,
  Eye,
  EyeOff,
  ShieldCheck,
  PieChart as PieChartIcon,
  Target
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [user, setUser] = useState(null);

  const token = localStorage.getItem("fintrack_token");

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    transactionDate: new Date().toISOString().split("T")[0],
    description: "",
    categoryId: 1
  });

  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    transactionDate: new Date().toISOString().split("T")[0],
    description: ""
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("fintrack_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("fintrack_user");
      }
    }
  }, []);

  async function apiFetch(url, options = {}) {
    const currentToken = localStorage.getItem("fintrack_token");

    const headers = {
      ...(options.headers || {})
    };

    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem("fintrack_token");
      localStorage.removeItem("fintrack_user");
      setUser(null);
    }

    return response;
  }

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    if (!user?.id) {
      return;
    }

    try {
      const [expenseRes, categoryRes, incomeRes] =
          await Promise.all([
            apiFetch(`${API}/api/expenses/user/${user.id}`),
            apiFetch(`${API}/api/categories`),
            apiFetch(`${API}/api/income/user/${user.id}`)
          ]);

      if (expenseRes.ok) {
        const expenseData = await expenseRes.json();
        setExpenses(Array.isArray(expenseData) ? expenseData : []);
      } else {
        setExpenses([]);
      }

      if (categoryRes.ok) {
        const categoryData = await categoryRes.json();
        setCategories(
            Array.isArray(categoryData) ? categoryData : []
        );
      } else {
        setCategories([]);
      }

      if (incomeRes.ok) {
        const incomeData = await incomeRes.json();
        setIncomes(Array.isArray(incomeData) ? incomeData : []);
      } else {
        setIncomes([]);
      }

      try {
        const now = new Date();

        const budgetRes = await apiFetch(
            `${API}/api/budget/${user.id}?month=${
                now.getMonth() + 1
            }&year=${now.getFullYear()}`
        );

        if (budgetRes.ok) {
          const budgetData = await budgetRes.json();

          const amount = Number(budgetData.amount || 0);

          setBudget(amount);
          setBudgetInput(amount > 0 ? String(amount) : "");
        } else {
          setBudget(0);
          setBudgetInput("");
        }
      } catch (error) {
        console.error("Budget loading failed:", error);
        setBudget(0);
        setBudgetInput("");
      }
    } catch (error) {
      console.error("API connection error:", error);
    }
  }

  async function saveBudget(e) {
    if (e) {
      e.preventDefault();
    }

    const amount = Number(budgetInput);

    if (!amount || amount <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    if (!user?.id) {
      alert("Please log in again.");
      return;
    }

    const now = new Date();

    try {
      const response = await apiFetch(
          `${API}/api/budget/${user.id}`,
          {
            method: "POST",
            body: JSON.stringify({
              amount,
              month: now.getMonth() + 1,
              year: now.getFullYear()
            })
          }
      );

      if (!response.ok) {
        throw new Error("Failed to save budget");
      }

      const data = await response.json();

      const savedAmount = Number(data.amount || amount);

      setBudget(savedAmount);
      setBudgetInput(String(savedAmount));

      alert("Budget updated successfully.");
    } catch (error) {
      console.error("Budget save failed:", error);
      alert("Could not save budget. Please check the backend.");
    }
  }

  async function addExpense(e) {
    e.preventDefault();

    if (!user?.id) {
      alert("Please log in again.");
      return;
    }

    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await apiFetch(`${API}/api/expenses`, {
        method: "POST",
        body: JSON.stringify({
          amount: Number(expenseForm.amount),
          transactionDate: expenseForm.transactionDate,
          description: expenseForm.description,
          user: {
            id: user.id
          },
          category: {
            id: Number(expenseForm.categoryId)
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      setExpenseForm({
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        description: "",
        categoryId: categories[0]?.id || 1
      });

      setShowExpenseForm(false);

      await loadData();
    } catch (error) {
      alert("Could not add expense. Please check the backend.");
      console.error(error);
    }
  }

  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) {
      return;
    }

    try {
      const response = await apiFetch(
          `${API}/api/expenses/${id}`,
          {
            method: "DELETE"
          }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadData();
    } catch (error) {
      alert("Could not delete expense.");
      console.error(error);
    }
  }

  async function addIncome(e) {
    e.preventDefault();

    if (!user?.id) {
      alert("Please log in again.");
      return;
    }

    if (!incomeForm.amount || Number(incomeForm.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await apiFetch(`${API}/api/income`, {
        method: "POST",
        body: JSON.stringify({
          amount: Number(incomeForm.amount),
          transactionDate: incomeForm.transactionDate,
          description: incomeForm.description,
          user: {
            id: user.id
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      setIncomeForm({
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        description: ""
      });

      setShowIncomeForm(false);

      await loadData();
    } catch (error) {
      alert("Could not add income. Please check the backend.");
      console.error(error);
    }
  }

  function logout() {
    localStorage.removeItem("fintrack_token");
    localStorage.removeItem("fintrack_user");

    setUser(null);
    setExpenses([]);
    setIncomes([]);
    setCategories([]);
    setBudget(0);
    setBudgetInput("");
    setActivePage("Dashboard");
  }

  const totalExpenses = useMemo(
      () =>
          expenses.reduce(
              (sum, item) => sum + Number(item.amount || 0),
              0
          ),
      [expenses]
  );

  const totalIncome = useMemo(
      () =>
          incomes.reduce(
              (sum, item) => sum + Number(item.amount || 0),
              0
          ),
      [incomes]
  );

  const balance = totalIncome - totalExpenses;

  const remainingBudget = Math.max(
      budget - totalExpenses,
      0
  );

  const budgetPercentage =
      budget > 0
          ? Math.min((totalExpenses / budget) * 100, 100)
          : 0;

  function getCategoryName(expense) {
    const categoryId =
        expense?.category?.id ??
        expense?.categoryId;

    return (
        expense?.category?.name ??
        categories.find(
            (category) =>
                Number(category.id) === Number(categoryId)
        )?.name ??
        "Other"
    );
  }

  const categoryData = useMemo(() => {
    const grouped = {};

    expenses.forEach((expense) => {
      const categoryName = getCategoryName(expense);

      grouped[categoryName] =
          (grouped[categoryName] || 0) +
          Number(expense.amount || 0);
    });

    return Object.entries(grouped).map(
        ([name, value]) => ({
          name,
          value
        })
    );
  }, [expenses, categories]);

  const monthlyData = useMemo(() => {
    const result = [];

    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthIncome = incomes
          .filter((income) => {
            const incomeDate = new Date(
                `${income.transactionDate}T00:00:00`
            );

            return (
                incomeDate.getFullYear() === year &&
                incomeDate.getMonth() === month
            );
          })
          .reduce(
              (sum, income) =>
                  sum + Number(income.amount || 0),
              0
          );

      const monthExpense = expenses
          .filter((expense) => {
            const expenseDate = new Date(
                `${expense.transactionDate}T00:00:00`
            );

            return (
                expenseDate.getFullYear() === year &&
                expenseDate.getMonth() === month
            );
          })
          .reduce(
              (sum, expense) =>
                  sum + Number(expense.amount || 0),
              0
          );

      result.push({
        month: date.toLocaleString("en-US", {
          month: "short"
        }),
        income: monthIncome,
        expense: monthExpense
      });
    }

    return result;
  }, [expenses, incomes]);

  const recentTransactions = useMemo(() => {
    const transactions = [
      ...expenses.map((expense) => ({
        id: `expense-${expense.id}`,
        type: "EXPENSE",
        description:
            expense.description || "Expense",
        category: getCategoryName(expense),
        date: expense.transactionDate,
        amount: Number(expense.amount || 0),
        original: expense
      })),

      ...incomes.map((income) => ({
        id: `income-${income.id}`,
        type: "INCOME",
        description:
            income.description || "Income",
        category: "Income",
        date: income.transactionDate,
        amount: Number(income.amount || 0),
        original: income
      }))
    ];

    return transactions
        .sort(
            (a, b) =>
                new Date(`${b.date}T00:00:00`) -
                new Date(`${a.date}T00:00:00`)
        )
        .slice(0, 10);
  }, [expenses, incomes, categories]);

  const currentDate = new Date();

  const currentMonthName =
      currentDate.toLocaleString("en-US", {
        month: "long"
      });

  const currentMonthUpper =
      currentMonthName.toUpperCase();

  const currentYear = currentDate.getFullYear();

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Expenses",
      icon: Receipt
    },
    {
      name: "Income",
      icon: Wallet
    },
    {
      name: "Budget",
      icon: PiggyBank
    },
    {
      name: "Reports",
      icon: BarChart3
    },
    {
      name: "Settings",
      icon: Settings
    }
  ];

  if (!token || !user) {
    return <AuthScreen />;
  }

  return (
      <div className="app-shell">

        <aside
            className={`sidebar ${
                mobileMenu ? "mobile-open" : ""
            }`}
        >
          <div className="brand">

            <div className="brand-icon">
              <IndianRupee size={23} />
            </div>

            <div>
              <h2>FinTrack</h2>
              <span>Personal Finance</span>
            </div>

            <button
                className="mobile-close"
                onClick={() => setMobileMenu(false)}
            >
              <X size={20} />
            </button>

          </div>

          <nav>

            <p className="nav-label">
              MAIN MENU
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                  <button
                      key={item.name}
                      className={`nav-item ${
                          activePage === item.name
                              ? "active"
                              : ""
                      }`}
                      onClick={() => {
                        setActivePage(item.name);
                        setMobileMenu(false);
                      }}
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </button>
              );
            })}

          </nav>

          <div className="sidebar-bottom">

            <div className="user-card">

              <div className="avatar">
                {user.fullName?.charAt(0)?.toUpperCase() ||
                    "U"}
              </div>

              <div>
                <strong>
                  {user.fullName || "User"}
                </strong>

                <span>
                Personal Account
              </span>
              </div>

            </div>

            <button
                className="logout"
                onClick={logout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </aside>

        <main className="main-content">

          <header className="topbar">

            <button
                className="menu-button"
                onClick={() => setMobileMenu(true)}
            >
              <Menu />
            </button>

            <div>

              <p className="welcome-small">
                Good afternoon
              </p>

              <h1>
                {activePage}
              </h1>

            </div>

            <div className="top-actions">

              <button
                  className="secondary-button"
                  onClick={() =>
                      setShowIncomeForm(true)
                  }
              >
                <Plus size={17} />
                Add Income
              </button>

              <button
                  className="primary-button"
                  onClick={() =>
                      setShowExpenseForm(true)
                  }
              >
                <Plus size={17} />
                Add Expense
              </button>

            </div>

          </header>

          {activePage === "Dashboard" && (
              <>
                <section className="hero">

                  <div>

                <span className="hero-label">
                  FINANCIAL OVERVIEW
                </span>

                    <h2>
                      Welcome {user.fullName}
                    </h2>

                    <p>
                      Track your spending, monitor your
                      budget and understand where your money
                      goes.
                    </p>

                  </div>

                  <div className="hero-decoration">
                    <TrendingUp
                        size={90}
                        strokeWidth={1}
                    />
                  </div>

                </section>

                <section className="stats-grid">

                  <StatCard
                      title="Total Income"
                      value={totalIncome}
                      icon={<ArrowUpRight />}
                      type="income"
                  />

                  <StatCard
                      title="Total Expenses"
                      value={totalExpenses}
                      icon={<ArrowDownRight />}
                      type="expense"
                  />

                  <StatCard
                      title="Current Balance"
                      value={balance}
                      icon={<Wallet />}
                      type="balance"
                  />

                  <StatCard
                      title="Monthly Budget"
                      value={budget}
                      icon={<PiggyBank />}
                      type="budget"
                  />

                </section>

                <section className="dashboard-grid">

                  <div className="panel chart-panel">

                    <div className="panel-header">

                      <div>

                        <h3>
                          Income vs Expenses
                        </h3>

                        <p>
                          Monthly financial activity
                        </p>

                      </div>

                      <select defaultValue="Last 6 months">
                        <option>
                          Last 6 months
                        </option>

                        <option>
                          This year
                        </option>
                      </select>

                    </div>

                    <ResponsiveContainer
                        width="100%"
                        height={280}
                    >
                      <BarChart data={monthlyData}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="income"
                            name="Income"
                            radius={[5, 5, 0, 0]}
                        />

                        <Bar
                            dataKey="expense"
                            name="Expenses"
                            radius={[5, 5, 0, 0]}
                        />

                      </BarChart>
                    </ResponsiveContainer>

                  </div>

                  <div className="panel">

                    <div className="panel-header">

                      <div>

                        <h3>
                          Spending by Category
                        </h3>

                        <p>
                          Where your money goes
                        </p>

                      </div>

                    </div>

                    {categoryData.length > 0 ? (
                        <>
                          <ResponsiveContainer
                              width="100%"
                              height={210}
                          >

                            <PieChart>

                              <Pie
                                  data={categoryData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={75}
                                  innerRadius={45}
                              >

                                {categoryData.map(
                                    (_, index) => (
                                        <Cell key={index} />
                                    )
                                )}

                              </Pie>

                              <Tooltip />

                            </PieChart>

                          </ResponsiveContainer>

                          <div className="category-list">

                            {categoryData.map((item) => (

                                <div
                                    className="category-row"
                                    key={item.name}
                                >

                          <span>
                            {item.name}
                          </span>

                                  <strong>
                                    Rs.
                                    {item.value.toLocaleString(
                                        "en-IN"
                                    )}
                                  </strong>

                                </div>

                            ))}

                          </div>
                        </>
                    ) : (
                        <div className="empty-chart">

                          <BarChart3 size={38} />

                          <p>
                            No spending data yet
                          </p>

                        </div>
                    )}

                  </div>

                </section>

                <section className="panel transactions-panel">

                  <div className="panel-header">

                    <div>

                      <h3>
                        Recent Transactions
                      </h3>

                      <p>
                        Your latest financial activity
                      </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            setActivePage("Expenses")
                        }
                    >
                      View all
                    </button>

                  </div>

                  <TransactionTable
                      transactions={recentTransactions}
                      onDelete={deleteExpense}
                      showActions
                  />

                </section>
              </>
          )}

          {activePage === "Expenses" && (
              <section className="page-section">

                <div className="page-heading">

                  <div>

                    <h2>
                      Expenses
                    </h2>

                    <p>
                      Manage and track all your expenses.
                    </p>

                  </div>

                  <button
                      className="primary-button"
                      onClick={() =>
                          setShowExpenseForm(true)
                      }
                  >
                    <Plus size={17} />
                    Add Expense
                  </button>

                </div>

                <div className="panel">

                  <TransactionTable
                      transactions={expenses.map(
                          (expense) => ({
                            id: `expense-${expense.id}`,
                            type: "EXPENSE",
                            description:
                                expense.description ||
                                "Expense",
                            category:
                                getCategoryName(expense),
                            date:
                            expense.transactionDate,
                            amount:
                                Number(expense.amount || 0),
                            original: expense
                          })
                      )}
                      onDelete={deleteExpense}
                      showActions
                  />

                </div>

              </section>
          )}

          {activePage === "Income" && (
              <section className="page-section">

                <div className="page-heading">

                  <div>

                    <h2>
                      Income
                    </h2>

                    <p>
                      Track your income sources.
                    </p>

                  </div>

                  <button
                      className="primary-button"
                      onClick={() =>
                          setShowIncomeForm(true)
                      }
                  >
                    <Plus size={17} />
                    Add Income
                  </button>

                </div>

                <div className="panel">

                  {incomes.length === 0 ? (
                      <div className="empty-state">

                        <Wallet size={45} />

                        <h3>
                          No income records yet
                        </h3>

                        <p>
                          Add your first income transaction.
                        </p>

                      </div>
                  ) : (
                      incomes
                          .slice()
                          .sort(
                              (a, b) =>
                                  new Date(
                                      `${b.transactionDate}T00:00:00`
                                  ) -
                                  new Date(
                                      `${a.transactionDate}T00:00:00`
                                  )
                          )
                          .map((income) => (

                              <div
                                  className="simple-row"
                                  key={income.id}
                              >

                                <div>

                                  <strong>
                                    {income.description ||
                                        "Income"}
                                  </strong>

                                  <span>
                          {income.transactionDate}
                        </span>

                                </div>

                                <strong className="income-text">

                                  +Rs.
                                  {Number(
                                      income.amount
                                  ).toLocaleString("en-IN")}

                                </strong>

                              </div>

                          ))
                  )}

                </div>

              </section>
          )}

          {activePage === "Budget" && (
              <section className="page-section">

                <div className="page-heading">

                  <div>

                    <h2>
                      Monthly Budget
                    </h2>

                    <p>
                      Keep your spending within your planned
                      limit.
                    </p>

                  </div>

                </div>

                <div className="budget-card">

                  <div className="budget-top">

                    <div>

                  <span>
                    {currentMonthUpper} {currentYear}
                  </span>

                      <h2>
                        Rs.
                        {budget.toLocaleString("en-IN")}
                      </h2>

                      <p>
                        Monthly spending limit
                      </p>

                    </div>

                    <PiggyBank size={55} />

                  </div>

                  <div className="progress-track">

                    <div
                        className="progress-value"
                        style={{
                          width: `${budgetPercentage}%`
                        }}
                    />

                  </div>

                  <div className="budget-footer">

                <span>
                  Rs.
                  {totalExpenses.toLocaleString(
                      "en-IN"
                  )}{" "}
                  spent
                </span>

                    <strong>
                      Rs.
                      {remainingBudget.toLocaleString(
                          "en-IN"
                      )}{" "}
                      remaining
                    </strong>

                  </div>

                </div>

                <div
                    className="panel"
                    style={{ marginTop: "20px" }}
                >

                  <div className="panel-header">

                    <div>

                      <h3>
                        Set Monthly Budget
                      </h3>

                      <p>
                        Update your spending limit for
                        {` ${currentMonthName} ${currentYear}`}.
                      </p>

                    </div>

                  </div>

                                    <form onSubmit={saveBudget}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "22px"
                      }}
                    >
                      <label
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#172033"
                        }}
                      >
                        Budget Amount
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          flexWrap: "wrap"
                        }}
                      >
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter budget amount"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          required
                          style={{
                            width: "260px",
                            maxWidth: "100%",
                            padding: "13px 15px",
                            border: "1px solid #d9dee8",
                            borderRadius: "10px",
                            fontSize: "15px",
                            color: "#172033",
                            outline: "none",
                            boxSizing: "border-box"
                          }}
                        />

                        <button
                          className="primary-button"
                          type="submit"
                          style={{
                            marginTop: "0",
                            minHeight: "46px",
                            padding: "0 22px",
                            borderRadius: "10px"
                          }}
                        >
                          Save Budget
                        </button>
                      </div>
                    </div>
                  </form>

                </div>

              </section>
          )}

          {activePage === "Reports" && (
              <section className="page-section">

                <div className="page-heading">

                  <div>

                    <h2>
                      Financial Reports
                    </h2>

                    <p>
                      Understand your financial performance.
                    </p>

                  </div>

                </div>

                <div className="stats-grid">

                  <StatCard
                      title="Total Income"
                      value={totalIncome}
                      type="income"
                  />

                  <StatCard
                      title="Total Expenses"
                      value={totalExpenses}
                      type="expense"
                  />

                  <StatCard
                      title="Balance"
                      value={balance}
                      type="balance"
                  />

                  <StatCard
                      title="Transactions"
                      value={
                          expenses.length +
                          incomes.length
                      }
                      raw
                      type="budget"
                  />

                </div>

                <div className="panel report-summary">

                  <h3>
                    Financial Summary
                  </h3>

                  <div className="summary-line">

                <span>
                  Total income
                </span>

                    <strong>
                      Rs.
                      {totalIncome.toLocaleString(
                          "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="summary-line">

                <span>
                  Total expenses
                </span>

                    <strong>
                      Rs.
                      {totalExpenses.toLocaleString(
                          "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="summary-line">

                <span>
                  Net balance
                </span>

                    <strong>
                      Rs.
                      {balance.toLocaleString(
                          "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="summary-line">

                <span>
                  Monthly budget
                </span>

                    <strong>
                      Rs.
                      {budget.toLocaleString(
                          "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="summary-line">

                <span>
                  Remaining budget
                </span>

                    <strong>
                      Rs.
                      {remainingBudget.toLocaleString(
                          "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

              </section>
          )}

          {activePage === "Settings" && (
              <section className="page-section">

                <div className="page-heading">

                  <div>

                    <h2>
                      Settings
                    </h2>

                    <p>
                      Manage your account preferences.
                    </p>

                  </div>

                </div>

                <div className="panel settings-panel">

                  <div className="profile-large">

                    <div className="avatar large">
                      {user.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                    </div>

                    <div>

                      <h3>
                        {user.fullName}
                      </h3>

                      <p>
                        {user.email}
                      </p>

                    </div>

                  </div>

                  <div className="setting-item">

                <span>
                  Account Type
                </span>

                    <strong>
                      Personal Account
                    </strong>

                  </div>

                  <div className="setting-item">

                <span>
                  Currency
                </span>

                    <strong>
                      Indian Rupee (Rs.)
                    </strong>

                  </div>

                  <div className="setting-item">

                <span>
                  Theme
                </span>

                    <strong>
                      Light
                    </strong>

                  </div>

                </div>

              </section>
          )}

        </main>

        {showExpenseForm && (
            <Modal
                title="Add Expense"
                onClose={() =>
                    setShowExpenseForm(false)
                }
            >

              <form onSubmit={addExpense}>

                <label>
                  Amount
                </label>

                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Rs. 0.00"
                    value={expenseForm.amount}
                    onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          amount: e.target.value
                        })
                    }
                    required
                />

                <label>
                  Date
                </label>

                <input
                    type="date"
                    value={
                      expenseForm.transactionDate
                    }
                    onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          transactionDate:
                          e.target.value
                        })
                    }
                    required
                />

                <label>
                  Category
                </label>

                <select
                    value={expenseForm.categoryId}
                    onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          categoryId: e.target.value
                        })
                    }
                >

                  {categories.length ? (
                      categories.map((category) => (

                          <option
                              value={category.id}
                              key={category.id}
                          >
                            {category.name}
                          </option>

                      ))
                  ) : (
                      <option value="1">
                        Food
                      </option>
                  )}

                </select>

                <label>
                  Description
                </label>

                <input
                    type="text"
                    placeholder="e.g. Lunch"
                    value={
                      expenseForm.description
                    }
                    onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          description:
                          e.target.value
                        })
                    }
                    required
                />

                <button
                    className="primary-button full-width"
                    type="submit"
                >
                  Add Expense
                </button>

              </form>

            </Modal>
        )}

        {showIncomeForm && (
            <Modal
                title="Add Income"
                onClose={() =>
                    setShowIncomeForm(false)
                }
            >

              <form onSubmit={addIncome}>

                <label>
                  Amount
                </label>

                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Rs. 0.00"
                    value={incomeForm.amount}
                    onChange={(e) =>
                        setIncomeForm({
                          ...incomeForm,
                          amount: e.target.value
                        })
                    }
                    required
                />

                <label>
                  Date
                </label>

                <input
                    type="date"
                    value={
                      incomeForm.transactionDate
                    }
                    onChange={(e) =>
                        setIncomeForm({
                          ...incomeForm,
                          transactionDate:
                          e.target.value
                        })
                    }
                    required
                />

                <label>
                  Description
                </label>

                <input
                    type="text"
                    placeholder="e.g. Salary"
                    value={
                      incomeForm.description
                    }
                    onChange={(e) =>
                        setIncomeForm({
                          ...incomeForm,
                          description:
                          e.target.value
                        })
                    }
                    required
                />

                <button
                    className="primary-button full-width"
                    type="submit"
                >
                  Add Income
                </button>

              </form>

            </Modal>
        )}

      </div>
  );
}

/*
 * =========================================================
 * PROFESSIONAL AUTH SCREEN
 * =========================================================
 */

function AuthScreen() {
  const [mode, setMode] = useState("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
  }

  async function submitLogin(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
          `${API}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email.trim(),
              password
            })
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
            data.message ||
            "Invalid email or password"
        );
      }

      localStorage.setItem(
          "fintrack_token",
          data.token
      );

      localStorage.setItem(
          "fintrack_user",
          JSON.stringify(data.user)
      );

      window.location.reload();
    } catch (err) {
      setError(
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e) {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
          `${API}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fullName: fullName.trim(),
              email: email.trim(),
              password
            })
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
            data.message ||
            "Registration failed"
        );
      }

      setMode("login");
      setPassword("");

      setMessage(
          "Account created successfully. Please login to continue."
      );
    } catch (err) {
      setError(
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
      <div style={authStyles.page}>

        <div style={authStyles.backgroundGlowOne} />
        <div style={authStyles.backgroundGlowTwo} />

        <div style={authStyles.authContainer}>

          {/* LEFT BRANDING PANEL */}

          <div style={authStyles.brandPanel}>

            <div style={authStyles.brandTop}>

              <div style={authStyles.logoBox}>
                <IndianRupee size={27} strokeWidth={2.5} />
              </div>

              <div>
                <div style={authStyles.brandName}>
                  FinTrack
                </div>

                <div style={authStyles.brandSubtitle}>
                  Personal Finance
                </div>
              </div>

            </div>

            <div style={authStyles.brandContent}>

              <div style={authStyles.eyebrow}>
                SMARTER MONEY MANAGEMENT
              </div>

              <h1 style={authStyles.brandHeading}>
                Take control of
                <br />
                <span style={authStyles.brandHeadingAccent}>
                your finances.
              </span>
              </h1>

              <p style={authStyles.brandDescription}>
                Track income, manage expenses, set budgets
                and understand your spending — all in one
                simple and secure place.
              </p>

              <div style={authStyles.featureList}>

                <div style={authStyles.featureItem}>
                  <div style={authStyles.featureIcon}>
                    <PieChartIcon size={18} />
                  </div>

                  <div>
                    <strong style={authStyles.featureTitle}>
                      Clear financial insights
                    </strong>

                    <span style={authStyles.featureText}>
                    Understand where your money goes.
                  </span>
                  </div>
                </div>

                <div style={authStyles.featureItem}>
                  <div style={authStyles.featureIcon}>
                    <Target size={18} />
                  </div>

                  <div>
                    <strong style={authStyles.featureTitle}>
                      Stay within your budget
                    </strong>

                    <span style={authStyles.featureText}>
                    Set monthly limits and monitor progress.
                  </span>
                  </div>
                </div>

                <div style={authStyles.featureItem}>
                  <div style={authStyles.featureIcon}>
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <strong style={authStyles.featureTitle}>
                      Secure personal account
                    </strong>

                    <span style={authStyles.featureText}>
                    Your financial data stays connected to
                    your account.
                  </span>
                  </div>
                </div>

              </div>

            </div>

            <div style={authStyles.brandFooter}>
              © 2026 FinTrack · Personal Finance Tracker
            </div>

          </div>

          {/* RIGHT FORM PANEL */}

          <div style={authStyles.formPanel}>

            <div style={authStyles.formWrapper}>

              <div style={authStyles.mobileLogo}>

                <div style={authStyles.mobileLogoBox}>
                  <IndianRupee size={22} />
                </div>

                <span style={authStyles.mobileLogoText}>
                FinTrack
              </span>

              </div>

              <div style={authStyles.formHeader}>

                <h2 style={authStyles.formTitle}>
                  {isLogin
                      ? "Welcome back"
                      : "Create your account"}
                </h2>

                <p style={authStyles.formSubtitle}>
                  {isLogin
                      ? "Sign in to continue managing your finances."
                      : "Create your account and start tracking your money."}
                </p>

              </div>

              {error && (
                  <div style={authStyles.errorBox}>
                <span style={authStyles.errorIcon}>
                  !
                </span>

                    <span>
                  {error}
                </span>
                  </div>
              )}

              {message && (
                  <div style={authStyles.successBox}>
                <span style={authStyles.successIcon}>
                  ✓
                </span>

                    <span>
                  {message}
                </span>
                  </div>
              )}

              {isLogin ? (
                  <form
                      onSubmit={submitLogin}
                      style={authStyles.form}
                  >

                    <div style={authStyles.fieldGroup}>

                      <label style={authStyles.label}>
                        Email address
                      </label>

                      <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) =>
                              setEmail(e.target.value)
                          }
                          style={authStyles.input}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                                "#172033";
                            e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(23,32,51,0.08)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                                "#d9dee8";
                            e.currentTarget.style.boxShadow =
                                "none";
                          }}
                          required
                      />

                    </div>

                    <div style={authStyles.fieldGroup}>

                      <div style={authStyles.labelRow}>

                        <label style={authStyles.label}>
                          Password
                        </label>

                      </div>

                      <div style={authStyles.passwordWrapper}>

                        <input
                            type={
                              showPassword
                                  ? "text"
                                  : "password"
                            }
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            style={{
                              ...authStyles.input,
                              paddingRight: "48px"
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                  "#172033";
                              e.currentTarget.style.boxShadow =
                                  "0 0 0 3px rgba(23,32,51,0.08)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor =
                                  "#d9dee8";
                              e.currentTarget.style.boxShadow =
                                  "none";
                            }}
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            style={authStyles.passwordButton}
                            aria-label={
                              showPassword
                                  ? "Hide password"
                                  : "Show password"
                            }
                        >
                          {showPassword ? (
                              <EyeOff size={19} />
                          ) : (
                              <Eye size={19} />
                          )}
                        </button>

                      </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                          ...authStyles.submitButton,
                          opacity: loading ? 0.75 : 1,
                          cursor: loading
                              ? "not-allowed"
                              : "pointer"
                        }}
                    >
                      {loading ? (
                          <>
                            <span style={authStyles.spinner} />
                            Signing in...
                          </>
                      ) : (
                          "Sign in"
                      )}
                    </button>

                  </form>
              ) : (
                  <form
                      onSubmit={submitRegister}
                      style={authStyles.form}
                  >

                    <div style={authStyles.fieldGroup}>

                      <label style={authStyles.label}>
                        Full name
                      </label>

                      <input
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) =>
                              setFullName(e.target.value)
                          }
                          minLength="2"
                          maxLength="100"
                          style={authStyles.input}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                                "#172033";
                            e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(23,32,51,0.08)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                                "#d9dee8";
                            e.currentTarget.style.boxShadow =
                                "none";
                          }}
                          required
                      />

                    </div>

                    <div style={authStyles.fieldGroup}>

                      <label style={authStyles.label}>
                        Email address
                      </label>

                      <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) =>
                              setEmail(e.target.value)
                          }
                          style={authStyles.input}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                                "#172033";
                            e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(23,32,51,0.08)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                                "#d9dee8";
                            e.currentTarget.style.boxShadow =
                                "none";
                          }}
                          required
                      />

                    </div>

                    <div style={authStyles.fieldGroup}>

                      <label style={authStyles.label}>
                        Password
                      </label>

                      <div style={authStyles.passwordWrapper}>

                        <input
                            type={
                              showPassword
                                  ? "text"
                                  : "password"
                            }
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            minLength="6"
                            style={{
                              ...authStyles.input,
                              paddingRight: "48px"
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                  "#172033";
                              e.currentTarget.style.boxShadow =
                                  "0 0 0 3px rgba(23,32,51,0.08)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor =
                                  "#d9dee8";
                              e.currentTarget.style.boxShadow =
                                  "none";
                            }}
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            style={authStyles.passwordButton}
                        >
                          {showPassword ? (
                              <EyeOff size={19} />
                          ) : (
                              <Eye size={19} />
                          )}
                        </button>

                      </div>

                      <span style={authStyles.helperText}>
                    Use at least 6 characters.
                  </span>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                          ...authStyles.submitButton,
                          opacity: loading ? 0.75 : 1,
                          cursor: loading
                              ? "not-allowed"
                              : "pointer"
                        }}
                    >
                      {loading ? (
                          <>
                            <span style={authStyles.spinner} />
                            Creating account...
                          </>
                      ) : (
                          "Create account"
                      )}
                    </button>

                  </form>
              )}

              <div style={authStyles.divider}>
                <span />
                <small>OR</small>
                <span />
              </div>

              <div style={authStyles.switchBox}>

              <span style={authStyles.switchText}>
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
              </span>

                <button
                    type="button"
                    onClick={() =>
                        switchMode(
                            isLogin
                                ? "register"
                                : "login"
                        )
                    }
                    style={authStyles.switchButton}
                >
                  {isLogin
                      ? "Create account"
                      : "Sign in"}
                </button>

              </div>

              <div style={authStyles.securityNote}>

                <ShieldCheck size={15} />

                <span>
                Your account is protected with secure
                authentication.
              </span>

              </div>

            </div>

          </div>

        </div>

        <style>{`
        @keyframes fintrackSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .fintrack-auth-container {
            grid-template-columns: 1fr !important;
            max-width: 560px !important;
          }

          .fintrack-brand-panel {
            display: none !important;
          }

          .fintrack-form-panel {
            min-height: auto !important;
          }

          .fintrack-mobile-logo {
            display: flex !important;
          }
        }

        @media (max-width: 600px) {
          .fintrack-auth-page {
            padding: 20px !important;
          }

          .fintrack-auth-container {
            border-radius: 18px !important;
          }

          .fintrack-form-panel {
            padding: 34px 24px !important;
          }
        }
      `}</style>

      </div>
  );
}

/*
 * =========================================================
 * AUTH STYLES
 * =========================================================
 */

const authStyles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    boxSizing: "border-box",
    background:
        "linear-gradient(135deg, #f5f7fb 0%, #eef1f6 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  backgroundGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
        "rgba(23, 32, 51, 0.045)",
    top: "-180px",
    right: "-100px",
    pointerEvents: "none"
  },

  backgroundGlowTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background:
        "rgba(52, 211, 153, 0.045)",
    bottom: "-170px",
    left: "-120px",
    pointerEvents: "none"
  },

  authContainer: {
    width: "100%",
    maxWidth: "1080px",
    minHeight: "650px",
    display: "grid",
    gridTemplateColumns: "46% 54%",
    background: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow:
        "0 24px 70px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(15, 23, 42, 0.06)",
    position: "relative",
    zIndex: 1
  },

  brandPanel: {
    background:
        "linear-gradient(145deg, #111a2d 0%, #172033 55%, #1c2942 100%)",
    color: "#ffffff",
    padding: "46px 44px 34px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "650px",
    boxSizing: "border-box"
  },

  brandTop: {
    display: "flex",
    alignItems: "center",
    gap: "13px"
  },

  logoBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.10)",
    border:
        "1px solid rgba(255,255,255,0.14)",
    boxShadow:
        "0 8px 25px rgba(0,0,0,0.18)"
  },

  brandName: {
    fontSize: "23px",
    fontWeight: 750,
    letterSpacing: "-0.5px"
  },

  brandSubtitle: {
    fontSize: "12px",
    color: "#aab5c8",
    marginTop: "2px"
  },

  brandContent: {
    marginTop: "45px",
    marginBottom: "20px"
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: 750,
    letterSpacing: "2px",
    color: "#9eabc0",
    marginBottom: "16px"
  },

  brandHeading: {
    fontSize: "42px",
    lineHeight: 1.12,
    letterSpacing: "-1.8px",
    margin: 0,
    fontWeight: 760
  },

  brandHeadingAccent: {
    color: "#ffffff"
  },

  brandDescription: {
    color: "#b6c1d3",
    fontSize: "14px",
    lineHeight: 1.75,
    maxWidth: "390px",
    marginTop: "20px",
    marginBottom: "30px"
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px"
  },

  featureIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    color: "#d7deea",
    flexShrink: 0
  },

  featureTitle: {
    display: "block",
    fontSize: "13px",
    color: "#ffffff",
    marginBottom: "3px"
  },

  featureText: {
    display: "block",
    fontSize: "11.5px",
    color: "#9eabc0"
  },

  brandFooter: {
    fontSize: "10.5px",
    color: "#7f8ca3"
  },

  formPanel: {
    padding: "48px 58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    boxSizing: "border-box",
    minHeight: "650px"
  },

  formWrapper: {
    width: "100%",
    maxWidth: "410px"
  },

  mobileLogo: {
    display: "none",
    alignItems: "center",
    gap: "9px",
    marginBottom: "30px"
  },

  mobileLogoBox: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#172033",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  mobileLogoText: {
    fontSize: "20px",
    fontWeight: 750,
    color: "#172033"
  },

  formHeader: {
    marginBottom: "28px"
  },

  formTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "31px",
    lineHeight: 1.2,
    fontWeight: 750,
    letterSpacing: "-1px"
  },

  formSubtitle: {
    margin: "9px 0 0",
    color: "#7a8495",
    fontSize: "13.5px",
    lineHeight: 1.6
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "19px"
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  label: {
    fontSize: "12.5px",
    fontWeight: 650,
    color: "#273246"
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    border: "1px solid #d9dee8",
    borderRadius: "10px",
    padding: "0 14px",
    outline: "none",
    background: "#ffffff",
    color: "#172033",
    fontSize: "13.5px",
    transition:
        "border-color 0.2s ease, box-shadow 0.2s ease"
  },

  passwordWrapper: {
    position: "relative",
    width: "100%"
  },

  passwordButton: {
    position: "absolute",
    right: "4px",
    top: "4px",
    width: "40px",
    height: "40px",
    border: "none",
    background: "transparent",
    color: "#8b95a7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "8px"
  },

  helperText: {
    fontSize: "11px",
    color: "#929baa",
    marginTop: "-2px"
  },

  submitButton: {
    width: "100%",
    height: "49px",
    border: "none",
    borderRadius: "10px",
    background:
        "linear-gradient(135deg, #172033 0%, #202d47 100%)",
    color: "#ffffff",
    fontSize: "13.5px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    marginTop: "4px",
    boxShadow:
        "0 8px 18px rgba(23, 32, 51, 0.18)",
    transition:
        "transform 0.15s ease, box-shadow 0.15s ease"
  },

  spinner: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    border:
        "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#ffffff",
    animation:
        "fintrackSpin 0.7s linear infinite"
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#fff5f5",
    border: "1px solid #ffd9d9",
    color: "#b42318",
    borderRadius: "9px",
    padding: "11px 12px",
    fontSize: "12px",
    marginBottom: "18px"
  },

  errorIcon: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#f04438",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "11px",
    flexShrink: 0
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#f0fdf7",
    border: "1px solid #c9f2df",
    color: "#067647",
    borderRadius: "9px",
    padding: "11px 12px",
    fontSize: "12px",
    marginBottom: "18px"
  },

  successIcon: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#12b76a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "11px",
    flexShrink: 0
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "25px 0 19px"
  },

  dividerSpan: {},

  switchBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "12px"
  },

  switchText: {
    color: "#7b8494"
  },

  switchButton: {
    border: "none",
    background: "transparent",
    color: "#172033",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    padding: "2px"
  },

  securityNote: {
    marginTop: "28px",
    paddingTop: "18px",
    borderTop: "1px solid #edf0f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#9aa3b1",
    fontSize: "10.5px"
  }
};

/*
 * =========================================================
 * STAT CARD
 * =========================================================
 */

function StatCard({
                    title,
                    value,
                    icon,
                    type,
                    raw
                  }) {
  return (
      <div className="stat-card">

        <div
            className={`stat-icon ${type}`}
        >
          {icon}
        </div>

        <div className="stat-content">

        <span>
          {title}
        </span>

          <h2>

            {raw
                ? value
                : `Rs.${Number(
                    value || 0
                ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2
                    }
                )}`}

          </h2>

          <small>

            {type === "income"
                ? "Money received"
                : type === "expense"
                    ? "Money spent"
                    : type === "budget"
                        ? "Planned limit"
                        : "Available funds"}

          </small>

        </div>

      </div>
  );
}

/*
 * =========================================================
 * TRANSACTION TABLE
 * =========================================================
 */

function TransactionTable({
                            transactions,
                            onDelete,
                            showActions = false
                          }) {
  if (!transactions.length) {
    return (
        <div className="empty-state">

          <Receipt size={45} />

          <h3>
            No transactions yet
          </h3>

          <p>
            Add an income or expense to start
            tracking your finances.
          </p>

        </div>
    );
  }

  return (
      <div className="table-wrap">

        <table>

          <thead>

          <tr>

            <th>
              Description
            </th>

            <th>
              Category
            </th>

            <th>
              Date
            </th>

            <th>
              Amount
            </th>

            {showActions && (
                <th>
                  Action
                </th>
            )}

          </tr>

          </thead>

          <tbody>

          {transactions.map((transaction) => {

            const isIncome =
                transaction.type === "INCOME";

            return (
                <tr
                    key={transaction.id}
                >

                  <td>

                    <div className="transaction-name">

                      <div className="transaction-icon">

                        {isIncome ? (
                            <ArrowUpRight size={17} />
                        ) : (
                            <ArrowDownRight size={17} />
                        )}

                      </div>

                      <strong>
                        {transaction.description}
                      </strong>

                    </div>

                  </td>

                  <td>

                  <span className="category-pill">

                    {transaction.category}

                  </span>

                  </td>

                  <td>
                    {transaction.date}
                  </td>

                  <td
                      className={
                        isIncome
                            ? "income-text"
                            : "expense-text"
                      }
                  >

                    {isIncome ? "+" : "-"}Rs.
                    {Number(
                        transaction.amount
                    ).toLocaleString("en-IN")}

                  </td>

                  {showActions && (
                      <td>

                        {!isIncome && (
                            <button
                                className="icon-button danger"
                                onClick={() =>
                                    onDelete(
                                        transaction.original.id
                                    )
                                }
                            >
                              <Trash2 size={16} />
                            </button>
                        )}

                      </td>
                  )}

                </tr>
            );
          })}

          </tbody>

        </table>

      </div>
  );
}

/*
 * =========================================================
 * MODAL
 * =========================================================
 */

function Modal({
                 title,
                 onClose,
                 children
               }) {
  return (
      <div
          className="modal-overlay"
          onMouseDown={onClose}
      >

        <div
            className="modal"
            onMouseDown={(e) =>
                e.stopPropagation()
            }
        >

          <div className="modal-header">

            <h2>
              {title}
            </h2>

            <button
                className="icon-button"
                onClick={onClose}
            >
              <X size={20} />
            </button>

          </div>

          {children}

        </div>

      </div>
  );
}

export default App;