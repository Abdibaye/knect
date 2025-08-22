import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import Link from 'next/link'

export default function JobPortalPage() {
  const categories = [
    { name: "Accounting/Finance", count: 2058 },
    { name: "Production/Operation", count: 876 },
    { name: "Education/Training", count: 1523 },
    { name: "Design/Creative", count: 798 },
    { name: "Health & Fitness", count: 456 },
    { name: "Research/Consultancy", count: 234 },
    { name: "Engineer/Architects", count: 1876 },
    { name: "Telecommunication", count: 1420 },
    { name: "Data Entry/Operator", count: 987 },
    { name: "Production/Operation", count: 876 },
    { name: "Marketing/Sales", count: 2341 },
    { name: "Security/Support Service", count: 654 },
  ]

  const jobListings = [
    {
      id: 1,
      company: "Darksale Ltd.",
      logo: "D",
      position: "Frontend Developer",
      location: "Full-time",
      type: "Javascript, Bootstrap",
      details: "CSS3, HTML5, Javascript, Bootstrap",

      color: "bg-purple-500",
    },

  ]

  return (
    <div className="min-h-screen bg-white max-w-fit">



      <section className="relative bg-gray-900 text-white py-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/hero-bg.png)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">You can choose your dream job</h1>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Find great job for the bright career. Have many job in this position.
          </p>


          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1">
              <Input placeholder="Job title, keywords..." className="h-12 bg-white text-gray-900 border-0" />
            </div>
            <div className="flex-1">
              <Input placeholder="Location" className="h-12 bg-white text-gray-900 border-0" />
            </div>
            <div className="flex-1">
              <Input placeholder="Category" className="h-12 bg-white text-gray-900 border-0" />
            </div>

            <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600">
              <Search className="w-5 h-5" />
            </Button>


            < Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600">
              <Plus className="w-5 h-5 ml-2" />
              Add Opportunity</Button>




          </div>
        </div>


        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-blue-500 rounded-full opacity-30"></div>
      </section>


      {/* Recent Job Circulars */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Job Circulars</h2>
            <p className="text-gray-600">Here are the latest job openings and web page editors</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div

                    >
                      {job.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{job.company}</h3>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.position}</h4>
                  <p className="text-sm text-gray-600 mb-1">{job.type}</p>
                  <p className="text-sm text-gray-500 mb-4">{job.details}</p>

                  <div className="flex items-center justify-between ">

                    <Link href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjP962JmYqPAxUfdUEAHTM7ENIQFnoECBcQAQ&url=https%3A%2F%2Fwww.w3schools.com%2Fwhatis%2Fwhatis_frontenddev.asp&usg=AOvVaw3SncWkdmCYrFXwK-CEwsZe&opi=89978449">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm">Apply Now</Button>
                    </Link>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show more jobs button */}
          <div className="text-center mt-8">
            <Button className="px-8 bg-blue-800">
              View All Jobs
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}