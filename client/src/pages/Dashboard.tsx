import { useState, useCallback } from 'react';
import { useFolders, useFolderProducts, useFolderCosts } from '../hooks/useData';
import { AppHeader } from '../components/AppHeader';
import { TabNav } from '../components/TabNav';
import { FoldersTab } from '../components/tabs/FoldersTab';
import { OperationTab } from '../components/tabs/OperationTab';
import { ProductsTab } from '../components/tabs/ProductsTab';
import { CostsTab } from '../components/tabs/CostsTab';
import { SummaryTab } from '../components/tabs/SummaryTab';
import { CatalogTab } from '../components/tabs/CatalogTab';
import { ReportsTab } from '../components/tabs/ReportsTab';
import { TimelineTab } from '../components/tabs/TimelineTab';
import { PrintTab } from '../components/tabs/PrintTab';
import { UsersTab } from '../components/tabs/UsersTab';
import { ProfileTab } from '../components/tabs/ProfileTab';
import { Button } from '../components/ui';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('folders');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const { folders, refresh: refreshFolders } = useFolders();
  const { products: allProducts } = useFolderProducts(null);
  const { costs: allCosts } = useFolderCosts(null);

  const activeFolder = folders.find(f => f.id === activeFolderId);

  const handleTabChange = useCallback((tab: string) => {
    if (hasUnsaved && tab !== activeTab) {
      setPendingTab(tab);
    } else {
      setActiveTab(tab);
      setHasUnsaved(false);
    }
  }, [hasUnsaved, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeFolderId={activeFolderId} />
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} hasUnsaved={hasUnsaved} />

      {pendingTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPendingTab(null)} />
          <div className="relative z-50 w-full max-w-md rounded-2xl glass card-elevated p-7 animate-in-scale">
            <h3 className="text-lg font-bold tracking-tight">¿Descartar cambios sin guardar?</h3>
            <p className="mt-3 text-[15px] text-foreground/75">Hay cambios sin guardar. Si continúas se perderán.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPendingTab(null)}>Cancelar</Button>
              <Button variant="destructive"
                onClick={() => {
                  setActiveTab(pendingTab);
                  setHasUnsaved(false);
                  setPendingTab(null);
                }}>Continuar</Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-5 py-8">
        {activeTab === 'folders' && (
          <FoldersTab
            activeFolderId={activeFolderId}
            onSelectFolder={setActiveFolderId}
            onRefresh={refreshFolders}
          />
        )}
        {activeTab === 'operation' && (
          <OperationTab folder={activeFolder || null} onUpdate={() => { refreshFolders(); setHasUnsaved(false); }} />
        )}
        {activeTab === 'products' && (
          <ProductsTab folder={activeFolder || null} onUpdate={() => { refreshFolders(); setHasUnsaved(false); }} />
        )}
        {activeTab === 'costs' && (
          <CostsTab folder={activeFolder || null} onUpdate={() => { refreshFolders(); setHasUnsaved(false); }} />
        )}
        {activeTab === 'summary' && (
          <SummaryTab folder={activeFolder || null} onUpdate={() => { refreshFolders(); setHasUnsaved(false); }} />
        )}
        {activeTab === 'catalog' && <CatalogTab />}
        {activeTab === 'reports' && <ReportsTab folders={folders} allProducts={allProducts} allCosts={allCosts} />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'print' && <PrintTab activeFolderId={activeFolderId} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>
    </div>
  );
}
