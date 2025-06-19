import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Alert, AlertDescription } from "./components/ui/alert";
import { renderStars } from "./components/stars";
import useRating from "./hooks/useRating";
import AddRating from "./components/add-rating";

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

  /* ------------------------------------------------------------------
     JSX
  -------------------------------------------------------------------*/
  return (
    <div className="min-h-screen w-[100vw] bg-gray-900 text-white">
      <div className="max-w-full mx-auto px-8 py-2">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white mb-2">
            Rankify
          </h1>
          {/* <p className="text-gray-400">Create, manage, and organize your ratings</p> */}
        </div>

        {/* Messages */}
        {error && (
          <Alert className="mb-6 border-[#d62d2d]">
            <AlertDescription className="text-[#d62d2d]">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-600 bg-green-900/20">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

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
            <Card className="mb-3 bg-gray-800 border-gray-700">
              <CardContent className="p-2">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Search ratings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="rating">Highest Rating</option>
                      <option value="rating-low">Lowest Rating</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-3">
              <Card className="text-center p-2 bg-gray-800 border-gray-700">
                <div className="text-2xl font-bold text-indigo-400">{stats.totalRatings}</div>
                <div className="text-sm text-gray-400">Total Ratings</div>
              </Card>
              <Card className="text-center p-2 bg-gray-800 border-gray-700">
                <div className="text-2xl font-bold text-green-400">
                  {stats.meanRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Mean Rating</div>
              </Card>
              <Card className="text-center p-2 bg-gray-800 border-gray-700">
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.medianRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Median Rating</div>
              </Card>
              <Card className="text-center p-2 bg-gray-800 border-gray-700">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.highestRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Highest Rating</div>
              </Card>
              <Card className="text-center p-2 bg-gray-800 border-gray-700">
                <div className="text-2xl font-bold text-orange-400">
                  {stats.lowestRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Lowest Rating</div>
              </Card>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredAndSortedItems.length === 0 && (
              <Card className="text-center py-12 bg-gray-800 border-gray-700">
                <CardContent>
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {searchTerm ? "No ratings found" : "No ratings yet"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {searchTerm ? "Try adjusting your search term" : "Add your first rating to get started!"}
                  </p>
                  {searchTerm && (
                    <Button 
                      onClick={() => setSearchTerm("")} 
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Rating Cards Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">
              {filteredAndSortedItems.map((item) => (
                <Card key={item.id} className="group hover:bg-gray-750 transition-colors duration-200 bg-gray-800 border-gray-700">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.picture}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1489599953329-c414b2b12d83?w=400&h=300&fit=crop&t=${item.id}`;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur rounded px-2 py-1">
                        <span className="text-white text-sm font-bold">{item.rating}/10</span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-bold mb-2 text-white line-clamp-2 h-10">{item.name}</h3>
                      
                        
                      <div className="mb-3">
                        {renderStars(item.rating)}
                      </div>
                      {/* <p className="text-gray-400 text-xs flex-1 line-clamp-3 mb-4">
                        {item.review}
                      </p> */}

                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm" 
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-[#d62d2d] hover:bg-[#a61e1e] text-white"
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


