import { Row, Col, Input, Select, Button } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function NurseFilters({
  searchText,
  setSearchText,
  deptVal,
  onDeptChange,
  statusVal,
  onStatusChange,
  onReset,
}) {
  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Psychology",
    "Radiology",
    "General Medicine",
  ];

  const availabilities = [
    "On Duty",
    "Off Duty",
    "With Patient",
    "Break",
    "Emergency Response",
  ];

  return (
    <div
      style={{
        padding: "18px 24px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
        marginBottom: "16px",
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Search */}
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by nurse name or email..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            style={{ borderRadius: "8px" }}
          />
        </Col>

        {/* Department Filter */}
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filter by Department"
            style={{ width: "100%" }}
            value={deptVal || undefined}
            onChange={onDeptChange}
            allowClear
            size="large"
          >
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Availability Filter */}
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filter by Status"
            style={{ width: "100%" }}
            value={statusVal || undefined}
            onChange={onStatusChange}
            allowClear
            size="large"
          >
            {availabilities.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Reset */}
        <Col xs={24} md={4} style={{ textAlign: "right" }}>
          <Button
            onClick={onReset}
            icon={<UndoOutlined />}
            size="large"
            style={{ borderRadius: "8px", width: "100%" }}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>
    </div>
  );
}

