import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Star, Download, LogIn } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">LoveConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-purple-700 hover:text-purple-900">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Tham gia ngay</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">
            Tìm kiếm tình yêu
            <br />
            <span className="text-purple-600">thật sự</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Kết nối với những người phù hợp với bạn. Hơn 50 triệu người đã tin tưởng chúng tôi để tìm kiếm tình yêu đích
            thực.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              <Download className="mr-2 h-5 w-5" />
              Tải ứng dụng
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg bg-transparent"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Vuốt thông minh</h3>
                <p className="text-gray-600">
                  Thuật toán AI giúp bạn tìm kiếm những người phù hợp nhất dựa trên sở thích và tính cách.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Tương hợp cao</h3>
                <p className="text-gray-600">
                  Hệ thống matching thông minh với tỷ lệ tương hợp lên đến 95% dựa trên nhiều yếu tố.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">An toàn tuyệt đối</h3>
                <p className="text-gray-600">
                  Xác minh danh tính, kiểm duyệt ảnh tự động và bảo mật thông tin cá nhân tối đa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">Câu chuyện thành công</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Tôi đã gặp được nửa kia của mình sau chỉ 2 tuần sử dụng. Cảm ơn LoveConnect!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-700 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Anh Tuấn</p>
                    <p className="text-sm text-gray-500">Hà Nội</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Giao diện đẹp, dễ sử dụng và quan trọng là tìm được người phù hợp thật sự."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-700 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Mai Linh</p>
                    <p className="text-sm text-gray-500">TP.HCM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Thuật toán matching rất chính xác. Tôi đã kết hôn với người tôi gặp ở đây!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-700 font-semibold">H</span>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Hoàng Nam</p>
                    <p className="text-sm text-gray-500">Đà Nẵng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="text-xl font-bold">LoveConnect</span>
              </div>
              <p className="text-purple-200">Nền tảng hẹn hò trực tuyến hàng đầu Việt Nam</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-purple-200">
                <li>
                  <Link href="/about" className="hover:text-white">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Báo chí
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Tuyển dụng
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-purple-200">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    An toàn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Pháp lý</h4>
              <ul className="space-y-2 text-purple-200">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-200">
            <p>&copy; 2024 LoveConnect. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
