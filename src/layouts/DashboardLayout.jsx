import { Layout, Menu, Button, Avatar, Space, Input, Badge, Drawer } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, limit, writeBatch, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useFirestoreCollection } from "../hooks/useFirestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import logoImg from "../assets/hospital_logo_1.png";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Auth state comes from context — no local Firebase listener ───────────
  const { user, role } = useAuth();
  const userEmail = user?.email || "";

  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Omni-search collections
  const { data: allPatients } = useFirestoreCollection("patients");
  const { data: allDoctors } = useFirestoreCollection("doctorProfiles");
  const { data: allNurses } = useFirestoreCollection("nurseProfiles");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [notifications, setNotifications] = useState([]);

  // Fetch real-time notifications
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(data);
    });
    return () => unsubscribe();
  }, []);

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "emergency": return "🔴";
      case "checkIn": return "🟢";
      case "appointment": return "🔵";
      case "system":
      default: return "📅";
    }
  };
  
  const getNotifStyle = (type, read) => {
    if (read) return { bg: "transparent", color: "#334155" };
    switch (type) {
      case "emergency": return { bg: "#fef2f2", color: "#dc2626" }; // Soft red
      case "checkIn": return { bg: "#f0fdf4", color: "#16a34a" }; // Soft green
      case "appointment": return { bg: "#eff6ff", color: "#2563eb" }; // Medical blue
      case "system":
      default: return { bg: "#f8fafc", color: "#475569" }; // Subtle gray
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, "notifications", n.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Fallback local update if no permission
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // --- Omni-Search Filter Logic ---
  let filteredPatients = [];
  let filteredDoctors = [];
  let filteredNurses = [];

  if (globalSearch.trim() !== "") {
    const q = globalSearch.toLowerCase();
    filteredPatients = (allPatients || []).filter(p => (p.fullName || p.name || "").toLowerCase().includes(q));
    filteredDoctors = (allDoctors || []).filter(d => (d.fullName || "").toLowerCase().includes(q) || (d.specialization || d.department || "").toLowerCase().includes(q));
    filteredNurses = (allNurses || []).filter(n => (n.fullName || "").toLowerCase().includes(q));
  }

  const totalSearchResults = filteredPatients.length + filteredDoctors.length + filteredNurses.length;
  
  const handleSearchResultClick = (path) => {
    setGlobalSearch("");
    setSearchOpen(false);
    navigate(path);
  };

  // Define sidebar menu items based on role
  const getMenuItems = () => {
    if (role === "Admin") {
      return [
        { key: "/dashboard/admin", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/dashboard/admin/doctors", icon: <UserOutlined />, label: "Doctors" },
        { key: "/dashboard/admin/nurses", icon: <TeamOutlined />, label: "Nurses" },
        { key: "/dashboard/admin/patients", icon: <HeartOutlined />, label: "Patients" },
        { key: "/dashboard/admin/appointments", icon: <CalendarOutlined />, label: "Appointments" },
        { key: "/dashboard/admin/follow-ups", icon: <PhoneOutlined />, label: "Follow-Ups" },
        { key: "/dashboard/admin/departments", icon: <AppstoreOutlined />, label: "Departments" },
        { key: "/dashboard/admin/reports", icon: <BarChartOutlined />, label: "Clinical Reports" },
        { key: "/dashboard/admin/settings", icon: <SettingOutlined />, label: "Settings" },
      ];
    } else if (role === "Nurse") {
      return [
        { key: "/dashboard/nurse", icon: <TeamOutlined />, label: "Nurse Portal" },
        { key: "/dashboard/nurse/follow-ups", icon: <PhoneOutlined />, label: "Follow-Ups" }
      ];
    } else {
      return [
        { key: "/dashboard/doctor", icon: <UserOutlined />, label: "Doctor Portal" },
        { key: "/dashboard/doctor/follow-ups", icon: <PhoneOutlined />, label: "Follow-Ups" }
      ];
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/admin/doctors")) return "/dashboard/admin/doctors";
    if (path.startsWith("/dashboard/admin/nurses")) return "/dashboard/admin/nurses";
    if (path.startsWith("/dashboard/admin/follow-ups")) return "/dashboard/admin/follow-ups";
    if (path.startsWith("/dashboard/nurse/follow-ups")) return "/dashboard/nurse/follow-ups";
    if (path.startsWith("/dashboard/doctor/follow-ups")) return "/dashboard/doctor/follow-ups";
    return path;
  };

  const displayUser = userEmail ? userEmail.split("@")[0] : "Staff";
  const displayRole = role || "Staff Member";

  return (
    <Layout style={{ minHeight: "100vh" }} className="saas-layout">
      {/* Top Blocker Mask to prevent content scrolling bleed-through */}
      <div className="saas-top-mask" />

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          size="default"
          closable={false}
          styles={{ body: { padding: 0 } }}
          className="saas-drawer"
        >
          <div style={{ height: "100%", background: "#0f172a", display: "flex", flexDirection: "column" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              padding: "16px", 
              borderBottom: "1px solid rgba(255,255,255,0.1)", 
              height: "64px",
              overflow: "hidden"
            }}>
              <img 
                src={logoImg} 
                alt="Moolatvam Ayurved Logo" 
                className="saas-logo"
                style={{ 
                  height: "36px", 
                  width: "auto", 
                  borderRadius: "6px",
                  flexShrink: 0,
                  objectFit: "contain"
                }} 
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#ffffff", fontSize: "14.5px", fontWeight: "800", letterSpacing: "-0.02em" }}>Moolatvam Ayurved</span>
                <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {role === "Admin" ? "ERP Admin" : role === "Nurse" ? "Nurse Station" : "Doctor Cabin"}
                </span>
              </div>
            </div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              onClick={({ key }) => {
                navigate(key);
                setDrawerOpen(false);
              }}
              items={getMenuItems()}
              className="saas-menu"
              style={{ flex: 1, border: "none" }}
            />
          </div>
        </Drawer>
      )}

      {/* Premium Floating Glass Collapsible Sider */}
      {!isMobile && (
        <Sider
          breakpoint="lg"
          collapsedWidth="80"
          width={240}
          collapsible
          collapsed={collapsed}
          trigger={null}
          theme="light"
          className="saas-sider"
          style={{
            position: "sticky",
            top: "24px",
            height: "calc(100vh - 48px)",
            zIndex: 100,
            margin: "24px 0 24px 24px",
            borderRadius: "24px",
            border: "none",
            overflow: "hidden",
          }}
        >
          {/* Hospital Branding Header */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: collapsed ? "center" : "flex-start", 
            gap: "12px", 
            padding: "16px", 
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)", 
            height: "64px",
            overflow: "hidden"
          }}>
            <img 
              src={logoImg} 
              alt="Moolatvam Ayurved Logo" 
              className="saas-logo"
              style={{ 
                height: "36px", 
                width: "auto", 
                flexShrink: 0,
                borderRadius: "6px",
                objectFit: "contain"
              }} 
            />
            {!collapsed && (
              <div style={{ display: "flex", flexDirection: "column", whiteSpace: "nowrap" }}>
                <span style={{ color: "#ffffff", fontSize: "14.5px", fontWeight: "800", letterSpacing: "-0.02em" }}>Moolatvam Ayurved</span>
                <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {role === "Admin" ? "ERP Admin" : role === "Nurse" ? "Nurse Station" : "Doctor Cabin"}
                </span>
              </div>
            )}
          </div>
   
          {/* Menu Navigation */}
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={({ key }) => navigate(key)}
            items={getMenuItems()}
            className="saas-menu"
          />
        </Sider>
      )}
 
      <Layout style={{ background: "transparent" }}>
        {/* Redesigned Premium Top Header */}
        <Header className="saas-header" style={{ padding: isMobile ? "0 12px" : "0 24px", position: "sticky", top: isMobile ? "12px" : "24px", zIndex: 99 }}>
          <Space size={isMobile ? "small" : "middle"}>
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={() => {
                if (isMobile) {
                  setDrawerOpen(true);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: "16px",
                width: 40,
                height: 40,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569"
              }}
            />
            {/* Search Input Box */}
            <div ref={searchRef} style={{ position: "relative" }}>
              <Input
                prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                placeholder={isMobile ? "Search..." : "Search patients, doctors..."}
                className="saas-search-input"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => {
                  if (globalSearch.trim() !== "") setSearchOpen(true);
                }}
                style={{
                  borderRadius: "8px",
                  height: "38px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(8px)",
                  width: isMobile ? "120px" : "280px"
                }}
              />
              
              {/* Omni-Search Dropdown Overlay */}
              {searchOpen && globalSearch.trim() !== "" && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "8px",
                  width: "360px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "14px",
                  boxShadow: "0 10px 40px rgba(15, 23, 42, 0.12)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  zIndex: 1000,
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "12px",
                }}>
                  {totalSearchResults === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: "#94a3b8", fontSize: "13px" }}>
                      No matches found for "{globalSearch}"
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      
                      {filteredPatients.length > 0 && (
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "8px" }}>Patients</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {filteredPatients.map(p => (
                              <div key={p.id} onClick={() => handleSearchResultClick(`/dashboard/admin/patients`)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }} />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{p.fullName || p.name}</span>
                                  <span style={{ fontSize: "11px", color: "#64748b" }}>Patient ({p.age ? `${p.age} Yrs` : "N/A"})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredDoctors.length > 0 && (
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "8px" }}>Staff Doctors</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {filteredDoctors.map(d => (
                              <div key={d.uid} onClick={() => handleSearchResultClick(`/dashboard/admin/doctors`)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <Avatar size={32} icon={<HeartOutlined />} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }} />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{d.fullName}</span>
                                  <span style={{ fontSize: "11px", color: "#64748b" }}>{d.specialization || d.department || "Medical Officer"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredNurses.length > 0 && (
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "8px" }}>Nursing Care</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {filteredNurses.map(n => (
                              <div key={n.uid} onClick={() => handleSearchResultClick(`/dashboard/admin/nurses`)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <Avatar size={32} icon={<MedicineBoxOutlined />} style={{ backgroundColor: "#f0fdf4", color: "#22c55e" }} />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{n.fullName}</span>
                                  <span style={{ fontSize: "11px", color: "#64748b" }}>{n.department || "General Ward"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  )}
                </div>
              )}
            </div>
          </Space>

          {/* Right Header Panel Actions */}
          <Space size="large">
            {/* Notification Icon */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <Badge dot={notifications.some(n => !n.read)} color="#ef4444" offset={[-2, 4]}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: "18px", color: "#475569" }} />}
                  onClick={() => setNotifOpen(!notifOpen)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                />
              </Badge>
              {notifOpen && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "12px",
                  width: "320px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
                  border: "1px solid #f1f5f9",
                  zIndex: 1000,
                  padding: "16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                    <span style={{ fontWeight: "800", fontSize: "14.5px", color: "#0f172a" }}>Notifications</span>
                    <span 
                      style={{ fontSize: "11px", color: "#0284c7", cursor: "pointer", fontWeight: "700" }} 
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                    {notifications.length === 0 && <div style={{ textAlign: "center", color: "#94a3b8", padding: "10px 0", fontSize: 12 }}>No new notifications</div>}
                    {notifications.map(n => {
                      const styleInfo = getNotifStyle(n.type, n.read);
                      return (
                        <div 
                          key={n.id} 
                          onClick={async () => {
                            try {
                              if (!n.read) await updateDoc(doc(db, "notifications", n.id), { read: true });
                            } catch (e) {
                              setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                            }
                          }}
                          style={{ 
                            display: "flex", 
                            gap: "10px", 
                            padding: "10px", 
                            borderRadius: "10px", 
                            backgroundColor: styleInfo.bg, 
                            transition: "background 0.2s",
                            cursor: "pointer"
                          }}
                        >
                          <div style={{ fontSize: "16px", flexShrink: 0 }}>{getNotifIcon(n.type)}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "12px", color: styleInfo.color, fontWeight: n.read ? "500" : "700", lineHeight: 1.3 }}>{n.title || n.text}</span>
                            <span style={{ fontSize: "10px", color: "#94a3b8" }}>{timeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
 
            {/* Profile Avatar Card */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar 
                src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${displayUser}`}
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.6)", 
                  border: "1.5px solid #0284c7",
                  width: "36px",
                  height: "36px"
                }} 
              />
              {!isMobile && (
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a", textTransform: "capitalize" }}>
                    {displayUser}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "500", color: "#64748b" }}>
                    {displayRole}
                  </span>
                </div>
              )}
            </div>
 
            {/* Logout Button */}
            <Button 
              className="saas-btn-secondary"
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ height: "38px", background: "rgba(255, 255, 255, 0.5)", border: "1px solid rgba(255, 255, 255, 0.4)" }}
            >
              {!isMobile && "Logout"}
            </Button>
          </Space>
        </Header>
 
        {/* Content Wrapper with Animating View Transitions */}
        <Content style={{ margin: isMobile ? "12px" : "24px", padding: 0, minHeight: 280, background: "transparent" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <div style={{ 
                background: "transparent", 
                padding: "0px", 
                borderRadius: "0px",
                border: "none",
                boxShadow: "none"
              }}>
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}

