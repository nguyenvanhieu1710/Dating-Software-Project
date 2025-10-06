import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Heart, Mail, Phone, Facebook } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-100">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">LoveConnect</span>
          </div>
          <CardTitle className="text-2xl text-purple-900">Chào mừng trở lại</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục tìm kiếm tình yêu của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Facebook className="mr-2 h-4 w-4" />
              Tiếp tục với Facebook
            </Button>
            <Button variant="outline" className="w-full border-gray-300 bg-transparent">
              <Phone className="mr-2 h-4 w-4" />
              Đăng nhập bằng số điện thoại
            </Button>
            <Button variant="outline" className="w-full border-gray-300 bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Đăng nhập bằng email
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email hoặc số điện thoại</Label>
              <Input id="email" type="email" placeholder="Nhập email hoặc số điện thoại" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" placeholder="Nhập mật khẩu" />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Đăng nhập</Button>
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-purple-600 hover:underline font-semibold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
