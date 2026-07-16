import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, matchPath } from "react-router-dom";
import { Form, message, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import PageHeader from "../../../components/admin/common/PageHeader";
import FormModal from "../../../components/admin/common/FormModal";
import DoctorFilters from "./DoctorFilters";
import DoctorTable from "./DoctorTable";
import DoctorForm from "./DoctorForm";
import DoctorProfile from "./DoctorProfile";

import { useFirestoreCollection } from "../../../hooks/useFirestore";
import {
  registerDoctorAuth,
  createDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
} from "../../../services/doctorService";

export default function DoctorList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Firestore real-time collection of doctor profiles
  const { data: rawDoctors, loading } = useFirestoreCollection("doctorProfiles");

  // Filtering states
  const [searchVal, setSearchVal] = useState("");
  const [deptVal, setDeptVal] = useState("");
  const [statusVal, setStatusVal] = useState("");

  // Sub-routing states parsed from the active location pathname
  const [activeDrawer, setActiveDrawer] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync route path to local Drawer states
  useEffect(() => {
    const path = location.pathname;

    const matchNew = matchPath("/dashboard/admin/doctors/new", path);
    const matchEdit = matchPath("/dashboard/admin/doctors/:id/edit", path);
    const matchView = matchPath("/dashboard/admin/doctors/:id", path);

    if (matchNew) {
      setActiveDrawer("add");
      setSelectedDocId(null);
      form.resetFields();
    } else if (matchEdit) {
      setActiveDrawer("edit");
      const docId = matchEdit.params.id;
      setSelectedDocId(docId);
      
      const docToEdit = rawDoctors.find((d) => d.uid === docId);
      if (docToEdit) {
        form.setFieldsValue(docToEdit);
      }
    } else if (matchView) {
      setActiveDrawer("view");
      setSelectedDocId(matchView.params.id);
    } else {
      setActiveDrawer(null);
      setSelectedDocId(null);
    }
  }, [location.pathname, rawDoctors, form]);

  // Handle setting edit form fields after doctors load if edit route is entered directly
  useEffect(() => {
    if (activeDrawer === "edit" && selectedDocId && rawDoctors.length > 0) {
      const docToEdit = rawDoctors.find((d) => d.uid === selectedDocId);
      if (docToEdit) {
        form.setFieldsValue(docToEdit);
      }
    }
  }, [activeDrawer, selectedDocId, rawDoctors, form]);

  const handleResetFilters = () => {
    setSearchVal("");
    setDeptVal("");
    setStatusVal("");
  };

  // Perform client side search and filter
  const filteredDoctors = rawDoctors.filter((doc) => {
    if (doc.isDeleted === true) return false;

    const matchesSearch =
      !searchVal ||
      (doc.fullName || "").toLowerCase().includes(searchVal.toLowerCase()) ||
      (doc.email || "").toLowerCase().includes(searchVal.toLowerCase());

    const matchesDept = !deptVal || doc.department === deptVal;
    const matchesStatus = !statusVal || doc.availability === statusVal;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // CRUD operation: Create or Update Doctor
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields().catch(err => {
        console.error("VALIDATION ERROR:", JSON.stringify(err));
        throw err;
      });
      setActionLoading(true);

      if (activeDrawer === "add") {
        // Register authentication
        const authRes = await registerDoctorAuth(values.email, values.password);
        if (!authRes.success) {
          message.error(`Auth Registration failed: ${authRes.error}`);
          setActionLoading(false);
          return;
        }

        // Create profile document
        const profileRes = await createDoctorProfile(authRes.uid, values.email, {
          fullName: values.fullName,
          phone: values.phone,
          department: values.department,
          specialization: values.specialization,
          qualification: values.qualification,
          experience: values.experience,
          roomNumber: values.roomNumber || "",
          workingShift: values.workingShift || "Morning",
          weeklyOff: values.weeklyOff || "Sunday",
          consultationTimings: values.consultationTimings || "",
          availability: values.availability || "Available",
          languages: values.languages || "",
          biography: values.biography || "",
          email: values.email,
        });

        if (profileRes.success) {
          message.success("Doctor Registered successfully");
          navigate("/dashboard/admin/doctors");
        } else {
          message.error(`Profile Creation failed: ${profileRes.error}`);
        }
      } else if (activeDrawer === "edit") {
        // Update profile document
        const res = await updateDoctorProfile(selectedDocId, {
          fullName: values.fullName,
          phone: values.phone,
          department: values.department,
          specialization: values.specialization,
          qualification: values.qualification,
          experience: values.experience,
          roomNumber: values.roomNumber || "",
          workingShift: values.workingShift || "Morning",
          weeklyOff: values.weeklyOff || "Sunday",
          consultationTimings: values.consultationTimings || "",
          availability: values.availability || "Available",
          languages: values.languages || "",
          biography: values.biography || "",
        });

        if (res.success) {
          message.success("Doctor details updated");
          navigate("/dashboard/admin/doctors");
        } else {
          message.error(`Update failed: ${res.error}`);
        }
      }
    } catch (err) {
      console.log('Validate Failed:', err);
      console.error("Form validation failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD operation: Delete Doctor
  const handleDeleteDoctor = async (uid) => {
    setActionLoading(true);
    const res = await deleteDoctorProfile(uid);
    setActionLoading(false);
    if (res.success) {
      message.success("Doctor deleted successfully");
    } else {
      message.error(`Delete failed: ${res.error}`);
    }
  };

  // CRUD operation: Toggle Status (Activate / Deactivate Duty)
  const handleToggleStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === "Off Duty" ? "Available" : "Off Duty";
    const res = await updateDoctorProfile(uid, { availability: nextStatus });
    if (res.success) {
      message.success(`Status set to ${nextStatus}`);
    } else {
      message.error(`Failed to change status: ${res.error}`);
    }
  };

  const selectedDoc = rawDoctors.find((d) => d.uid === selectedDocId);

  return (
    <div>
      {/* Page Title & Breadcrumbs Banner */}
      <PageHeader
        title="Doctor Specialist Catalog"
        subtitle="Manage hospital consultants, shifts, availability, and clinical coordinates."
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard/admin" },
          { title: "Doctors" },
        ]}
        action={{
          label: "Register New Doctor",
          icon: <PlusOutlined />,
          onClick: () => navigate("/dashboard/admin/doctors/new"),
        }}
      />

      {/* Roster Filters */}
      <DoctorFilters
        searchVal={searchVal}
        onSearchChange={setSearchVal}
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
        <DoctorTable
          dataSource={filteredDoctors}
          loading={loading}
          onView={(uid) => navigate(`/dashboard/admin/doctors/${uid}`)}
          onEdit={(uid) => navigate(`/dashboard/admin/doctors/${uid}/edit`)}
          onDelete={handleDeleteDoctor}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* Modal Overlay for Add / Edit */}
      <FormModal
        title={activeDrawer === "add" ? "Register Doctor Specialist" : "Edit Doctor Credentials"}
        open={activeDrawer === "add" || activeDrawer === "edit"}
        onClose={() => navigate("/dashboard/admin/doctors")}
        onSubmit={handleSubmitForm}
        loading={actionLoading}
        width={750}
      >
        <DoctorForm form={form} isEdit={activeDrawer === "edit"} />
      </FormModal>

      {/* Modal Overlay for View Profile */}
      <FormModal
        title="Consultant Professional Profile"
        open={activeDrawer === "view"}
        onClose={() => navigate("/dashboard/admin/doctors")}
        showSubmit={false}
        cancelLabel="Close"
        loading={actionLoading}
        width={700}
      >
        <DoctorProfile doctor={selectedDoc} />
      </FormModal>
    </div>
  );
}

