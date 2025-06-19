import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";

import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Alert, AlertDescription } from "./components/ui/alert";

/** One rating entry */
interface Rating {
  id: string;
  name: string;
  picture: string;
  rating: number; // 0–10 with decimals
  review: string;
  createdAt?: string;
}

export default function App() {
  const API_URL = "http://localhost:8080/ratings";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blank: Rating = {
    id: "",
    name: "",
    picture: "",
    rating: 5,
    review: "",
  };

  const [items, setItems] = useState<Rating[]>([]);
  const [form, setForm] = useState<Rating>(blank);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "name-desc" | "rating" | "rating-low" | "newest" | "oldest">("newest");

  /* ------------------------------------------------------------------
     Utility functions
  -------------------------------------------------------------------*/
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Calculate statistics
  const getStats = () => {
    if (items.length === 0) {
      return {
        totalRatings: 0,
        meanRating: 0,
        medianRating: 0,
        highestRating: 0,
        lowestRating: 0
      };
    }

    const ratings = items.map(item => item.rating);
    const totalRatings = items.length;
    const meanRating = ratings.reduce((sum, rating) => sum + rating, 0) / totalRatings;
    
    // Calculate median
    const sortedRatings = [...ratings].sort((a, b) => a - b);
    const medianRating = sortedRatings.length % 2 === 0
      ? (sortedRatings[sortedRatings.length / 2 - 1] + sortedRatings[sortedRatings.length / 2]) / 2
      : sortedRatings[Math.floor(sortedRatings.length / 2)];
    
    const highestRating = Math.max(...ratings);
    const lowestRating = Math.min(...ratings);

    return {
      totalRatings,
      meanRating,
      medianRating,
      highestRating,
      lowestRating
    };
  };

  /* ------------------------------------------------------------------
     Data access helpers
  -------------------------------------------------------------------*/
  const fetchAll = async () => {
    try {
      setLoading(true);
      clearMessages();
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      showError("Failed to fetch ratings from server");
      console.error("Fetch error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const createRating = async (rating: Omit<Rating, 'id'>) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...rating,
        createdAt: new Date().toISOString().split('T')[0]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const updateRating = async (id: string, rating: Partial<Rating>) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rating),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const deleteRating = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  /* ------------------------------------------------------------------
     Filtering and sorting
  -------------------------------------------------------------------*/
  const filteredAndSortedItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.review.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "newest":
          return (b.createdAt || b.id).localeCompare(a.createdAt || a.id);
        case "oldest":
          return (a.createdAt || a.id).localeCompare(b.createdAt || b.id);
        default:
          return 0;
      }
    });

  /* ------------------------------------------------------------------
     Handlers
  -------------------------------------------------------------------*/
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "rating") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
        setForm({ ...form, [name]: numValue });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    
    clearMessages();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }

    try {
      const dataURL = await convertFileToDataURL(file);
      setForm({ ...form, picture: dataURL });
      clearMessages();
    } catch (err) {
      showError("Failed to process image");
      console.error("Image upload error:", err);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      showError("Name is required");
      return false;
    }
    if (form.rating < 0 || form.rating > 10) {
      showError("Rating must be between 0 and 10");
      return false;
    }
    if (!form.review.trim()) {
      showError("Review is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      clearMessages();

      if (editing) {
        await updateRating(form.id, form);
        showSuccess("Rating updated successfully!");
      } else {
        await createRating({
          name: form.name,
          picture: form.picture,
          rating: form.rating,
          review: form.review
        });
        showSuccess("Rating created successfully!");
      }

      await fetchAll();
      setForm(blank);
      setEditing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      showError(`Failed to ${editing ? 'update' : 'create'} rating. Please try again.`);
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Rating) => {
    setForm(item);
    setEditing(true);
    clearMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rating?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteRating(id);
      showSuccess("Rating deleted successfully!");
      await fetchAll();
    } catch (err) {
      showError("Failed to delete rating. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const validRating = Math.max(0, Math.min(10, rating));
    const scaledRating = (validRating / 10) * 5;
    
    const fullStars = Math.floor(scaledRating);
    const halfStar = scaledRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 text-lg">
          {"★".repeat(fullStars)}
          {halfStar && "☆"}
          {"☆".repeat(emptyStars)}
        </span>
        <span className="text-sm text-gray-400 ml-1">
          {validRating.toFixed(1)}/10.0
        </span>
      </div>
    );
  };

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
          <Alert className="mb-6 border-red-600 bg-red-900/20">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
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
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-6">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2 text-white">
                  {editing ? "Edit Rating" : "Add New Rating"}
                </h2>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <Input
                      name="name"
                      placeholder="Item Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                      />
                      {form.picture && (
                        <div className="relative bg-gray-700 rounded-lg overflow-hidden w-full h-48">
                          <img
                            src={form.picture}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setForm({ ...form, picture: '' });
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        name="rating"
                        placeholder="Rating (0‑10)"
                        min={0}
                        max={10}
                        step={0.5}
                        value={form.rating}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {renderStars(form.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Review
                    </label>
                    <Textarea
                      name="review"
                      placeholder="Write your detailed review or comments..."
                      value={form.review}
                      onChange={handleChange}
                      required
                      className="min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? "Saving..." : editing ? "Update Rating" : "Create Rating"}
                    </Button>

                    {editing && (
                      <Button
                        onClick={() => {
                          setForm(blank);
                          setEditing(false);
                          clearMessages();
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                <div className="text-2xl font-bold text-blue-400">{stats.totalRatings}</div>
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-8 gap-3">
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
                      <h3 className="text-sm font-bold mb-2 text-white line-clamp-2">{item.name}</h3>
                      
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
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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