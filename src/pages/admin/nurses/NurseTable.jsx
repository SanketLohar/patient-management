import { Tag, Space } from "antd";
import DataTable from "../../../components/admin/common/DataTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import ActionButtons from "../../../components/admin/common/ActionButtons";

export default function NurseTable({
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
      title: "Nurse Name",
      dataIndex: "fullName",
      key: "fullName",
      width: "14%",
      align: "left",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
      render: (text) => <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{text}</span>,
    },
    {
      title: "Assigned Department",
      dataIndex: "department",
      key: "department",
      width: "14%",
      align: "left",
      render: (text) => (
        <Tag color={getDeptColor(text)} style={{ margin: 0 }}>
          {text || "General Ward"}
        </Tag>
      ),
    },
    {
      title: "Shift / Off Day",
      key: "shift",
      width: "16%",
      align: "left",
      render: (_, record) => (
        <Space size="middle">
          <span>{record.workingShift || "Morning"}</span>
          <Tag color="volcano">{record.weeklyOff || "Sunday"}</Tag>
        </Space>
      ),
    },
    {
      title: "Contact Phone",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      align: "left",
    },
    {
      title: "Check-In Time",
      key: "lastCheckIn",
      width: "11%",
      align: "center",
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
      width: "11%",
      align: "center",
      render: (_, record) => {
        if (!record.lastCheckOut) return <span style={{ color: "#94a3b8" }}>--</span>;
        const date = record.lastCheckOut.toDate ? record.lastCheckOut.toDate() : new Date(record.lastCheckOut);
        const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        return <span style={{ fontWeight: 600, color: "#dc2626" }}>{timeStr}</span>;
      }
    },
    {
      title: "Availability Status",
      dataIndex: "availability",
      key: "availability",
      width: "12%",
      align: "center",
      render: (val) => <StatusBadge status={val || "On Duty"} type="tag" />,
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      align: "center",
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
      emptyText="No nursing staff records matched"
      size="middle"
    />
  );
}

