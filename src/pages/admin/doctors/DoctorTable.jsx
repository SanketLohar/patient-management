import { Tag, Space } from "antd";
import DataTable from "../../../components/admin/common/DataTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import ActionButtons from "../../../components/admin/common/ActionButtons";

export default function DoctorTable({
  dataSource,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const getDeptColor = (dept) => {
    const mapping = {
      Cardiology: "red",
      Neurology: "purple",
      Orthopedics: "green",
      Psychology: "orange",
      Radiology: "cyan",
      "General Medicine": "blue",
    };
    return mapping[dept] || "blue";
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{text}</span>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{record.qualification || "MD"}</div>
        </div>
      ),
    },
    {
      title: "Department / Specialization",
      key: "dept",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={getDeptColor(record.department)} style={{ margin: 0 }}>
            {record.department || "General Medicine"}
          </Tag>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            {record.specialization || "General Practice"}
          </span>
        </Space>
      ),
    },
    {
      title: "Room",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div style={{ fontSize: "13px" }}>
          <div>{record.phone || "-"}</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{record.email || "-"}</div>
        </div>
      ),
    },
    {
      title: "Check-In Time",
      key: "lastCheckIn",
      render: (_, record) => {
        if (!record.lastCheckIn) return <span style={{ color: "#94a3b8" }}>--</span>;
        const date = record.lastCheckIn.toDate ? record.lastCheckIn.toDate() : new Date(record.lastCheckIn);
        const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        return <span style={{ fontWeight: 600, color: "#16a34a" }}>{timeStr}</span>;
      }
    },
    {
      title: "Check-Out Time",
      key: "lastCheckOut",
      render: (_, record) => {
        if (!record.lastCheckOut) return <span style={{ color: "#94a3b8" }}>--</span>;
        const date = record.lastCheckOut.toDate ? record.lastCheckOut.toDate() : new Date(record.lastCheckOut);
        const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        return <span style={{ fontWeight: 600, color: "#dc2626" }}>{timeStr}</span>;
      }
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (val) => <StatusBadge status={val || "Available"} type="tag" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionButtons
          onView={() => onView(record.uid)}
          onEdit={() => onEdit(record.uid)}
          onDelete={() => onDelete(record.uid)}
          onToggleStatus={() => onToggleStatus(record.uid, record.availability)}
          status={record.availability}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      emptyText="No medical consultant profiles matched"
    />
  );
}

