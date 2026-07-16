import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, Modal, Input, Typography, message, Avatar } from "antd";
import { PhoneOutlined, MessageOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../admin/common/DataTable";

const { Text } = Typography;
const { TextArea } = Input;

export default function FollowUpRegistry() {
  const { user, role } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [nurseRemark, setNurseRemark] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // We listen to completedReports where followUpDate is present.
    // Since followUpDate might be stored as string or not exist, we just fetch all and filter client side.
    const q = query(collection(db, "completedReports"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter for valid follow up dates
      const followUps = data.filter(r => r.followUpDate && r.followUpDate.trim() !== "" && r.followUpDate !== "None");
      setReports(followUps);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load follow-ups", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleOpenRemarkModal = (report) => {
    setSelectedReport(report);
    setNurseRemark(report.followUpRemark || "");
    setRemarkModalOpen(true);
  };

  const handleSaveRemark = async () => {
    if (!selectedReport) return;
    if (!nurseRemark.trim()) {
      message.error("Please enter a remark.");
      return;
    }

    setSaving(true);
    try {
      const nurseName = user?.email?.split("@")[0] || "Nurse";
      const reportRef = doc(db, "completedReports", selectedReport.id);
      
      await updateDoc(reportRef, {
        followUpRemark: nurseRemark,
        remarkAuthor: nurseName,
        remarkUpdatedAt: serverTimestamp()
      });

      // Dispatch Notification
      await addDoc(collection(db, "notifications"), {
        title: `Follow-up remark added for ${selectedReport.patientName || "Patient"} by Nurse ${nurseName}`,
        type: "system",
        createdAt: serverTimestamp(),
        read: false
      });

      message.success("Follow-up remark saved successfully!");
      setRemarkModalOpen(false);
      setNurseRemark("");
    } catch (err) {
      console.error(err);
      message.error("Failed to save remark.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }} />
          <Text strong style={{ color: "#0f172a" }}>{text}</Text>
        </Space>
      )
    },
    {
      title: "Follow-Up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      render: (date) => <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{date}</Tag>
    },
    {
      title: "Assigning Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text) => <Text style={{ color: "#475569" }}>Dr. {text}</Text>
    },
    {
      title: "Latest Remarks",
      key: "remarks",
      render: (_, record) => {
        if (record.followUpRemark) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Text style={{ fontSize: "12px", color: "#334155", fontStyle: "italic" }}>"{record.followUpRemark}"</Text>
              <Text style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600 }}>— Logged by {record.remarkAuthor}</Text>
            </div>
          );
        }
        return <Text type="secondary" style={{ fontSize: "12px" }}>No remarks logged.</Text>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {role === "Nurse" ? (
            <Button 
              type="primary" 
              ghost 
              icon={<PhoneOutlined />} 
              onClick={() => handleOpenRemarkModal(record)}
              style={{ borderRadius: 8, fontSize: "12px" }}
            >
              Log Call/Action
            </Button>
          ) : (
            record.followUpRemark ? (
              <Tag icon={<CheckCircleOutlined />} color="success">Action Taken</Tag>
            ) : (
              <Tag color="default">Pending Action</Tag>
            )
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <DataTable 
        columns={columns}
        dataSource={reports}
        loading={loading}
        rowKey="id"
        emptyText="No pending follow-ups found."
      />

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageOutlined style={{ color: "#0284c7" }} />
            <span>Log Follow-Up Action</span>
          </div>
        }
        open={remarkModalOpen}
        onCancel={() => setRemarkModalOpen(false)}
        onOk={handleSaveRemark}
        confirmLoading={saving}
        okText="Save Remark"
        okButtonProps={{ style: { borderRadius: 8, fontWeight: 600, background: "#0284c7" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
      >
        <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Text type="secondary">
            Enter your call notes or action remarks for <strong style={{ color: "#0f172a" }}>{selectedReport?.patientName}</strong>'s follow-up. 
            This will be visible to the assigning doctor and administration.
          </Text>
          <TextArea
            rows={4}
            value={nurseRemark}
            onChange={(e) => setNurseRemark(e.target.value)}
            placeholder="e.g. Called patient, they are feeling better and will visit next week."
            style={{ borderRadius: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
}
