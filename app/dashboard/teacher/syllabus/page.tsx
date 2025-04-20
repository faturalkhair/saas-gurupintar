"use client"

import type React from "react"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, BookOpen, Save, FileText, Clock, Users, Sparkles } from "lucide-react"

interface SyllabusFormData {
  subject: string
  grade: string
  semester: string
  academicYear: string
  coreCompetencies: string
  basicCompetencies: string
  indicators: string
  mainTopics: string
  learningActivities: string
  assessmentMethods: string
  timeAllocation: string
  learningResources: string
}

export default function SyllabusPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [formData, setFormData] = useState<SyllabusFormData>({
    subject: "",
    grade: "",
    semester: "",
    academicYear: "",
    coreCompetencies: "",
    basicCompetencies: "",
    indicators: "",
    mainTopics: "",
    learningActivities: "",
    assessmentMethods: "",
    timeAllocation: "",
    learningResources: "",
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setActiveTab("preview")
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Buat Silabus
          </h1>
          <p className="text-muted-foreground mt-1">Rancang silabus komprehensif untuk kelas Anda</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Buat dengan AI
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Buat Silabus
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Pratinjau
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-0">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Silabus Baru
              </CardTitle>
              <CardDescription>Isi detail untuk membuat silabus yang komprehensif</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Information */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Mata Pelajaran</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Kelas</Label>
                      <Select value={formData.grade} onValueChange={(value) => handleSelectChange(value, "grade")}>
                        <SelectTrigger className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              Grade {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) => handleSelectChange(value, "semester")}
                      >
                        <SelectTrigger className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Pilih semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Semester 1</SelectItem>
                          <SelectItem value="2">Semester 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Tahun Ajaran</Label>
                      <Input
                        id="academicYear"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        placeholder="2024/2025"
                        className="border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Competencies */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Kompetensi
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coreCompetencies">Kompetensi Inti (KI)</Label>
                      <Textarea
                        id="coreCompetencies"
                        name="coreCompetencies"
                        value={formData.coreCompetencies}
                        onChange={handleInputChange}
                        placeholder="Kembangkan kemampuan berpikir kritis dan kreatif siswa."
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="basicCompetencies">Kompetensi Dasar (KD)</Label>
                      <Textarea
                        id="basicCompetencies"
                        name="basicCompetencies"
                        value={formData.basicCompetencies}
                        onChange={handleInputChange}
                        placeholder="Memahami konsep dasar perkalian dan pembagian."
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="indicators">Indikator Pencapaian Kompetensi</Label>
                      <Textarea
                        id="indicators"
                        name="indicators"
                        value={formData.indicators}
                        onChange={handleInputChange}
                        placeholder="Siswa dapat menyelesaikan soal perkalian sederhana dengan tepat."
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Content & Activities */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Konten & Pembelajaran
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mainTopics">Topik Utama</Label>
                      <Textarea
                        id="mainTopics"
                        name="mainTopics"
                        value={formData.mainTopics}
                        onChange={handleInputChange}
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="learningActivities">Kegiatan Pembelajaran</Label>
                      <Textarea
                        id="learningActivities"
                        name="learningActivities"
                        value={formData.learningActivities}
                        onChange={handleInputChange}
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessmentMethods">Metode Penilaian</Label>
                      <Textarea
                        id="assessmentMethods"
                        name="assessmentMethods"
                        value={formData.assessmentMethods}
                        onChange={handleInputChange}
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Additional Information */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Informasi Tambahan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timeAllocation">Alokasi Waktu</Label>
                      <Input
                        id="timeAllocation"
                        name="timeAllocation"
                        value={formData.timeAllocation}
                        onChange={handleInputChange}
                        placeholder="2 × 35 menit"
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="learningResources">Sumber Belajar</Label>
                      <Textarea
                        id="learningResources"
                        name="learningResources"
                        value={formData.learningResources}
                        onChange={handleInputChange}
                        placeholder="Buku teks Matematika SD, media pembelajaran interaktif, alat peraga."
                        className="min-h-[100px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Membuat Silabus...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Buat Silabus
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Pratinjau Silabus
              </CardTitle>
              <CardDescription>Tinjau silabus yang telah dibuat sebelum menyimpan</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.subject ? (
                <div className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Mata Pelajaran:</p>
                        <p className="text-sm">{formData.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Kelas:</p>
                        <p className="text-sm">{formData.grade}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Semester:</p>
                        <p className="text-sm">{formData.semester === "1" ? "Semester 1" : "Semester 2"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tahun Ajaran:</p>
                        <p className="text-sm">{formData.academicYear}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Kompetensi</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Kompetensi Inti (KI):</p>
                        <p className="text-sm">{formData.coreCompetencies || "Belum ditentukan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Kompetensi Dasar (KD):</p>
                        <p className="text-sm">{formData.basicCompetencies || "Belum ditentukan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Indikator Pencapaian Kompetensi:</p>
                        <p className="text-sm">{formData.indicators || "Belum ditentukan"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Konten & Pembelajaran</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Topik Utama:</p>
                        <p className="text-sm">{formData.mainTopics || "Belum ditentukan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Kegiatan Pembelajaran:</p>
                        <p className="text-sm">{formData.learningActivities || "Belum ditentukan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Metode Penilaian:</p>
                        <p className="text-sm">{formData.assessmentMethods || "Belum ditentukan"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Alokasi Waktu:</p>
                        <p className="text-sm">{formData.timeAllocation || "Belum ditentukan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sumber Belajar:</p>
                        <p className="text-sm">{formData.learningResources || "Belum ditentukan"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Tidak ada data silabus untuk dipratinjau. Silakan isi formulir terlebih dahulu.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t p-6">
              <Button variant="outline" onClick={() => setActiveTab("form")}>
                Edit Silabus
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Simpan Silabus
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

