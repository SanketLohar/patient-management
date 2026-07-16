import { Drawer, Button, Space, Spin } from "antd";

export default function FormDrawer({
  title,
  open,
  onClose,
  onSubmit,
  loading = false,
  width = 600,
  children,
}) {
  return (
    <Drawer
      title={<span style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>{title}</span>}
      size="large"
      onClose={onClose}
      open={open}
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        <Space>
          <Button className="saas-btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="saas-btn-primary"
            type="primary"
            onClick={onSubmit}
            loading={loading}
          >
            Save Changes
          </Button>
        </Space>
      }
      footer={
        <div style={{ textAlign: "right", padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
          <Space>
            <Button className="saas-btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="saas-btn-primary"
              type="primary"
              onClick={onSubmit}
              loading={loading}
            >
              Save Changes
            </Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading} tip="Saving records...">
        {children}
      </Spin>
    </Drawer>
  );
}

