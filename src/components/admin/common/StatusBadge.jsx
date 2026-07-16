export default function StatusBadge({ status }) {
  const getBadgeStyle = (val) => {
    switch (val) {
      case "Available":
      case "Active":
      case "On Duty":
        return {
          bg: "#f0fdf4",
          border: "#bbf7d0",
          text: "#15803d",
          dotColor: "#22c55e",
          pulse: false,
        };
      case "In Consultation":
      case "With Patient":
        return {
          bg: "#eff6ff",
          border: "#bfdbfe",
          text: "#1d4ed8",
          dotColor: "#3b82f6",
          pulse: true,
        };
      case "On Leave":
      case "Break":
        return {
          bg: "#fffbeb",
          border: "#fde68a",
          text: "#b45309",
          dotColor: "#f59e0b",
          pulse: false,
        };
      case "Emergency Call":
      case "Emergency Response":
      case "Emergency":
        return {
          bg: "#fef2f2",
          border: "#fecaca",
          text: "#b91c1c",
          dotColor: "#ef4444",
          pulse: true,
        };
      default:
        return {
          bg: "#f8fafc",
          border: "#e2e8f0",
          text: "#475569",
          dotColor: "#64748b",
          pulse: false,
        };
    }
  };

  const config = getBadgeStyle(status);

  return (
    <span
      className="saas-pulse-badge"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "50px",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "0.01em"
      }}
    >
      <span
        className="saas-pulse-dot"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: config.dotColor,
          display: "inline-block"
        }}
      />
      {status || "Unknown"}
      
      {!config.pulse && (
        <style dangerouslySetInnerHTML={{ __html: `
          .saas-pulse-dot::after {
            animation: none !important;
          }
        `}} />
      )}
    </span>
  );
}

