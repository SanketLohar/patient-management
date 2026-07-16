import { useEffect, useState } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { Form, message, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import PageHeader from "../../../components/admin/common/PageHeader";
import FormModal from "../../../components/admin/common/FormModal";
import NurseFilters from "./NurseFilters";
import NurseTable from "./NurseTable";
import NurseForm from "./NurseForm";
import NurseProfile from "./NurseProfile";

import { useFirestoreCollection } from "../../../hooks/useFirestore";
import {
  registerNurseAuth,
  createNurseProfile,
  updateNurseProfile,
  deleteNurseProfile,
} from "../../../services/nurseService";

export default function NurseList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Firestore real-time collection of nurse profiles
  const { data: rawNurses, loading } = useFirestoreCollection("nurseProfiles");

  // Filtering states
  const [searchText, setSearchText] = useState("");
  const [deptVal, setDeptVal] = useState("");
  const [statusVal, setStatusVal] = useState("");

  // Sub-routing states parsed from the active location pathname
  const [activeDrawer, setActiveDrawer] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedNurseId, setSelectedNurseId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync route path to local Drawer states
  useEffect(() => {
    const path = location.pathname;

    const matchNew = matchPath("/dashboard/admin/nurses/new", path);
    const matchEdit = matchPath("/dashboard/admin/nurses/:id/edit", path);
    const matchView = matchPath("/dashboard/admin/nurses/:id", path);

    if (matchNew) {
      setActiveDrawer("add");
      setSelectedNurseId(null);
      form.resetFields();
    } else if (matchEdit) {
      setActiveDrawer("edit");
      const nurseId = matchEdit.params.id;
      setSelectedNurseId(nurseId);
      
      const nurseToEdit = rawNurses.find((n) => n.uid === nurseId);
      if (nurseToEdit) {
        form.setFieldsValue(nurseToEdit);
      }
    } else if (matchView) {
      setActiveDrawer("view");
      setSelectedNurseId(matchView.params.id);
    } else {
      setActiveDrawer(null);
      setSelectedNurseId(null);
    }
  }, [location.pathname, rawNurses, form]);

  // Handle setting edit form fields after nurses load if edit route is entered directly
  useEffect(() => {
    if (activeDrawer === "edit" && selectedNurseId && rawNurses.length > 0) {
      const nurseToEdit = rawNurses.find((n) => n.uid === selectedNurseId);
      if (nurseToEdit) {
        form.setFieldsValue(nurseToEdit);
      }
    }
  }, [activeDrawer, selectedNurseId, rawNurses, form]);

  const handleResetFilters = () => {
    setSearchText("");
    setDeptVal("");
    setStatusVal("");
  };

  // Perform client side search and filter
  const filteredNurses = rawNurses.filter((nurse) => {
    if (nurse.isDeleted === true) return false;

    const matchesSearch =
      !searchText ||
      (nurse.fullName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (nurse.email || "").toLowerCase().includes(searchText.toLowerCase());

    const matchesDept = !deptVal || nurse.department === deptVal;
    const matchesStatus = !statusVal || nurse.availability === statusVal;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // CRUD operation: Create or Update Nurse
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields().catch(err => {
        console.error("VALIDATION ERROR:", JSON.stringify(err));
        throw err;
      });
      setActionLoading(true);

      if (activeDrawer === "add") {
        // Register authentication
        const authRes = await registerNurseAuth(values.email, values.password);
        if (!authRes.success) {
          message.error(`Auth Registration failed: ${authRes.error}`);
          setActionLoading(false);
          return;
        }

        // Create profile document
        const profileRes = await createNurseProfile(authRes.uid, values.email, {
          fullName: values.fullName,
          phone: values.phone,
          department: values.department,
          workingShift: values.workingShift || "Morning",
          weeklyOff: values.weeklyOff || "Sunday",
          availability: values.availability || "On Duty",
          biography: values.biography || "",
          email: values.email,
        });

        if (profileRes.success) {
          message.success("Nurse Registered successfully");
          navigate("/dashboard/admin/nurses");
        } else {
          message.error(`Profile Creation failed: ${profileRes.error}`);
        }
      } else if (activeDrawer === "edit") {
        // Update profile document
        const res = await updateNurseProfile(selectedNurseId, {
          fullName: values.fullName,
          phone: values.phone,
          department: values.department,
          workingShift: values.workingShift || "Morning",
          weeklyOff: values.weeklyOff || "Sunday",
          availability: values.availability || "On Duty",
          biography: values.biography || "",
        });

        if (res.success) {
          message.success("Nurse details updated");
          navigate("/dashboard/admin/nurses");
        } else {
          message.error(`Update failed: ${res.error}`);
        }
      }
    } catch (err) {
      console.error("Form validation failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD operation: Delete Nurse (Soft Delete)
  const handleDeleteNurse = async (uid) => {
    setActionLoading(true);
    const res = await deleteNurseProfile(uid);
    setActionLoading(false);
    if (res.success) {
      message.success("Nurse deleted successfully");
    } else {
      message.error(`Delete failed: ${res.error}`);
    }
  };

  // CRUD operation: Toggle Status (Activate / Deactivate Duty)
  const handleToggleStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === "Off Duty" ? "On Duty" : "Off Duty";
    const res = await updateNurseProfile(uid, { availability: nextStatus });
    if (res.success) {
      message.success(`Status set to ${nextStatus}`);
    } else {
      message.error(`Failed to change status: ${res.error}`);
    }
  };

  const selectedNurse = rawNurses.find((n) => n.uid === selectedNurseId);

  return (
    <div>
      {/* Page Title Banner */}
      <PageHeader
        title="Nursing Staff Registry"
        subtitle="Manage hospital nurse care units, shifts, weekly offs, and duty status."
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard/admin" },
          { title: "Nurses" },
        ]}
        action={{
          label: "Register New Nurse",
          icon: <PlusOutlined />,
          onClick: () => navigate("/dashboard/admin/nurses/new"),
        }}
      />

      {/* Roster Filters */}
      <NurseFilters
        searchText={searchText}
        setSearchText={setSearchText}
        deptVal={deptVal}
        onDeptChange={setDeptVal}
        statusVal={statusVal}
        onStatusChange={setStatusVal}
        onReset={handleResetFilters}
      />

      {/* Listing Board */}
      <Card
        variant="borderless"
        style={{
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
        }}
      >
        <NurseTable
          dataSource={filteredNurses}
          loading={loading}
          onView={(uid) => navigate(`/dashboard/admin/nurses/${uid}`)}
          onEdit={(uid) => navigate(`/dashboard/admin/nurses/${uid}/edit`)}
          onDelete={handleDeleteNurse}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* Modal Overlay for Add / Edit */}
      <FormModal
        title={activeDrawer === "add" ? "Register Nurse Staff" : "Edit Nurse Coordinates"}
        open={activeDrawer === "add" || activeDrawer === "edit"}
        onClose={() => navigate("/dashboard/admin/nurses")}
        onSubmit={handleSubmitForm}
        loading={actionLoading}
        width={750}
      >
        <NurseForm form={form} isEdit={activeDrawer === "edit"} />
      </FormModal>

      {/* Modal Overlay for View Profile */}
      <FormModal
        title="Nurse Professional Profile"
        open={activeDrawer === "view"}
        onClose={() => navigate("/dashboard/admin/nurses")}
        showSubmit={false}
        showCancel={true}
        cancelLabel="Close"
        loading={actionLoading}
        width={700}
      >
        <NurseProfile nurse={selectedNurse} />
      </FormModal>
    </div>
  );
}
