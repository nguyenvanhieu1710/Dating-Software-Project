"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Settings, Heart, Bell, DollarSign, Trash2, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const interests = [
  { id: 1, name: "Du lịch", users: 1234 },
  { id: 2, name: "Ẩm thực", users: 2341 },
  { id: 3, name: "Phim ảnh", users: 1876 },
  { id: 4, name: "Thể thao", users: 987 },
  { id: 5, name: "Âm nhạc", users: 1543 },
  { id: 6, name: "Đọc sách", users: 765 },
]

const pricingPlans = [
  { id: 1, name: "Basic", price: 99000, duration: "1 tháng", features: ["Unlimited likes", "See who likes you"] },
  {
    id: 2,
    name: "Premium",
    price: 199000,
    duration: "1 tháng",
    features: ["All Basic features", "Boost profile", "Super likes"],
  },
  {
    id: 3,
    name: "Gold",
    price: 299000,
    duration: "1 tháng",
    features: ["All Premium features", "Priority support", "Advanced filters"],
  },
]

export default function SettingsPage() {
  const [newInterest, setNewInterest] = useState("")
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      console.log("Adding interest:", newInterest)
      setNewInterest("")
    }
  }

  const handleDeleteInterest = (id: number) => {
    console.log("Deleting interest:", id)
  }

  const handleSendNotification = () => {
    if (notificationTitle && notificationMessage) {
      console.log("Sending notification:", { title: notificationTitle, message: notificationMessage })
      setNotificationTitle("")
      setNotificationMessage("")
    }
  }

  const handleUpdatePricing = (plan: any) => {
    console.log("Updating pricing for:", plan)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cài đặt Hệ thống
        </h1>
        <p className="text-muted-foreground">Quản lý các thiết lập và cấu hình của hệ thống</p>
      </div>

      <Tabs defaultValue="interests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interests" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            Sở thích
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Giá cước
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Chung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý Sở thích</CardTitle>
              <CardDescription>Thêm, sửa hoặc xóa các sở thích mà người dùng có thể chọn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new interest */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Nhập sở thích mới..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
                />
                <Button onClick={handleAddInterest}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm
                </Button>
              </div>

              {/* Interests table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sở thích</TableHead>
                      <TableHead>Số người dùng</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interests.map((interest) => (
                      <TableRow key={interest.id}>
                        <TableCell className="font-medium">{interest.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{interest.users.toLocaleString()} người</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleDeleteInterest(interest.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt Giá cước</CardTitle>
              <CardDescription>Quản lý các gói cước và giá của hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <Card key={plan.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {plan.name}
                        <Button variant="outline" size="sm" onClick={() => setSelectedPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{plan.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-4">₫{plan.price.toLocaleString()}</div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Edit Pricing Dialog */}
              <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa gói {selectedPlan?.name}</DialogTitle>
                    <DialogDescription>Cập nhật thông tin và giá cước cho gói này</DialogDescription>
                  </DialogHeader>
                  {selectedPlan && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="planName">Tên gói</Label>
                        <Input id="planName" defaultValue={selectedPlan.name} />
                      </div>
                      <div>
                        <Label htmlFor="planPrice">Giá (VNĐ)</Label>
                        <Input id="planPrice" type="number" defaultValue={selectedPlan.price} />
                      </div>
                      <div>
                        <Label htmlFor="planDuration">Thời hạn</Label>
                        <Select defaultValue={selectedPlan.duration}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 tháng">1 tháng</SelectItem>
                            <SelectItem value="3 tháng">3 tháng</SelectItem>
                            <SelectItem value="6 tháng">6 tháng</SelectItem>
                            <SelectItem value="1 năm">1 năm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                          Hủy
                        </Button>
                        <Button onClick={() => handleUpdatePricing(selectedPlan)}>Cập nhật</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Gửi Thông báo Hàng loạt</CardTitle>
              <CardDescription>Soạn và gửi thông báo đẩy đến tất cả người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notificationTitle">Tiêu đề thông báo</Label>
                <Input
                  id="notificationTitle"
                  placeholder="Nhập tiêu đề thông báo..."
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notificationMessage">Nội dung thông báo</Label>
                <Textarea
                  id="notificationMessage"
                  placeholder="Nhập nội dung thông báo..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Thông báo sẽ được gửi đến tất cả {(21700).toLocaleString()} người dùng
                </div>
                <Button onClick={handleSendNotification}>
                  <Bell className="h-4 w-4 mr-2" />
                  Gửi thông báo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử Thông báo</CardTitle>
              <CardDescription>Các thông báo đã gửi gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Cập nhật tính năng mới</h4>
                    <span className="text-xs text-muted-foreground">2024-02-20 14:30</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chúng tôi vừa ra mắt tính năng video call trong ứng dụng. Hãy thử ngay!
                  </p>
                  <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Khuyến mãi Valentine</h4>
                    <span className="text-xs text-muted-foreground">2024-02-14 09:00</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Giảm 50% cho tất cả gói Premium trong dịp Valentine. Đừng bỏ lỡ!
                  </p>
                  <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt Chung</CardTitle>
              <CardDescription>Các thiết lập chung của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Cho phép đăng ký mới</Label>
                    <p className="text-sm text-muted-foreground">Người dùng mới có thể tạo tài khoản</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Kiểm duyệt ảnh tự động</Label>
                    <p className="text-sm text-muted-foreground">Sử dụng AI để kiểm duyệt ảnh tự động</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">Tạm thời tắt ứng dụng để bảo trì</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxDistance">Khoảng cách tối đa (km)</Label>
                  <Input id="maxDistance" type="number" defaultValue="100" />
                </div>

                <div>
                  <Label htmlFor="maxAge">Độ tuổi tối đa</Label>
                  <Input id="maxAge" type="number" defaultValue="60" />
                </div>

                <div>
                  <Label htmlFor="minAge">Độ tuổi tối thiểu</Label>
                  <Input id="minAge" type="number" defaultValue="18" />
                </div>
              </div>

              <Button className="w-full">Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
