"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FlaskRoundIcon as Flask, BookOpen, Download, ExternalLink, Clock, Plus, ArrowLeft } from "lucide-react"

const LabsComponent = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showLabForm, setShowLabForm] = useState(false)

  const handleAddLab = () => {
    setShowLabForm(true)
  }

  const handleAddMaterial = () => {
    console.log("Add new material clicked")
  }

  const handleLabFormSubmit = (newLab: any) => {
    // Here you could add the new lab to your labs array if needed
    setShowLabForm(false)
  }

  const handleLabFormCancel = () => {
    setShowLabForm(false)
  }

  const labs = [
    {
      id: 1,
      title: "Chemical Reaction Analysis",
      description: "Study the kinetics of acid-base reactions under controlled conditions",
      category: "Chemistry",
      duration: "2 hours",
      difficulty: "Intermediate",
      materials: ["pH meter", "Burette", "Conical flask", "Indicator solution"],
    },
    {
      id: 2,
      title: "Microscopy Techniques",
      description: "Learn advanced microscopy methods for biological sample analysis",
      category: "Biology",
      duration: "3 hours",
      difficulty: "Advanced",
      materials: ["Compound microscope", "Slides", "Cover slips", "Staining solutions"],
    },
    {
      id: 3,
      title: "Circuit Analysis Lab",
      description: "Analyze electrical circuits using oscilloscopes and multimeters",
      category: "Physics",
      duration: "1.5 hours",
      difficulty: "Beginner",
      materials: ["Oscilloscope", "Multimeter", "Breadboard", "Resistors", "Capacitors"],
    },
  ]

  const materials = [
    {
      id: 1,
      name: "Digital Microscope",
      category: "Optical Equipment",
      description: "High-resolution digital microscope with 1000x magnification",
    },
    {
      id: 2,
      name: "pH Meter Set",
      category: "Measurement Tools",
      description: "Digital pH meters with calibration solutions",
    },
    {
      id: 3,
      name: "Oscilloscope",
      category: "Electronic Equipment",
      description: "Digital storage oscilloscope for waveform analysis",
    },
  ]

  const filteredLabs = labs.filter(
    (lab) =>
      lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (showLabForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={handleLabFormCancel} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Labs
              </Button>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Flask className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">Create New Lab</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Add a new lab to your collection
              </p>
            </div>
          </div>
        </div>

        {/* Lab Form */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Flask className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">Lab & Materials</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Access labs, equipment, and resources for your research and learning
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search labs or materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 dark:bg-gray-800/90"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="labs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="labs" className="flex items-center gap-2">
              <Flask className="w-4 h-4" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Materials
            </TabsTrigger>
          </TabsList>

          {/* Labs Tab */}
          <TabsContent value="labs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Labs</h2>
              <Button onClick={handleAddLab} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Lab
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <Card
                  key={lab.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-heading">{lab.title}</CardTitle>
                        <CardDescription className="mt-2">{lab.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lab.duration}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lab.difficulty}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Materials:</p>
                      <div className="flex flex-wrap gap-1">
                        {lab.materials.slice(0, 3).map((material, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                        {lab.materials.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lab.materials.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Materials</h2>
              <Button onClick={handleAddMaterial} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Material
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-heading">{material.name}</CardTitle>
                        <CardDescription className="mt-2">{material.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Category</p>
                        <p className="font-medium">{material.category}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{labs.length}</div>
              <p className="text-gray-600 dark:text-gray-300">Labs</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{materials.length}</div>
              <p className="text-gray-600 dark:text-gray-300">Materials</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LabsComponent
