import { useState, useEffect } from "react";
import { reportsApi, partsApi, notificationsApi } from "../../services/api";

export default function AdminDashboard({ onNavigate }) {
  const [financial, setFinancial] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportsApi.financial("monthly").catch(err => {
        console.error("Financial report failed:", err);
        return null;
      }),
      partsApi.getLowStock().catch(err => {
        console.error("Low stock failed:", err);
        return [];
      }),
      notificationsApi.getAll().catch(err => {
        console.error("Notifications failed:", err);
        return [];
      }),
    ]).then(([fin, ls, notifs]) => {
      setFinancial(fin);
      setLowStock(ls || []);
      setNotifications((notifs || []).filter(n => !n.isRead));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const fmt = (n) => `NPR ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="page-subtitle">Overview of this month's performance</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="label">Total Revenue</div>
          <div className="value">{fmt(financial?.totalRevenue)}</div>
          <div className="sub">{financial?.totalSales} sales this month</div>
        </div>
        <div className="stat-card red">
          <div className="label">Total Purchases</div>
          <div className="value">{fmt(financial?.totalPurchases)}</div>
          <div className="sub">{financial?.totalPurchaseOrders} purchase orders</div>
        </div>
        <div className="stat-card blue">
          <div className="label">Gross Profit</div>
          <div className="value">{fmt(financial?.grossProfit)}</div>
          <div className="sub">Revenue - Purchases</div>
        </div>
        <div className="stat-card accent">
          <div className="label">Low Stock Alerts</div>
          <div className="value">{lowStock.length}</div>
          <div className="sub">Parts below reorder level</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Low Stock Parts */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div className="card-title" style={{ margin: 0 }}>⚠ Low Stock Parts</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("parts")}>View All</button>
          </div>
          {lowStock.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>All parts are well-stocked.</p>
          ) : lowStock.slice(0, 5).map(p => (
            <div key={p.partId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.sku}</div>
              </div>
              <span className="badge badge-red">{p.stockQuantity} left</span>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div className="card-title" style={{ margin: 0 }}>🔔 Notifications</div>
            <span className="badge badge-red">{notifications.length} unread</span>
          </div>
          {notifications.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No new notifications.</p>
          ) : notifications.slice(0, 5).map(n => (
            <div key={n.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{n.message}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{new Date(n.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
