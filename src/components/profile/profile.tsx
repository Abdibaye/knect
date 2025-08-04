import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import ProfileSkeleton from "./ProfileSkeleton"
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Briefcase,
  ThumbsUp,
  MessageSquare,
  Share2,
  CheckIcon,
} from "lucide-react"




export default function ProfilePage({ profile }: { profile: any }) {
  if (!profile) return <ProfileSkeleton />;
  if (profile.error) return <div>Error: {profile.error}</div>;
  const user = profile.user;
  if (!user) return <div>User not found</div>;
  const { name, email, location, connections, image } = user;




  return (
    <div className="min-h-screen">
      <div className="max-full mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="bg-white py-0 dark:bg-zinc-900">
              <div className="relative">
                {/* Cover Photo */}

                  <img className="w-full h-48 object-cover rounded-t-lg" src="https://9426055.fs1.hubspotusercontent-na1.net/hubfs/9426055/tech-sales-career-image.jpg" alt="image" />

                {/* Profile Info */}
                <CardContent className="relative pt-2 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                    <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 -mt-16 mb-4 sm:mb-0">
                      <AvatarImage src={image} alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {name ? name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{name}</h1>
                      <Badge variant="outline" className="gap-1">
                  <CheckIcon className="text-emerald-500 items-center" size={12} aria-hidden="true" />
                  verified
                      </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Student at Adama Science and Technology University
                      </p>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Adama, Ethiopia</span>
                        <span className="mx-2">•</span>
                        <span className="text-blue-600 hover:underline cursor-pointer">250+ connections</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* About Section */}
            <Card className="bg-white dark:bg-zinc-900">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  A highly motivated and dedicated student at Adama Science and Technology University, pursuing a degree
                  in Computer Science. Passionate about leveraging technology to solve real-world problems and eager to
                  contribute to innovative projects. Actively seeking opportunities to expand knowledge and skills in
                  software development, data science, and artificial intelligence.
                </p>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed mt-4">
                  Currently focused on developing machine learning models for image recognition and exploring the
                  applications of blockchain technology in secure data management.
                </p>
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card className="bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity</h2>
                  <Button variant="ghost" size="sm">
                    See all activity
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">1,234 followers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-blue-600 pl-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Alex posted this • 2d</p>
                  <p className="mt-2 text-gray-700 dark:text-gray-200">
                    Excited to share that our team just launched a new feature that improves user experience by 40%! The
                    power of collaborative engineering never ceases to amaze me. 🚀
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>24</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>8 comments</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="bg-white dark:bg-zinc-900">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Academic Projects
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="TechCorp" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Smart Irrigation System</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Adama Science and Technology University • Group Project
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sept 2023 - Dec 2023 • 4 mos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adama, Ethiopia</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-200">
                      Developed a smart irrigation system using Arduino and sensor technology to optimize water usage in
                      agriculture. Implemented a web interface for remote monitoring and control.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">Arduino</Badge>
                      <Badge variant="secondary">Sensors</Badge>
                      <Badge variant="secondary">Web Interface</Badge>
                      <Badge variant="secondary">C++</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="StartupXYZ" />
                    <AvatarFallback>SX</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Machine Learning-Based Plant Disease Detection
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Adama Science and Technology University • Individual Project
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Jan 2024 - May 2024 • 5 mos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adama, Ethiopia</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-200">
                      Developed a machine learning model using Python and TensorFlow to detect plant diseases from
                      images. Achieved 90% accuracy in identifying common plant diseases.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">Python</Badge>
                      <Badge variant="secondary">TensorFlow</Badge>
                      <Badge variant="secondary">Machine Learning</Badge>
                      <Badge variant="secondary">Image Processing</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <h3 className="font-semibold text-gray-900 dark:text-white">Contact info</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">alex.johnson@student.astu.edu.et</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">+251 911 123 456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">johnsmith.dev</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
