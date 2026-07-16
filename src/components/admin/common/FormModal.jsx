import { Modal, Button, Spin } from "antd";

/**
 * FormModal
 *
 * forceRender={true} keeps the modal's DOM (and the <Form> inside it) mounted
 * even when closed. This is the CORRECT fix for the "useForm instance not
 * connected" warning — the Form element is always in the tree, so the form
 * instance created by Form.useForm() in the parent is always connected.
 */
export default function FormModal({
  title,
  open,
  onClose,
  onSubmit,
  loading = false,
  width = 750,
  children,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  showSubmit = true,
  showCancel = true,
}) {
  return (
    <Modal
      title={<span style={{ fontWeight: 800, color: "#0f172a", fontSize: "18px", letterSpacing: "-0.02em" }}>{title}</span>}
      open={open}
      onCancel={onClose}
      width={typeof width === "number" ? Math.min(width, window.innerWidth - 32) : width}
      centered
      mask={{ closable: false }}
      forceRender
      wrapClassName="saas-modal-wrap"
      footer={[
        showCancel && (
          <Button key="cancel" className="saas-btn-secondary" onClick={onClose} disabled={loading} style={{ height: "40px", borderRadius: "10px", fontWeight: "600" }}>
            {cancelLabel}
          </Button>
        ),
        showSubmit && (
          <Button key="submit" className="saas-btn-primary" type="primary" onClick={onSubmit} loading={loading} style={{ height: "40px", borderRadius: "10px", fontWeight: "700" }}>
            {submitLabel}
          </Button>
        )
      ].filter(Boolean)}
    >
      <div className="no-scrollbar" style={{ padding: "20px 0 10px 0", maxHeight: "70vh", overflowY: "auto" }}>
        <Spin spinning={loading}>
          {children}
        </Spin>
      </div>
    </Modal>
  );
}
