import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"

export default function SearchSort({searchTerm, setSearchTerm, sortBy, setSortBy}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy:React.Dispatch<React.SetStateAction<"name" | "newest" | "oldest" | "name-desc" | "rating" | "rating-low">>;}){
    return (
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
                      onChange={(e) => setSortBy(e.target.value as "name" | "newest" | "oldest" | "name-desc" | "rating" | "rating-low")}
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

    )
}