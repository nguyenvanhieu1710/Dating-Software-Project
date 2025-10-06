import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Send, MoreVertical, Phone, Video } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-900">LoveConnect</span>
          </div>
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
            ← Quay lại khám phá
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Messages List */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Tin nhắn</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Tìm kiếm cuộc trò chuyện..." className="pl-10" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Active Conversation */}
                  <div className="p-3 border-b bg-purple-50 border-l-4 border-l-purple-600">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>MA</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">Minh Anh</p>
                          <p className="text-xs text-gray-500">2 phút</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">Cảm ơn bạn! Hẹn gặp lại nhé 😊</p>
                      </div>
                    </div>
                  </div>

                  {/* Other Conversations */}
                  {[
                    { name: "Thu Hà", message: "Chào bạn! Bạn có khỏe không?", time: "1 giờ", unread: 2 },
                    { name: "Đức Anh", message: "Cuối tuần này bạn có rảnh không?", time: "3 giờ", unread: 0 },
                    { name: "Linh Chi", message: "Haha, bạn thật hài hước!", time: "1 ngày", unread: 0 },
                    { name: "Hoàng Nam", message: "Cà phê ngon quá!", time: "2 ngày", unread: 1 },
                  ].map((chat, i) => (
                    <div key={i} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48&query=person${i + 2}`} />
                          <AvatarFallback>
                            {chat.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">{chat.name}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-gray-500">{chat.time}</p>
                              {chat.unread > 0 && (
                                <Badge variant="default" className="bg-purple-600 text-white text-xs px-2 py-1">
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="col-span-8">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>MA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">Minh Anh</p>
                        <p className="text-sm text-green-600">Đang hoạt động</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Hôm nay</p>
                  </div>

                  {/* Received Message */}
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs">
                      <p className="text-sm">Chào bạn! Rất vui được kết nối với bạn 😊</p>
                    </div>
                  </div>

                  {/* Sent Message */}
                  <div className="flex items-start space-x-2 justify-end">
                    <div className="bg-purple-600 text-white rounded-2xl rounded-tr-md px-4 py-2 max-w-xs">
                      <p className="text-sm">Chào Minh Anh! Mình cũng rất vui được gặp bạn</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs">
                      <p className="text-sm">Bạn có thích đi cà phê không? Mình biết một quán rất ngon gần đây</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 justify-end">
                    <div className="bg-purple-600 text-white rounded-2xl rounded-tr-md px-4 py-2 max-w-xs">
                      <p className="text-sm">Tuyệt vời! Mình rất thích cà phê. Cuối tuần này bạn có rảnh không?</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs">
                      <p className="text-sm">Cảm ơn bạn! Hẹn gặp lại nhé 😊</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Nhập tin nhắn..." className="flex-1" />
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
