import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Rocket,
  Camera,
  Menu,
  X,
  User,
  LogOut,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const { data: authStatus } = useQuery<{authenticated: boolean; user?: any}>({
    queryKey: ["/api/auth/status"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", { 
        method: "POST",
        credentials: "include"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      setLocation("/");
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/95 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaaS Pro
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent text-foreground"
                >
                  {link.label}
                </a>
              ))}
              
              {authStatus?.authenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 ml-2">
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">{authStatus.user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {authStatus.user?.email}
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={authStatus.user?.role === "owner" ? "/owner-dashboard" : "/client-dashboard"}>
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logoutMutation.mutate()}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 rounded-md hover:bg-accent text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {!authStatus?.authenticated && (
                  <>
                    <Link href="/login">
                      <div className="block px-4 py-2 rounded-md hover:bg-accent text-foreground" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </div>
                    </Link>
                    <Link href="/register">
                      <div className="block px-4 py-2 rounded-md hover:bg-accent text-foreground" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>1000+ active users</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Transform Your Business{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    With AI-Powered Solutions
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The only platform you need to streamline operations, boost productivity, 
                  and scale your business faster than ever before. See results in just 3 days.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Watch Demo
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-background flex items-center justify-center text-white font-semibold text-sm">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">4.9/5 from 1000+ reviews</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl shadow-2xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Product Demo Preview</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">+247%</p>
                      <p className="text-xs text-muted-foreground">Growth Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              Trusted by innovative companies worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-24 h-12 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded flex items-center justify-center text-xs font-bold text-white">
                    LOGO {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="services" className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Benefits</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Focus on how it helps users achieve their goals, not just features
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Get up and running in minutes, not days. Our platform is optimized for speed and performance.",
                  color: "from-yellow-400 to-orange-500"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level encryption and security measures to keep your data safe and compliant.",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  icon: TrendingUp,
                  title: "Grow Revenue",
                  description: "Increase conversions by up to 3x with our proven optimization strategies and tools.",
                  color: "from-green-400 to-emerald-600"
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Work seamlessly with your team with real-time updates and shared workspaces.",
                  color: "from-purple-400 to-pink-600"
                },
                {
                  icon: Target,
                  title: "Smart Analytics",
                  description: "Make data-driven decisions with powerful insights and actionable recommendations.",
                  color: "from-red-400 to-pink-600"
                },
                {
                  icon: Globe,
                  title: "Global Scale",
                  description: "Serve customers worldwide with our globally distributed infrastructure.",
                  color: "from-cyan-400 to-blue-600"
                }
              ].map((benefit, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">How it works?</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start seeing results in less than 10 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 -z-10" style={{ width: 'calc(100% - 12rem)', margin: '0 6rem' }} />
              
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Create your account in seconds with email or social login. No credit card required for trial.",
                  icon: User
                },
                {
                  step: "2",
                  title: "Configure",
                  description: "Customize your workspace with our intuitive setup wizard. Import your data seamlessly.",
                  icon: Clock
                },
                {
                  step: "3",
                  title: "Launch",
                  description: "Go live and start seeing results immediately. Our team is here to help every step of the way.",
                  icon: Rocket
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-background rounded-2xl p-8 shadow-lg border-2 hover:border-primary transition-colors">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {step.step}
                      </div>
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-center">{step.title}</h3>
                    <p className="text-muted-foreground text-center">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Pricing</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that's right for you. Upgrade or downgrade anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$100",
                  description: "Perfect for individuals and small teams",
                  features: [
                    "Up to 10 team members",
                    "5 projects included",
                    "Basic analytics",
                    "24/7 email support",
                    "1 GB storage"
                  ],
                  popular: false
                },
                {
                  name: "Pro",
                  price: "$200",
                  description: "Most popular for growing businesses",
                  features: [
                    "Up to 50 team members",
                    "Unlimited projects",
                    "Advanced analytics",
                    "Priority 24/7 support",
                    "50 GB storage",
                    "Custom integrations"
                  ],
                  popular: true
                },
                {
                  name: "Advanced",
                  price: "$300",
                  description: "For large enterprises with custom needs",
                  features: [
                    "Unlimited team members",
                    "Unlimited projects",
                    "Enterprise analytics",
                    "Dedicated support manager",
                    "Unlimited storage",
                    "Custom integrations",
                    "SLA guarantee"
                  ],
                  popular: false
                }
              ].map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-2'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Link href="/register" className="w-full">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-12">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Loved by People Worldwide
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our customers have to say about their experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "CEO at TechCorp",
                  content: "This platform has transformed how we work. Our productivity increased by 200% in just the first month. The ROI is incredible!",
                  rating: 5,
                  image: "SJ"
                },
                {
                  name: "Michael Chen",
                  role: "Product Manager at StartupXYZ",
                  content: "The best investment we've made this year. The customer support is outstanding and the features are exactly what we needed.",
                  rating: 5,
                  image: "MC"
                },
                {
                  name: "Emily Rodriguez",
                  role: "Founder at DesignHub",
                  content: "I was skeptical at first, but after trying it out, I'm blown away. It's intuitive, powerful, and saves us hours every week.",
                  rating: 5,
                  image: "ER"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {testimonial.image}
                      </div>
                      <div>
                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our platform
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How does the free trial work?",
                  answer: "You get full access to all Pro features for 14 days. No credit card required to start. You can cancel anytime during the trial period with no charges."
                },
                {
                  question: "Can I change my plan later?",
                  answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges accordingly."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes! We use bank-level encryption (AES-256) for all data. Our infrastructure is SOC 2 Type II certified and GDPR compliant. We perform regular security audits and never share your data with third parties."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service for any reason, contact us within 30 days of purchase for a full refund."
                },
                {
                  question: "How does customer support work?",
                  answer: "All plans include 24/7 email support. Pro and Advanced plans get priority support. Advanced plans also include a dedicated support manager and phone support."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-2 rounded-lg px-6 bg-background">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold text-lg">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90">
              Join thousands of companies already using our platform to scale faster and work smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-8 text-white/80 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-2 font-bold text-xl">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SaaS Pro
                </span>
              </a>
              <p className="text-sm text-muted-foreground">
                The all-in-one platform to streamline your business operations and accelerate growth.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Security", "Roadmap", "Changelog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and tips.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                  <Mail className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 SaaS Pro. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
