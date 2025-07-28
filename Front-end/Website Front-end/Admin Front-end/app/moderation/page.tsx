"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Eye, X, AlertCircle, Ban, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const reports = [
  {
    id: 1,
    reporter: "Nguyễn Thị A",
    reported: "Trần Văn B",
    type: "inappropriate_content",
    reason: "Nội dung không phù hợp",
    description: "Người dùng đăng ảnh không phù hợp với quy định cộng đồng",
    date: "2024-02-20 14:30",
    status: "pending",
    evidence: "/placeholder.svg?height=200&width=200",
    contentType: "image",
  },
  {
    id: 2,
    reporter: "Lê Văn C",
    reported: "Phạm Thị D",
    type: "harassment",
    reason: "Quấy rối",
    description: "Gửi tin nhắn quấy rối liên tục",
    date: "2024-02-20 10:15",
    status: "pending",
    evidence: 'Tin nhắn: "Bạn có thể gặp tôi không? Tôi sẽ không từ bỏ..."',
    contentType: "message",
  },
  {
    id: 3,
    reporter: "Hoàng Văn E",
    reported: "Vũ Thị F",
    type: "fake_profile",
    reason: "Hồ sơ giả mạo",
    description: "Sử dụng ảnh của người khác",
    date: "2024-02-19 16:45",
    status: "resolved",
    evidence: "/placeholder.svg?height=200&width=200",
    contentType: "image",
  },
]

export default function ModerationPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xử lý</Badge>
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Đã bỏ qua</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inappropriate_content":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "harassment":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "fake_profile":
        return <Ban className="h-4 w-4 text-purple-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter((report) => statusFilter === "all" || report.status === statusFilter)

  const handleAction = (reportId: number, action: string) => {
    console.log(`Action ${action} for report ${reportId}`)
    // Handle action logic here
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kiểm duyệt Nội dung
        </h1>
        <p className="text-muted-foreground">Xử lý các báo cáo vi phạm từ người dùng</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Hàng đợi kiểm duyệt</CardTitle>
              <CardDescription>
                {filteredReports.filter((r) => r.status === "pending").length} báo cáo đang chờ xử lý
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="resolved">Đã xử lý</SelectItem>
                <SelectItem value="dismissed">Đã bỏ qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(report.type)}
                        <h3 className="font-semibold">{report.reason}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Người báo cáo:</span> {report.reporter}
                        </div>
                        <div>
                          <span className="font-medium">Người bị báo cáo:</span> {report.reported}
                        </div>
                        <div>
                          <span className="font-medium">Thời gian:</span> {report.date}
                        </div>
                        <div>
                          <span className="font-medium">Loại nội dung:</span>{" "}
                          {report.contentType === "image" ? "Hình ảnh" : "Tin nhắn"}
                        </div>
                      </div>
                      <p className="text-sm mb-4">{report.description}</p>

                      {/* Evidence Preview */}
                      <div className="mb-4">
                        <span className="font-medium text-sm">Bằng chứng:</span>
                        {report.contentType === "image" ? (
                          <div className="mt-2">
                            <ImageIcon
                              src={report.evidence || "/placeholder.svg"}
                              alt="Evidence"
                              className="h-20 w-20 object-cover rounded border"
                            />
                          </div>
                        ) : (
                          <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">{report.evidence}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {report.status === "pending" && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết báo cáo #{report.id}</DialogTitle>
                            <DialogDescription>Xem xét và xử lý báo cáo vi phạm</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium">Người báo cáo:</label>
                                <p>{report.reporter}</p>
                              </div>
                              <div>
                                <label className="font-medium">Người bị báo cáo:</label>
                                <p>{report.reported}</p>
                              </div>
                            </div>
                            <div>
                              <label className="font-medium">Mô tả chi tiết:</label>
                              <p className="mt-1">{report.description}</p>
                            </div>
                            <div>
                              <label className="font-medium">Bằng chứng:</label>
                              {report.contentType === "image" ? (
                                <ImageIcon
                                  src={report.evidence || "/placeholder.svg"}
                                  alt="Evidence"
                                  className="mt-2 max-w-full h-auto rounded border"
                                />
                              ) : (
                                <div className="mt-2 p-3 bg-gray-50 rounded border">{report.evidence}</div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button variant="outline" onClick={() => handleAction(report.id, "dismiss")}>
                                Bỏ qua
                              </Button>
                              <Button
                                variant="outline"
                                className="text-yellow-600 hover:text-yellow-700 bg-transparent"
                                onClick={() => handleAction(report.id, "warn")}
                              >
                                Cảnh cáo
                              </Button>
                              <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => handleAction(report.id, "delete")}
                              >
                                Xóa nội dung
                              </Button>
                              <Button variant="destructive" onClick={() => handleAction(report.id, "ban")}>
                                Khóa tài khoản
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => handleAction(report.id, "dismiss")}>
                        <X className="h-4 w-4 mr-1" />
                        Bỏ qua
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700 bg-transparent"
                        onClick={() => handleAction(report.id, "warn")}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Cảnh cáo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleAction(report.id, "delete")}
                      >
                        Xóa nội dung
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleAction(report.id, "ban")}>
                        <Ban className="h-4 w-4 mr-1" />
                        Khóa tài khoản
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
