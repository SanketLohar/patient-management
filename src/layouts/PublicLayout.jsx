import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/common/Footer";

const { Content } = Layout;

export default function PublicLayout() {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "transparent", backgroundColor: "transparent" }}>
      <Navbar />
      <Content style={{ flex: "1 0 auto" }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}

