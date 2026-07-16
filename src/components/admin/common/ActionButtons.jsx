import { Button, Space, Tooltip, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  status,
  loading = false,
}) {
  const isInactive = status === "Off Duty" || status === "Inactive";

  const getBtnStyle = (color, hoverColor, bgHover) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: color,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    fontSize: "14px",
    padding: 0
  });

  return (
    <Space size="middle">
      {onView && (
        <Tooltip title="View Profile">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={onView}
            className="saas-action-btn"
            style={getBtnStyle("#64748b", "#0284c7")}
          />
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip title="Edit Details">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onEdit}
            className="saas-action-btn"
            style={getBtnStyle("#64748b", "#f59e0b")}
          />
        </Tooltip>
      )}

      {onToggleStatus && (
        <Tooltip title={isInactive ? "Activate Duty" : "Deactivate Duty"}>
          <Button
            type="text"
            icon={<PoweroffOutlined />}
            onClick={onToggleStatus}
            className="saas-action-btn"
            style={getBtnStyle(isInactive ? "#10b981" : "#ef4444")}
          />
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip title="Delete Record">
          <Popconfirm
            title="Delete record?"
            description="Are you sure? This cannot be undone."
            onConfirm={onDelete}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true, loading }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="saas-action-btn-danger"
              style={getBtnStyle("#ef4444")}
            />
          </Popconfirm>
        </Tooltip>
      )}

      <style>{`
        .saas-action-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
          color: #0284c7 !important;
          transform: translateY(-1px);
        }
        .saas-action-btn-danger:hover {
          background-color: #fef2f2 !important;
          border-color: #fee2e2 !important;
          color: #ef4444 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </Space>
  );
}

