import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { renderStars } from "../components/stars";

export default function AddRating({
    loading,
    editing,
    form,
    handleChange,
    fileInputRef,
    handleImageUpload,
    setForm,
    handleSubmit,
    blank,
    setEditing,
    clearMessages
    }: any) {
    
    return (
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
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-600"
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
                            className="absolute top-2 right-2 bg-[#d62d2d] hover:bg-[#d62d2d] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
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
                      className="min-h-[18vh] bg-gray-700 border-gray-600 text-xs text-white placeholder-gray-400 resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
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

    )
}