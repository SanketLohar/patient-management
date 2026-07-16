import { Modal, Typography } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { Text } = Typography;

export default function ConfirmDeleteModal({
  open,
  onConfirm,
  onCancel,
  title = "Delete Record",
  itemName = "this item",
  loading = false,
}) {
  return (
    <Modal
      title={
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <ExclamationCircleFilled style={{ color: "#ef4444", fontSize: "20px" }} />
          <span style={{ fontWeight: 700, color: "#0f172a" }}>{title}</span>
        </div>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Delete"
      okButtonProps={{ 
        danger: true, 
        style: { 
          borderRadius: "8px", 
          fontWeight: "600",
          height: "38px" 
        } 
      }}
      cancelButtonProps={{ 
        style: { 
          borderRadius: "8px", 
          fontWeight: "600",
          height: "38px" 
        } 
      }}
    >
      <div style={{ padding: "16px 0 8px 0" }}>
        <Text style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.6", display: "block" }}>
          Are you sure you want to delete <Text strong style={{ color: "#0f172a" }}>{itemName}</Text>? This action will permanently remove the record and cannot be undone.
        </Text>
      </div>
    </Modal>
  );
}

