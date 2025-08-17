import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type { Rating } from "../interfaces/rating";

export default function Empty({
  loading,
  filteredAndSortedItems,
  searchTerm,
  setSearchTerm,
}: {
  loading: boolean;
  filteredAndSortedItems: Rating[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      {!loading && filteredAndSortedItems.length === 0 && (
        <Card className="text-center py-12 bg-gray-800 border-gray-700">
          <CardContent>
            {/* <div className="text-6xl mb-4">🎬</div> */}
            <h3 className="text-xl font-semibold mb-2 text-white">
              {searchTerm ? "No ratings found" : "No ratings yet"}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search term"
                : "Add your first rating to get started!"}
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
    </>
  );
}
