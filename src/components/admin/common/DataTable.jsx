import { Table } from "antd";

export default function DataTable({
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  pagination = {},
  emptyText = "No records found",
  ...props
}) {
  return (
    <Table
      className="saas-table"
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
        style: { marginTop: "16px" },
        ...pagination,
      }}
      locale={{
        emptyText: (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px", filter: "opacity(0.7)" }}>📂</div>
            <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: "600", margin: "0 0 4px 0" }}>
              {emptyText}
            </h3>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              There are currently no items available to display here.
            </p>
          </div>
        ),
      }}
      {...props}
    />
  );
}

