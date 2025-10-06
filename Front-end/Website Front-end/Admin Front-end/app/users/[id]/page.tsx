"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, Activity } from "lucide-react"
import Link from "next/link"

const userDetail = {
  id: 1,
  name: "Nguyễn Văn An",
  email: "an.nguyen@email.com",
  phone: "+84 123 456 789",
  location: "Hà Nội, Việt Nam",
  joinDate: "2024-01-15",
  status: "active",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Tôi là một người yêu thích du lịch và khám phá những điều mới mẻ. Tìm kiếm một người bạn đồng hành trong cuộc sống.",
  interests: ["Du lịch", "Ẩm thực", "Phim ảnh", "Thể thao"],
  photos: [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ],
}

const transactions = [
  { id: 1, type: "Premium", amount: 199000, date: "2024-02-15", status: "completed" },
  { id: 2, type: "Super Like", amount: 50000, date: "2024-02-10", status: "completed" },
  { id: 3, type: "Boost", amount: 30000, date: "2024-02-05", status: "completed" },
]

const activities = [
  { id: 1, action: "Đăng nhập", time: "2024-02-20 14:30", ip: "192.168.1.1" },
  { id: 2, action: "Cập nhật hồ sơ", time: "2024-02-20 10:15", ip: "192.168.1.1" },
  { id: 3, action: "Like người dùng", time: "2024-02-19 20:45", ip: "192.168.1.1" },
  { id: 4, action: "Gửi tin nhắn", time: "2024-02-19 18:30", ip: "192.168.1.1" },
]

export default function UserDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chi tiết Người dùng
          </h1>
          <p className="text-muted-foreground">Thông tin chi tiết về {userDetail.name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <img
              src={userDetail.avatar || "/placeholder.svg"}
              alt={userDetail.name}
              className="h-24 w-24 rounded-full mx-auto object-cover"
            />
            <CardTitle>{userDetail.name}</CardTitle>
            <CardDescription>ID: #{userDetail.id}</CardDescription>
            <Badge
              className={userDetail.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {userDetail.status === "active" ? "Hoạt động" : "Bị khóa"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userDetail.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userDetail.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userDetail.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tham gia: {new Date(userDetail.joinDate).toLocaleDateString("vi-VN")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
              <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
              <TabsTrigger value="photos">Ảnh</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin hồ sơ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Giới thiệu bản thân</h4>
                    <p className="text-sm text-muted-foreground">{userDetail.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sở thích</h4>
                    <div className="flex flex-wrap gap-2">
                      {userDetail.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Lịch sử giao dịch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loại</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.type}</TableCell>
                          <TableCell>{transaction.amount.toLocaleString("vi-VN")}₫</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Lịch sử hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hành động</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.action}</TableCell>
                          <TableCell>{activity.time}</TableCell>
                          <TableCell>{activity.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh của người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userDetail.photos.map((photo, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
