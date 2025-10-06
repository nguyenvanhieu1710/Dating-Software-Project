import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, MessageCircle, Settings, User, Zap } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-900">LoveConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Zap className="h-4 w-4 text-yellow-500 mr-1" />
              Premium
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 p-2 rounded-lg bg-purple-100 text-purple-700"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Khám phá</span>
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Tin nhắn</span>
                    <Badge variant="secondary" className="ml-auto">
                      3
                    </Badge>
                  </Link>
                  <Link
                    href="/dashboard/likes"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Star className="h-5 w-5" />
                    <span>Lượt thích</span>
                    <Badge variant="secondary" className="ml-auto">
                      12
                    </Badge>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span>Hồ sơ</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Cài đặt</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Kết nối gần đây</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&query=person${i}`} />
                        <AvatarFallback>P{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Người {i}</p>
                        <p className="text-xs text-gray-500">Vừa kết nối</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Discovery */}
          <div className="col-span-6">
            <div className="flex justify-center">
              <Card className="w-full max-w-md relative overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img
                    src="/placeholder.svg?height=600&width=450"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">Minh Anh, 25</h2>
                    <p className="text-sm opacity-90 mb-2">📍 2km từ bạn</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Du lịch
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Âm nhạc
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Yoga
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">
                      "Yêu thích khám phá những địa điểm mới và thưởng thức cà phê ☕"
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-14 h-14 border-2 border-white bg-white/90 hover:bg-white"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </Button>
                  <Button size="lg" className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700">
                    <Heart className="h-7 w-7 text-white" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-14 h-14 border-2 border-blue-400 bg-white/90 hover:bg-white"
                  >
                    <Star className="h-6 w-6 text-blue-500" />
                  </Button>
                </div>
              </Card>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-600 mb-2">Sử dụng phím tắt:</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>← Bỏ qua</span>
                <span>↑ Super Like</span>
                <span>→ Thích</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-gray-900">Tôi</h3>
                  <p className="text-sm text-gray-500 mb-3">Hoàn thiện hồ sơ: 85%</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Nâng cấp Premium</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Xem ai đã thích bạn</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>5 Super Like mỗi ngày</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Lượt thích không giới hạn</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Nâng cấp ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
