import React, { useState } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { LoginModal } from "./components/modals/LoginModal";
import { DeviceFormModal } from "./components/modals/DeviceFormModal";
import { DeviceDetailModal } from "./components/modals/DeviceDetailModal";
import { DeleteDeviceModal } from "./components/modals/DeleteDeviceModal";
import { QrModal } from "./components/modals/QrModal";
import { PrintCertificateModal } from "./components/modals/PrintCertificateModal";

// Vistas
import { DashboardView } from "./views/DashboardView";
import { InventoryView } from "./views/InventoryView";
import { BatchesView } from "./views/BatchesView";
import { DiagnosisView } from "./views/DiagnosisView";
import { LogisticsView } from "./views/LogisticsView";
import { CustodyView } from "./views/CustodyView";
import { ReportsView } from "./views/ReportsView";
import { QrScannerView } from "./views/QrScannerView";
import { TestsView } from "./views/TestsView";
import { ProfileView } from "./views/ProfileView";

export const App = () => {
  const [activeView, setActiveView] = useState("dashboard");

  // Estados para modales
  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [deviceForQr, setDeviceForQr] = useState(null);

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [deviceForCert, setDeviceForCert] = useState(null);

  // Handlers para abrir modales
  const handleOpenNewDevice = () => {
    setDeviceToEdit(null);
    setIsDeviceFormOpen(true);
  };

  const handleOpenEditDevice = (device) => {
    setDeviceToEdit(device);
    setIsDeviceFormOpen(true);
  };

  const handleOpenDetail = (device) => {
    setSelectedDevice(device);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (device) => {
    setDeviceToDelete(device);
    setIsDeleteOpen(true);
  };

  const handleOpenQr = (device) => {
    setDeviceForQr(device);
    setIsQrModalOpen(true);
  };

  const handleOpenCertificate = (device) => {
    setDeviceForCert(device);
    setIsCertificateOpen(true);
  };

  const handleFilterBatchFromBatches = (batchCode) => {
    setActiveView("inventory");
  };

  return (
    <div className="app-root">
      <Header onNavigateToProfile={() => setActiveView("profile")} />

      <div className="app-layout">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="main-content">
          {activeView === "dashboard" && (
            <DashboardView
              onNavigateToView={setActiveView}
              onOpenNewDeviceModal={handleOpenNewDevice}
            />
          )}

          {activeView === "inventory" && (
            <InventoryView
              onOpenNewModal={handleOpenNewDevice}
              onOpenEditModal={handleOpenEditDevice}
              onOpenDetailModal={handleOpenDetail}
              onOpenDeleteModal={handleOpenDelete}
              onOpenQrModal={handleOpenQr}
            />
          )}

          {activeView === "batches" && (
            <BatchesView onSelectBatchToFilter={handleFilterBatchFromBatches} />
          )}

          {activeView === "diagnosis" && (
            <DiagnosisView />
          )}

          {activeView === "logistics" && (
            <LogisticsView />
          )}

          {activeView === "custody" && (
            <CustodyView onOpenCertificate={handleOpenCertificate} />
          )}

          {activeView === "reports" && (
            <ReportsView />
          )}

          {activeView === "qr" && (
            <QrScannerView
              onOpenDetailModal={handleOpenDetail}
              onOpenCertificateModal={handleOpenCertificate}
            />
          )}

          {activeView === "tests" && (
            <TestsView />
          )}

          {activeView === "profile" && (
            <ProfileView />
          )}
        </main>
      </div>

      {/* Modales Globales */}
      <LoginModal />

      <DeviceFormModal
        isOpen={isDeviceFormOpen}
        onClose={() => setIsDeviceFormOpen(false)}
        deviceToEdit={deviceToEdit}
      />

      <DeviceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        device={selectedDevice}
        onOpenCertificate={handleOpenCertificate}
        onOpenQr={handleOpenQr}
      />

      <DeleteDeviceModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        device={deviceToDelete}
      />

      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        device={deviceForQr}
      />

      <PrintCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        device={deviceForCert}
      />
    </div>
  );
};
