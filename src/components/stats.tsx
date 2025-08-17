import { Card } from "./ui/card"
import type { Stats } from "../hooks/useRating"

export default function Stats({stats}: {stats: Stats}){
    return (
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
    )
}