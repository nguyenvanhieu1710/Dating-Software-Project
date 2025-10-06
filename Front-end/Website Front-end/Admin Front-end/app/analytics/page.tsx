"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, Heart, DollarSign, Calendar } from "lucide-react"

const userGrowthData = [
  { month: "T1", users: 1200, active: 800 },
  { month: "T2", users: 1900, active: 1200 },
  { month: "T3", users: 3000, active: 2100 },
  { month: "T4", users: 5000, active: 3500 },
  { month: "T5", users: 4200, active: 3000 },
  { month: "T6", users: 6400, active: 4800 },
]

const revenueData = [
  { month: "T1", revenue: 12000000, subscriptions: 8000000, purchases: 4000000 },
  { month: "T2", revenue: 19000000, subscriptions: 12000000, purchases: 7000000 },
  { month: "T3", revenue: 30000000, subscriptions: 20000000, purchases: 10000000 },
  { month: "T4", revenue: 50000000, subscriptions: 35000000, purchases: 15000000 },
  { month: "T5", revenue: 42000000, subscriptions: 28000000, purchases: 14000000 },
  { month: "T6", revenue: 64000000, subscriptions: 45000000, purchases: 19000000 },
]

const matchData = [
  { day: "T2", matches: 234, messages: 1200 },
  { day: "T3", matches: 189, messages: 980 },
  { day: "T4", matches: 456, messages: 2100 },
  { day: "T5", matches: 378, messages: 1800 },
  { day: "T6", matches: 567, messages: 2800 },
  { day: "T7", matches: 489, messages: 2300 },
  { day: "CN", matches: 345, messages: 1600 },
]

const ageDistribution = [
  { name: "18-24", value: 35, color: "#3b82f6" },
  { name: "25-34", value: 45, color: "#8b5cf6" },
  { name: "35-44", value: 15, color: "#06b6d4" },
  { name: "45+", value: 5, color: "#10b981" },
]

const genderDistribution = [
  { name: "Nam", value: 52, color: "#3b82f6" },
  { name: "Nữ", value: 46, color: "#ec4899" },
  { name: "Khác", value: 2, color: "#8b5cf6" },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Thống kê & Phân tích
          </h1>
          <p className="text-muted-foreground">Phân tích chi tiết về hoạt động và hiệu suất của hệ thống</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 ngày qua</SelectItem>
            <SelectItem value="30days">30 ngày qua</SelectItem>
            <SelectItem value="6months">6 tháng qua</SelectItem>
            <SelectItem value="1year">1 năm qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">21,700</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12.5% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tương hợp</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">45,231</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8.2% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₫64,000,000</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +23.1% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12.3%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +2.1% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
            <CardDescription>Số lượng người dùng mới và hoạt động theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name === "users" ? "Tổng người dùng" : "Người dùng hoạt động"]}
                />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="url(#userGradient)" />
                <Area type="monotone" dataKey="active" stackId="2" stroke="#8b5cf6" fill="url(#activeGradient)" />
                <defs>
                  <linearGradient id="userGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>Phân tích doanh thu từ subscription và mua lẻ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₫${value.toLocaleString()}`, "Doanh thu"]} />
                <Bar dataKey="subscriptions" fill="#3b82f6" name="Subscription" />
                <Bar dataKey="purchases" fill="#8b5cf6" name="Mua lẻ" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động tương hợp</CardTitle>
            <CardDescription>Số lượng match và tin nhắn theo ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={matchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="matches" stroke="#ec4899" strokeWidth={2} name="Matches" />
                <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} name="Tin nhắn" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố độ tuổi</CardTitle>
            <CardDescription>Thống kê người dùng theo nhóm tuổi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {ageDistribution.map((entry, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố giới tính</CardTitle>
            <CardDescription>Thống kê người dùng theo giới tính</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {genderDistribution.map((entry, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
