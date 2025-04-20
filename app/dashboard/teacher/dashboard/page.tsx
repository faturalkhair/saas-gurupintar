"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  CheckCircle2,
  FileText,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { SelfieAttendance } from "@/components/SelfieAttendance"
import { AttendanceHistory } from "@/components/AttendanceHistory"
import { submitTeacherAttendance } from "@/app/actions/attendance"
import { toast } from "@/components/ui/use-toast"

// Add these CSS utility classes for transitions
const transitionClasses = {
  base: "transition-all duration-300",
  fadeIn: "transition-opacity duration-500",
  delayed: "transition-opacity duration-500 delay-300",
}

export default function TeacherDashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [teacherId, setTeacherId] = useState("teacher-123") // In a real app, this would come from auth
  const [lastAttendance, setLastAttendance] = useState<{
    imageUrl: string
    timestamp: string
    status: string
  } | null>(null)

  // Safe mounting to prevent hydration and DOM manipulation issues
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready before animations
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  // Handle successful attendance submission
  const handleAttendanceSuccess = async (data: any) => {
    try {
      // Create form data to submit
      const formData = new FormData()
      formData.append("teacherId", teacherId)
      formData.append("imageData", data.imageUrl)

      if (data.location) {
        formData.append("locationData", JSON.stringify(data.location))
      }

      // Submit attendance using server action
      const result = await submitTeacherAttendance(formData)

      if (result.success) {
        toast({
          title: "Kehadiran Dicatat",
          description: "Kehadiran Anda telah berhasil dicatat.",
          variant: "default",
        })

        // Update last attendance
        setLastAttendance({
          imageUrl: data.imageUrl,
          timestamp: new Date().toISOString(),
          status: "pending",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal mencatat kehadiran",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting attendance:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      })
    }
  }

  // Define activities outside of the render to avoid recreation on each render
  const activities = [
    {
      icon: <ImageIcon className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />,
      title: "Foto Laboratorium Ilmiah Diunggah",
      description: "Anda mengunggah 12 foto baru dari eksperimen ilmiah kemarin",
      time: "2 jam yang lalu",
    },
    {
      icon: <FileText className="h-8 w-8 p-1.5 bg-purple-100 text-purple-600 rounded-full" />,
      title: "Rencana Pembelajaran Matematika Diperbarui",
      description: "Anda melakukan perubahan pada rencana pembelajaran Aljabar untuk kelas 10",
      time: "Kemarin",
    },
    {
      icon: <Users className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />,
      title: "Kehadiran Dicatat",
      description: "Anda mencatat kehadiran untuk kelas 9A - 24 hadir, 1 tidak hadir",
      time: "Kemarin",
    },
    {
      icon: <MessageSquare className="h-8 w-8 p-1.5 bg-amber-100 text-amber-600 rounded-full" />,
      title: "Komunikasi Orang Tua",
      description: "Anda mengirim laporan kemajuan kepada 5 orang tua",
      time: "2 hari yang lalu",
    },
  ]

  // Show a simple loading state while component is mounting
  if (!mounted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-r-transparent animate-spin mb-4"></div>
        <p className="text-muted-foreground">Memuat dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Ringkasan Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Selamat datang kembali! Berikut adalah aktivitas hari ini.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SelfieAttendance teacherId={teacherId} onSuccess={handleAttendanceSuccess} />
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/teacher/attendance">
              <Users className="h-4 w-4" />
              Kelola Kehadiran
            </Link>
          </Button>
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Link href="/dashboard/teacher/photos">
              <ImageIcon className="h-4 w-4" />
              Unggah Foto
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-primary/5 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Ringkasan
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Kehadiran
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Aktivitas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "attendance" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AttendanceHistory teacherId={teacherId} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Status Hari Ini</CardTitle>
                <CardDescription>Kehadiran Anda hari ini</CardDescription>
              </CardHeader>
              <CardContent>
                {lastAttendance ? (
                  <div className="space-y-4">
                    <div className="aspect-square max-h-[200px] overflow-hidden rounded-lg border">
                      <img
                        src={lastAttendance.imageUrl || "/placeholder.svg"}
                        alt="Today's attendance"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tercatat pada:</span>
                      <span className="font-medium">{new Date(lastAttendance.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-amber-500">Menunggu Verifikasi</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Belum ada kehadiran yang tercatat hari ini</p>
                    <Button
                      onClick={() => document.querySelector<HTMLButtonElement>("[data-attendance-trigger]")?.click()}
                      variant="outline"
                      className="mt-4"
                    >
                      Catat Sekarang
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Kehadiran Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-sm text-muted-foreground">23 dari 25 siswa hadir</p>
                <Progress value={92} className="h-2 mt-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="mt-2 p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Link href="/dashboard/teacher/attendance">Lihat detail</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800 overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Jadwal Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-sm text-muted-foreground">Kelas yang dijadwalkan hari ini</p>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selanjutnya: Matematika</span>
                    <span>10:30 WIB</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="mt-2 p-0 h-auto text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <Link href="/dashboard/teacher/schedule">Jadwal lengkap</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <FileText className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Rencana Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">Rencana siap untuk minggu ini</p>
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>2 rencana disetujui</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="mt-2 p-0 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <Link href="/dashboard/teacher">Kelola rencana</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Aktivitas dan pembaruan kelas terbaru</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        {activity.icon}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Semua Aktivitas
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tindakan Cepat</CardTitle>
                  <CardDescription>Alat dan tindakan yang sering digunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    >
                      <Link href="/dashboard/teacher/attendance">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-xs">Ambil Kehadiran</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    >
                      <Link href="/dashboard/teacher">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="text-xs">Buat Pembelajaran</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    >
                      <Link href="/dashboard/teacher/photos">
                        <ImageIcon className="h-5 w-5 text-green-600" />
                        <span className="text-xs">Unggah Foto</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    >
                      <Link href="/dashboard/teacher/reports">
                        <PieChart className="h-5 w-5 text-amber-600" />
                        <span className="text-xs">Lihat Laporan</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="default" size="sm" className="w-full gap-1">
                    <Link href="/dashboard/teacher">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Ke Dashboard Utama</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

