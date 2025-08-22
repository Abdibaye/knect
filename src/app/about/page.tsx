import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Calendar, Target, Heart, Lightbulb, GraduationCap, Coffee } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 to-secondary/10">
                <div className="max-w-4xl mx-auto">
                    <Badge variant="secondary" className="mb-4">
                        About CampusConnect
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Connecting University Students <span className="text-primary">Across Campus</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                        Building meaningful connections between university students through shared interests, study groups, events,
                        and collaborative opportunities. Your campus community, reimagined.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="font-semibold">
                            Join Your Campus
                        </Button>
                        <Button variant="outline" size="lg">
                            Explore Communities
                        </Button>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Target className="h-8 w-8 text-primary" />
                                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    To bridge the gap between university students by creating a vibrant digital community where students
                                    can discover like-minded peers, form study groups, share experiences, and build lasting friendships
                                    that enhance their academic and social journey.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Lightbulb className="h-8 w-8 text-primary" />
                                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    A connected campus where no student feels isolated, where collaboration thrives, and where every
                                    university experience is enriched through meaningful peer connections, shared learning, and a strong
                                    sense of belonging.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose CampusConnect?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover how we're transforming the university experience through meaningful student connections and
                            collaborative opportunities.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle>Study Groups</CardTitle>
                                <CardDescription>
                                    Find classmates for group study sessions, project collaborations, and exam preparation
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle>Interest Communities</CardTitle>
                                <CardDescription>
                                    Connect with students who share your hobbies, interests, and academic passions
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle>Campus Events</CardTitle>
                                <CardDescription>
                                    Discover and organize campus events, meetups, and social activities with fellow students
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-12">Our Campus Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">25K+</div>
                            <div className="text-muted-foreground">Connected Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">150+</div>
                            <div className="text-muted-foreground">Universities</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">5K+</div>
                            <div className="text-muted-foreground">Study Groups</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">92%</div>
                            <div className="text-muted-foreground">Student Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
                        <p className="text-xl text-muted-foreground">The principles that guide our student community</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Inclusive Community</h3>
                                <p className="text-muted-foreground">
                                    Every student deserves to feel welcomed and valued, regardless of their background or interests.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Peer Support</h3>
                                <p className="text-muted-foreground">
                                    Students helping students through academic challenges, personal growth, and campus life.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <GraduationCap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Academic Excellence</h3>
                                <p className="text-muted-foreground">
                                    Fostering collaborative learning environments that help students achieve their academic goals.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Coffee className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Authentic Connections</h3>
                                <p className="text-muted-foreground">
                                    Building genuine friendships and professional networks that last beyond graduation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Connect with Your Campus?</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of students who are already building meaningful connections and enhancing their university
                        experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="font-semibold">
                            Find Your Community
                        </Button>
                        <Button variant="outline" size="lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}