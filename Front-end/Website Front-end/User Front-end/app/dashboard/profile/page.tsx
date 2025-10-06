import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Heart, Upload, X, Settings, User, ImageIcon, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
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
              <span className="text-xl font-bold text-purple-900">Quản lý hồ sơ</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Hồ sơ</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Ảnh</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Cài đặt</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Premium</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input id="firstName" defaultValue="Minh" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Họ</Label>
                        <Input id="lastName" defaultValue="Anh" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Giới thiệu bản thân</Label>
                      <Textarea
                        id="bio"
                        placeholder="Viết vài dòng về bản thân bạn..."
                        defaultValue="Yêu thích khám phá những địa điểm mới và thưởng thức cà phê. Đam mê du lịch và âm nhạc. Tìm kiếm một người bạn đồng hành để chia sẻ những trải nghiệm tuyệt vời trong cuộc sống."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Tuổi</Label>
                        <Input id="age" type="number" defaultValue="25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Vị trí</Label>
                        <Input id="location" defaultValue="Hà Nội, Việt Nam" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Sở thích</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Du lịch", "Âm nhạc", "Yoga", "Cà phê", "Đọc sách", "Phim ảnh"].map((interest) => (
                          <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-purple-100">
                            {interest}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          + Thêm sở thích
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Xem trước hồ sơ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-4">
                      <img
                        src="/placeholder.svg?height=400&width=300"
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold">Minh Anh, 25</h3>
                        <p className="text-sm opacity-90">📍 Hà Nội, Việt Nam</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Độ hoàn thiện hồ sơ</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <p className="text-sm font-semibold text-purple-600">85%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý ảnh</CardTitle>
                <p className="text-sm text-gray-600">Kéo thả để sắp xếp lại thứ tự ảnh</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Main Photo */}
                  <div className="relative group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-600">
                      <img
                        src="/placeholder.svg?height=400&width=300"
                        alt="Main Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-purple-600">Ảnh chính</Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Other Photos */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={`/placeholder.svg?height=400&width=300&query=photo${i + 2}`}
                          alt={`Photo ${i + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Upload New Photo */}
                  <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-purple-600 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Thêm ảnh</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Khoảng cách tối đa</Label>
                    <Slider defaultValue={[10]} max={100} step={1} className="w-full" />
                    <p className="text-sm text-gray-600">10 km</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Độ tuổi</Label>
                    <Slider defaultValue={[22, 35]} max={60} min={18} step={1} className="w-full" />
                    <p className="text-sm text-gray-600">22 - 35 tuổi</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showMe">Hiển thị với</Label>
                    <select className="border rounded px-3 py-1">
                      <option>Tất cả mọi người</option>
                      <option>Nam</option>
                      <option>Nữ</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="minhanh@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" defaultValue="+84 123 456 789" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Thông báo push</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discovery">Hiển thị trong khám phá</Label>
                    <Switch id="discovery" defaultChecked />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Đổi mật khẩu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Premium Tab */}
          <TabsContent value="premium" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nâng cấp Premium</CardTitle>
                <p className="text-gray-600">Mở khóa tất cả tính năng để tăng cơ hội kết nối</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Plus Plan */}
                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Plus</h3>
                      <p className="text-3xl font-bold text-purple-600 mb-4">
                        199k<span className="text-sm text-gray-500">/tháng</span>
                      </p>
                      <ul className="space-y-2 text-sm mb-6">
                        <li>✓ 5 Super Like mỗi ngày</li>
                        <li>✓ 1 Boost mỗi tháng</li>
                        <li>✓ Xem ai đã thích bạn</li>
                        <li>✓ Lượt thích không giới hạn</li>
                      </ul>
                      <Button variant="outline" className="w-full bg-transparent">
                        Chọn gói Plus
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Gold Plan */}
                  <Card className="border-2 border-yellow-400 relative">
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black">
                      Phổ biến nhất
                    </Badge>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Gold</h3>
                      <p className="text-3xl font-bold text-yellow-600 mb-4">
                        399k<span className="text-sm text-gray-500">/tháng</span>
                      </p>
                      <ul className="space-y-2 text-sm mb-6">
                        <li>✓ Tất cả tính năng Plus</li>
                        <li>✓ Xem ai đã đọc tin nhắn</li>
                        <li>✓ 5 Boost mỗi tháng</li>
                        <li>✓ Top Pick hàng tuần</li>
                      </ul>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Chọn gói Gold</Button>
                    </CardContent>
                  </Card>

                  {/* Platinum Plan */}
                  <Card className="border-2 border-purple-400">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Platinum</h3>
                      <p className="text-3xl font-bold text-purple-600 mb-4">
                        599k<span className="text-sm text-gray-500">/tháng</span>
                      </p>
                      <ul className="space-y-2 text-sm mb-6">
                        <li>✓ Tất cả tính năng Gold</li>
                        <li>✓ Tin nhắn trước khi match</li>
                        <li>✓ Ưu tiên trong danh sách</li>
                        <li>✓ Xem lượt thích trước 7 ngày</li>
                      </ul>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Chọn gói Platinum</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
