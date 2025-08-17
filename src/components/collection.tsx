import useRating from "../hooks/useRating";
import AddRating from "../components/add-rating";
import Stats from "../components/stats";
import SearchSort from "../components/search-sort";
import Empty from "../components/empty";
import Ratings from "../components/ratings";
import Loading from "../components/loading";

export default function Collection() {
    const {
      getStats,
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
      isFormExpanded,
      setIsFormExpanded
    } = useRating()
    
      const stats = getStats();
    return (
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
              isFormExpanded={isFormExpanded}
              setIsFormExpanded={setIsFormExpanded}
            />
          {/* Right Side - List */}
          <div className={`${isFormExpanded ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all duration-300 ease-in-out`}>

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
            {loading && <Loading loading={loading} />}

            {/* Empty State */}
            <Empty 
              loading={loading}
              filteredAndSortedItems={filteredAndSortedItems}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Rating Cards Grid */}
            {!loading && <Ratings
              filteredAndSortedItems={filteredAndSortedItems}
              handleEdit={handleEdit}
              loading={loading}
              handleDelete={handleDelete}
              isFormExpanded={isFormExpanded}
            />}
          </div>
        </div>
    )
}