import { Card, CardContent } from "./ui/card";
import { renderStars } from "./stars";
import { Button } from "./ui/button";
import type { Rating } from "../interfaces/rating";

export default function Ratings({filteredAndSortedItems, handleEdit, loading, handleDelete}: any){
    return (
            <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">
              {filteredAndSortedItems.map((item: Rating) => (
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
    )
}