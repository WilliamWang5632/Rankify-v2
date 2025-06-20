import useRating from "./hooks/useRating";
import AddRating from "./components/add-rating";
import Stats from "./components/stats";
import SearchSort from "./components/search-sort";
import AlertMessages from "./components/alerts";
import Empty from "./components/empty";
import Ratings from "./components/ratings";
import Loading from "./components/loading";
import Header from "./components/header";

export default function App() {
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
} = useRating()

  const stats = getStats();

  return (
    <div className="min-h-screen w-[100vw] bg-gray-900 text-white">
      <div className="max-w-full mx-auto px-8 py-2">
        {/* Header */}
        <Header/>

        {/* Messages */}
        <AlertMessages error={error} success={success}/>

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
            <Stats stats={stats}/>

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


