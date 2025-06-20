import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { X, Plus } from "lucide-react";
import useRating from "./hooks/useRating";
import AddRating from "./components/add-rating";
import Stats from "./components/stats";
import SearchSort from "./components/search-sort";
import AlertMessages from "./components/alerts";
import Empty from "./components/empty";
import Ratings from "./components/ratings";
import Loading from "./components/loading";
import Header from "./components/header";

// Tab interface
interface Tab {
  id: string;
  name: string;
  isEditing?: boolean;
}

export default function App() {
  // Tab management state
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'tab-1', name: 'tab-1' }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [newTabName, setNewTabName] = useState('');

  // Get the hook for the active tab
  const {
    getStats,
    error,
    success,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loading,
    filteredAndSortedItems,
    handleEdit,
    handleDelete,
    editing,
    form,
    handleChange,
    fileInputRef,
    handleImageUpload,
    setForm,
    handleSubmit,
    blank,
    setEditing,
    clearMessages,
  } = useRating(activeTabId);

  const stats = getStats();

  // Tab management functions
const addTab = () => {
  // Check if we've reached the maximum number of tabs
  if (tabs.length >= 10) {
    return;
  }

  // Find the lowest available tab number (1-10)
  const existingTabNumbers = new Set(
    tabs.map(tab => {
      const match = tab.id.match(/^tab-(\d+)$/);
      return match ? parseInt(match[1], 10) : null;
    }).filter(num => num !== null)
  );
  
  // Find the lowest available number from 1 to 10
  let nextTabNumber = 1;
  while (nextTabNumber <= 10 && existingTabNumbers.has(nextTabNumber)) {
    nextTabNumber++;
  }
  
  // If we can't find an available number, something is wrong
  if (nextTabNumber > 10) {
    return;
  }
  
  const name = newTabName.trim() || `Tab ${nextTabNumber}`;
  const newTabId = `tab-${nextTabNumber}`;
  
  const newTab: Tab = {
    id: newTabId,
    name: name
  };
  
  setTabs([...tabs, newTab]);
  setActiveTabId(newTab.id);
  setNewTabName('');
};

  const removeTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Don't allow removing the last tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If we're removing the active tab, switch to the first remaining tab
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const startEditingTab = (tabId: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, isEditing: true }
        : { ...tab, isEditing: false }
    ));
  };

  const finishEditingTab = (tabId: string, newName: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, name: newName.trim() || tab.name, isEditing: false }
        : { ...tab, isEditing: false }
    ));
  };

  const handleTabKeyPress = (e: React.KeyboardEvent, tabId: string, newName: string) => {
    if (e.key === 'Enter') {
      finishEditingTab(tabId, newName);
    } else if (e.key === 'Escape') {
      setTabs(tabs.map(tab => ({ ...tab, isEditing: false })));
    }
  };

  return (
    <div className="min-h-screen w-[100vw] bg-gray-900 text-white">
      <div className="max-w-full mx-auto px-8 py-2">
        {/* Header */}
        <Header />

        {/* Tab Bar */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-8 py-2 rounded-t-lg border-b-2 transition-colors group ${
                    activeTabId === tab.id
                      ? 'bg-gray-800 border-indigo-400 text-white'
                      : 'bg-gray-700 border-transparent text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.isEditing ? (
                    <Input
                      value={tab.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setTabs(tabs.map(t => 
                          t.id === tab.id ? { ...t, name: newName } : t
                        ));
                      }}
                      onBlur={() => finishEditingTab(tab.id, tab.name)}
                      onKeyDown={(e) => handleTabKeyPress(e, tab.id, tab.name)}
                      className="bg-transparent border-none p-0 h-auto text-sm min-w-0 w-20"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="cursor-pointer select-none"
                      onClick={() => setActiveTabId(tab.id)}
                      onDoubleClick={() => startEditingTab(tab.id)}
                      title={`${tab.name} (${tab.id})`} // Show both name and ID on hover
                    >
                      {tab.name}
                    </span>
                  )}
                  
                  {tabs.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTab(tab.id)}
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add New Tab */}
            <div className="flex items-center gap-2">
              <Input
                placeholder={tabs.length >= 10 ? "Max tabs reached" : "Tab name"}
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && tabs.length < 10 && addTab()}
                disabled={tabs.length >= 10}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-8 text-sm w-32 disabled:opacity-50"
              />
              <Button
                onClick={addTab}
                size="sm"
                disabled={tabs.length >= 10}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 w-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title={tabs.length >= 10 ? "Maximum 10 tabs allowed" : "Add new tab"}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <AlertMessages error={error} success={success} />

        {/* Main Layout: Form Left, List Right */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Side - Form */}
          <AddRating
            loading={loading}
            editing={editing}
            form={form}
            handleChange={handleChange}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            setForm={setForm}
            handleSubmit={handleSubmit}
            blank={blank}
            setEditing={setEditing}
            clearMessages={clearMessages}
          />
          
          {/* Right Side - List */}
          <div className="lg:col-span-4">
            {/* Search and Sort Controls */}
            <SearchSort
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Stats */}
            <Stats stats={stats} />

            {/* Loading State */}
            <Loading loading={loading} />

            {/* Empty State */}
            <Empty
              loading={loading}
              filteredAndSortedItems={filteredAndSortedItems}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Rating Cards Grid */}
            <Ratings
              filteredAndSortedItems={filteredAndSortedItems}
              handleEdit={handleEdit}
              loading={loading}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}