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
  Pencil,
  IndianRupee
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

const API = "http://localhost:8080";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(15000);
  const [budgetInput, setBudgetInput] = useState("15000");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const userId = 3;

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
    loadData();
  }, []);

  async function loadData() {
    try {
      const [expenseRes, categoryRes] = await Promise.all([
        fetch(`${API}/api/expenses/user/${userId}`),
        fetch(`${API}/api/categories`)
      ]);

      if (expenseRes.ok) setExpenses(await expenseRes.json());
      if (categoryRes.ok) setCategories(await categoryRes.json());

      try {
        const incomeRes = await fetch(`${API}/api/income/user/${userId}`);
        if (incomeRes.ok) setIncomes(await incomeRes.json());
      } catch {
        setIncomes([]);
      }
    } catch (error) {
      console.error("API connection error:", error);
    }
  }

  async function addExpense(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(expenseForm.amount),
          transactionDate: expenseForm.transactionDate,
          description: expenseForm.description,
          user: { id: userId },
          category: { id: Number(expenseForm.categoryId) }
        })
      });

      if (!response.ok) throw new Error("Failed to add expense");

      setExpenseForm({
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        description: "",
        categoryId: categories[0]?.id || 1,
      });

      setShowExpenseForm(false);
      loadData();
    } catch (error) {
      alert("Could not add expense. Please check the backend.");
      console.error(error);
    }
  }

  async function deleteExpense(id) {
    if (!confirm("Delete this expenseRs.")) return;

    try {
      const response = await fetch(`${API}/api/expenses/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");
      loadData();
    } catch (error) {
      alert("Could not delete expense.");
    }
  }

  async function addIncome(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/api/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(incomeForm.amount),
          transactionDate: incomeForm.transactionDate,
          description: incomeForm.description,
          user: { id: userId }
        })
      });

      if (!response.ok) throw new Error("Failed");

      setIncomeForm({
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        description: ""
      });

      setShowIncomeForm(false);
      loadData();
    } catch (error) {
      alert("Income API is not ready yet.");
    }
  }

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [incomes]
  );

  const balance = totalIncome - totalExpenses;

  const categoryData = useMemo(() => {
    const grouped = {};

    expenses.forEach((expense) => {
      const name = expense.category?.name || "Other";
      grouped[name] = (grouped[name] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value
    }));
  }, [expenses]);

  const monthlyData = [
    { month: "Apr", income: 12000, expense: 7200 },
    { month: "May", income: 15000, expense: 8400 },
    { month: "Jun", income: 13000, expense: 9100 },
    { month: "Jul", income: 18000, expense: 10200 },
    { month: "Aug", income: 16000, expense: 8700 },
    {
      month: "Sep",
      income: totalIncome || 14500,
      expense: totalExpenses || 250
    }
  ];

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Expenses", icon: Receipt },
    { name: "Income", icon: Wallet },
    { name: "Budget", icon: PiggyBank },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
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
          <p className="nav-label">MAIN MENU</p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
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
            <div className="avatar">P</div>
            <div>
              <strong>Prajan</strong>
              <span>Personal Account</span>
            </div>
          </div>

          <button className="logout">
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
            <p className="welcome-small">Good afternoon</p>
            <h1>{activePage}</h1>
          </div>

          <div className="top-actions">
            <button
              className="secondary-button"
              onClick={() => setShowIncomeForm(true)}
            >
              <Plus size={17} />
              Add Income
            </button>
            <button
              className="primary-button"
              onClick={() => setShowExpenseForm(true)}
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
                <span className="hero-label">FINANCIAL OVERVIEW</span>
                <h2>Take control of your money.</h2>
                <p>
                  Track your spending, monitor your budget and understand
                  where your money goes.
                </p>
              </div>
              <div className="hero-decoration">
                <TrendingUp size={90} strokeWidth={1} />
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
                value={15000}
                icon={<PiggyBank />}
                type="budget"
              />
            </section>

            <section className="dashboard-grid">
              <div className="panel chart-panel">
                <div className="panel-header">
                  <div>
                    <h3>Income vs Expenses</h3>
                    <p>Monthly financial activity</p>
                  </div>
                  <select>
                    <option>Last 6 months</option>
                    <option>This year</option>
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" name="Income" radius={[5, 5, 0, 0]} />
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
                    <h3>Spending by Category</h3>
                    <p>Where your money goes</p>
                  </div>
                </div>

                {categoryData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={210}>
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
                          {categoryData.map((_, index) => (
                            <Cell key={index} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="category-list">
                      {categoryData.map((item) => (
                        <div className="category-row" key={item.name}>
                          <span>{item.name}</span>
                          <strong>Rs.{item.value.toLocaleString("en-IN")}</strong>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-chart">
                    <BarChart3 size={38} />
                    <p>No spending data yet</p>
                  </div>
                )}
              </div>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Transactions</h3>
                  <p>Your latest financial activity</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setActivePage("Expenses")}
                >
                  View all
                </button>
              </div>

              <TransactionTable
                expenses={expenses}
                onDelete={deleteExpense}
              />
            </section>
          </>
        )}

        {activePage === "Expenses" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <h2>Expenses</h2>
                <p>Manage and track all your expenses.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setShowExpenseForm(true)}
              >
                <Plus size={17} /> Add Expense
              </button>
            </div>

            <div className="panel">
              <TransactionTable
                expenses={expenses}
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
                <h2>Income</h2>
                <p>Track your income sources.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setShowIncomeForm(true)}
              >
                <Plus size={17} /> Add Income
              </button>
            </div>

            <div className="panel">
              {incomes.length === 0 ? (
                <div className="empty-state">
                  <Wallet size={45} />
                  <h3>No income records yet</h3>
                  <p>Add your first income transaction.</p>
                </div>
              ) : (
                incomes.map((income) => (
                  <div className="simple-row" key={income.id}>
                    <div>
                      <strong>{income.description || "Income"}</strong>
                      <span>{income.transactionDate}</span>
                    </div>
                    <strong className="income-text">
                      +Rs.{Number(income.amount).toLocaleString("en-IN")}
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
                <h2>Monthly Budget</h2>
                <p>Keep your spending within your planned limit.</p>
              </div>
            </div>

            <div className="budget-card">
              <div className="budget-top">
                <div>
                  <span>SEPTEMBER 2026</span>
                  <h2>Rs.15,000</h2>
                  <p>Monthly spending limit</p>
                </div>
                <PiggyBank size={55} />
              </div>

              <div className="progress-track">
                <div
                  className="progress-value"
                  style={{
                    width: `${Math.min((totalExpenses / 15000) * 100, 100)}%`
                  }}
                />
              </div>

              <div className="budget-footer">
                <span>Rs.{totalExpenses.toLocaleString("en-IN")} spent</span>
                <strong>
                  Rs.{Math.max(15000 - totalExpenses, 0).toLocaleString("en-IN")}{" "}
                  remaining
                </strong>
              </div>
            </div>
          </section>
        )}

        {activePage === "Reports" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <h2>Financial Reports</h2>
                <p>Understand your financial performance.</p>
              </div>
            </div>

            <div className="stats-grid">
              <StatCard title="Total Income" value={totalIncome} type="income" />
              <StatCard
                title="Total Expenses"
                value={totalExpenses}
                type="expense"
              />
              <StatCard title="Balance" value={balance} type="balance" />
              <StatCard
                title="Transactions"
                value={expenses.length + incomes.length}
                raw
                type="budget"
              />
            </div>

            <div className="panel report-summary">
              <h3>Financial Summary</h3>
              <div className="summary-line">
                <span>Total income</span>
                <strong>Rs.{totalIncome.toLocaleString("en-IN")}</strong>
              </div>
              <div className="summary-line">
                <span>Total expenses</span>
                <strong>Rs.{totalExpenses.toLocaleString("en-IN")}</strong>
              </div>
              <div className="summary-line">
                <span>Net balance</span>
                <strong>Rs.{balance.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </section>
        )}

        {activePage === "Settings" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <h2>Settings</h2>
                <p>Manage your account preferences.</p>
              </div>
            </div>

            <div className="panel settings-panel">
              <div className="profile-large">
                <div className="avatar large">P</div>
                <div>
                  <h3>Prajan</h3>
                  <p>test@example.com</p>
                </div>
              </div>

              <div className="setting-item">
                <span>Account Type</span>
                <strong>Personal Account</strong>
              </div>
              <div className="setting-item">
                <span>Currency</span>
                <strong>Indian Rupee (Rs.)</strong>
              </div>
              <div className="setting-item">
                <span>Theme</span>
                <strong>Light</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      {showExpenseForm && (
        <Modal title="Add Expense" onClose={() => setShowExpenseForm(false)}>
          <form onSubmit={addExpense}>
            <label>Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Rs. 0.00"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
              required
            />

            <label>Date</label>
            <input
              type="date"
              value={expenseForm.transactionDate}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  transactionDate: e.target.value
                })
              }
              required
            />

            <label>Category</label>
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
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="1">Food</option>
              )}
            </select>

            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Lunch"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  description: e.target.value
                })
              }
              required
            />

            <button className="primary-button full-width" type="submit">
              Add Expense
            </button>
          </form>
        </Modal>
      )}

      {showIncomeForm && (
        <Modal title="Add Income" onClose={() => setShowIncomeForm(false)}>
          <form onSubmit={addIncome}>
            <label>Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Rs. 0.00"
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, amount: e.target.value })
              }
              required
            />

            <label>Date</label>
            <input
              type="date"
              value={incomeForm.transactionDate}
              onChange={(e) =>
                setIncomeForm({
                  ...incomeForm,
                  transactionDate: e.target.value
                })
              }
              required
            />

            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Salary"
              value={incomeForm.description}
              onChange={(e) =>
                setIncomeForm({
                  ...incomeForm,
                  description: e.target.value
                })
              }
              required
            />

            <button className="primary-button full-width" type="submit">
              Add Income
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, type, raw }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-content">
        <span>{title}</span>
        <h2>
          {raw
            ? value
            : `Rs.${Number(value || 0).toLocaleString("en-IN", {
                maximumFractionDigits: 2
              })}`}
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

function TransactionTable({ expenses, onDelete, showActions = false }) {
  if (!expenses.length) {
    return (
      <div className="empty-state">
        <Receipt size={45} />
        <h3>No expenses yet</h3>
        <p>Add an expense to start tracking your spending.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="transaction-name">
                  <div className="transaction-icon">
                    <ArrowDownRight size={17} />
                  </div>
                  <strong>{expense.description || "Expense"}</strong>
                </div>
              </td>
              <td>
                <span className="category-pill">
                  {expense.category?.name || "Other"}
                </span>
              </td>
              <td>{expense.transactionDate}</td>
              <td className="expense-text">
                Rs.{Number(expense.amount).toLocaleString("en-IN")}
              </td>
              {showActions && (
                <td>
                  <button
                    className="icon-button danger"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default App;






