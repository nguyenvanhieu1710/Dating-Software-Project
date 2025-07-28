import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Crown, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LikesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-purple-900">Ai đã thích bạn</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            12 lượt thích mới
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Premium Upgrade Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Nâng cấp để xem ai đã thích bạn</h2>
                <p className="opacity-90">Khám phá những người đã quan tâm đến bạn và tăng cơ hội kết nối</p>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Crown className="mr-2 h-4 w-4" />
                Nâng cấp ngay
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Likes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Blurred profiles for free users */}
          {Array.from({ length: 12 }, (_, i) => (
            <Card key={i} className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative">
                <img
                  src={`/placeholder.svg?height=400&width=300&query=person${i + 1}`}
                  alt="Profile"
                  className="w-full h-full object-cover filter blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Heart icon overlay */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white fill-current" />
                  </div>
                </div>

                {/* Premium lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4">
                    <Crown className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Vừa thích bạn</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đừng bỏ lỡ cơ hội kết nối!</h3>
              <p className="text-gray-600 mb-4">
                Có 12 người đã thích bạn. Nâng cấp Premium để xem và kết nối với họ ngay.
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Xem tất cả lượt thích
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
