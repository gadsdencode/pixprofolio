import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  ChevronDown,
  Camera,
  Heart,
  Award,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  User,
  Settings,
  Zap,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import heroImage from "@assets/generated_images/Hero_landscape_sunset_mountains_d1b75bde.png";
import weddingImage from "@assets/generated_images/Wedding_ceremony_sunset_silhouette_ba914041.png";
import portraitImage from "@assets/generated_images/Professional_portrait_headshot_woman_7f0f9989.png";
import landscapeImage from "@assets/generated_images/Mountain_lake_reflection_dawn_85a793e7.png";
import eventImage from "@assets/generated_images/Elegant_gala_dinner_event_528eb786.png";
import commercialImage from "@assets/generated_images/Luxury_watch_product_photography_8a6651e0.png";
import realtorImage from "@assets/generated_images/Modern_luxury_home_exterior_d6469a58.png";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to my newsletter.",
    });
    setEmail("");
  };

  const services = [
    {
      title: "Weddings",
      description: "Capture your special day with timeless elegance. From intimate ceremonies to grand celebrations, I document every precious moment with artistry and emotion.",
      icon: Heart,
      image: weddingImage,
      color: "from-rose-400 to-pink-600"
    },
    {
      title: "Portraits",
      description: "Professional portraits that reveal your authentic self. Perfect for headshots, family photos, senior pictures, and personal branding.",
      icon: User,
      image: portraitImage,
      color: "from-blue-400 to-cyan-600"
    },
    {
      title: "Events",
      description: "Corporate galas, fundraisers, and special occasions captured with professionalism and creativity. Every detail documented beautifully.",
      icon: Sparkles,
      image: eventImage,
      color: "from-purple-400 to-indigo-600"
    },
    {
      title: "Commercial",
      description: "Elevate your brand with stunning product photography and commercial imagery that drives engagement and sales.",
      icon: Award,
      image: commercialImage,
      color: "from-amber-400 to-orange-600"
    },
    {
      title: "Landscape",
      description: "Fine art landscape photography showcasing nature's majesty. Perfect for home and office decor.",
      icon: Camera,
      image: landscapeImage,
      color: "from-green-400 to-emerald-600"
    },
    {
      title: "Real Estate",
      description: "Property photography that sells. Professional images that showcase homes and commercial spaces at their absolute best.",
      icon: Settings,
      image: realtorImage,
      color: "from-slate-400 to-gray-600"
    }
  ];

  const trustIndicators = [
    { icon: Award, text: "10+ Years Experience" },
    { icon: Camera, text: "5000+ Photos Captured" },
    { icon: Heart, text: "500+ Happy Clients" },
    { icon: Star, text: "4.9/5 Average Rating" }
  ];

  return (
    <Layout>
      {/* Hero Section - Full Screen with Photography Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-6 backdrop-blur-md bg-white/10 border-white/20 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Award-Winning Photography Since 2014
          </Badge>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight" data-testid="text-hero-title">
            Capturing Moments,
            <br />
            Creating Art
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional photography services for weddings, portraits, events, and commercial projects.
            Transform your memories into timeless treasures.
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full">
                <item.icon className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio">
              <Button
                size="lg"
                className="backdrop-blur-md bg-white text-black hover:bg-white/90 min-w-[200px] text-lg"
                data-testid="button-view-portfolio"
              >
                View Portfolio
                <Camera className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[200px] text-lg"
                data-testid="button-book-now"
              >
                Book a Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Star Rating Display */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/80">Loved by 500+ clients worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Featured In / Trust Badges Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Trusted by clients from leading companies worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Client {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Photography Specific */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Services</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              Photography Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From intimate moments to grand celebrations, I specialize in capturing life's most meaningful experiences
              with artistic vision and technical excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif font-medium">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="text-lg">
                View Full Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why Choose Me</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              The Alex Rivera Difference
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              More than just beautiful photos—an experience crafted with care, expertise, and artistry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Award-Winning Quality",
                description: "Recognized for excellence in photography with numerous industry awards and features in top publications."
              },
              {
                icon: Clock,
                title: "Quick Turnaround",
                description: "Receive your edited photos within 2-3 weeks. Preview gallery available within 48 hours of your session."
              },
              {
                icon: Shield,
                title: "Full Rights Included",
                description: "You own all the images with full commercial rights. No hidden fees or restrictions on usage."
              },
              {
                icon: Zap,
                title: "Seamless Experience",
                description: "From booking to delivery, enjoy a professional, stress-free experience with personalized attention."
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-primary" />
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
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, straightforward process from first contact to final delivery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary -z-10" 
                 style={{ width: 'calc(100% - 12rem)', margin: '0 6rem' }} />

            {[
              {
                step: "1",
                title: "Book Your Session",
                description: "Fill out the contact form or schedule a call. We'll discuss your vision, location preferences, and package options. Reserve your date with a simple deposit.",
                icon: Camera
              },
              {
                step: "2",
                title: "Photo Session",
                description: "Enjoy a relaxed, professional shoot at your chosen location. I'll guide you through poses and capture authentic moments that tell your story.",
                icon: Heart
              },
              {
                step: "3",
                title: "Receive & Enjoy",
                description: "Get your beautifully edited photos delivered through a private online gallery. Download, share, and order prints—all your images, all the rights.",
                icon: Sparkles
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-background rounded-2xl p-8 shadow-lg border-2 hover:border-primary transition-colors">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" className="text-lg">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing/Packages Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Investment</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              Photography Packages
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible options to fit your needs and budget. All packages include full-resolution images with commercial rights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Essential",
                price: "$500",
                description: "Perfect for portraits and small sessions",
                features: [
                  "1 hour photo session",
                  "Single location",
                  "20 edited high-res images",
                  "Online gallery",
                  "Full commercial rights",
                  "2 week delivery"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "$1,200",
                description: "Most popular for events and weddings",
                features: [
                  "4 hour coverage",
                  "Multiple locations",
                  "100+ edited high-res images",
                  "Online gallery + USB",
                  "Full commercial rights",
                  "Same-day preview (24-48hrs)",
                  "Engagement session included",
                  "Priority scheduling"
                ],
                popular: true
              },
              {
                name: "Premium",
                price: "$2,500",
                description: "Complete coverage for your special day",
                features: [
                  "8+ hour coverage",
                  "Unlimited locations",
                  "300+ edited high-res images",
                  "Premium online gallery",
                  "Full commercial rights",
                  "Same-day preview",
                  "Engagement + post-wedding session",
                  "Second photographer",
                  "Custom photo album"
                ],
                popular: false
              }
            ].map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-2'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-serif mb-2">{pkg.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{pkg.price}</span>
                  </div>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <div className="px-6 pb-6">
                  <Link href="/contact" className="block">
                    <Button 
                      className="w-full"
                      variant={pkg.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      Book This Package
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-12">
            Custom packages available for commercial projects • Flexible payment plans • Travel fees may apply
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              Client Love Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it—hear from couples and clients who've experienced the magic
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Michael",
                role: "Wedding Clients",
                content: "Alex captured our wedding day beyond our wildest dreams. Every photo tells a story and brings tears of joy. His artistic eye and professional approach made us feel comfortable and beautiful. Worth every penny!",
                rating: 5,
                category: "Wedding"
              },
              {
                name: "Jennifer Martinez",
                role: "Corporate Client",
                content: "I needed professional headshots for my company's rebrand. Alex was incredible—he made the whole team look polished and confident. The turnaround was lightning fast, and the quality exceeded expectations.",
                rating: 5,
                category: "Portrait"
              },
              {
                name: "The Thompson Family",
                role: "Family Portrait",
                content: "We've worked with many photographers, but Alex is truly special. He captured our family's personality perfectly and made the kids laugh throughout. We now have photos we'll treasure forever.",
                rating: 5,
                category: "Portrait"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <Heart className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="w-fit">{testimonial.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about booking and working with me
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How far in advance should I book?",
                answer: "For weddings, I recommend booking 6-12 months in advance, especially for peak season (May-October). For portraits and other sessions, 2-4 weeks notice is usually sufficient. However, I sometimes have last-minute availability, so don't hesitate to reach out!"
              },
              {
                question: "What's included in the package price?",
                answer: "All packages include professional editing, high-resolution digital images with full commercial rights, and a private online gallery for viewing and downloading. Wedding packages also include engagement sessions and travel within 50 miles. Custom albums and prints are available as add-ons."
              },
              {
                question: "Do you travel for destination shoots?",
                answer: "Absolutely! I love destination work and have photographed events across the US and internationally. Travel fees vary depending on location. For weddings over 100 miles away, travel and accommodation costs are added to the package price."
              },
              {
                question: "What happens if you're sick or unable to shoot?",
                answer: "Your peace of mind is important to me. I maintain professional liability insurance and have a network of talented photographers I trust. In the unlikely event of an emergency, I'll arrange a qualified replacement at no additional cost."
              },
              {
                question: "Can we see all the photos, not just the edited ones?",
                answer: "I deliver all the keeper shots that meet my quality standards, professionally edited. Outtakes (duplicates, test shots, unflattering moments) aren't included to maintain the story and quality of your gallery. You'll receive far more images than the package minimum."
              },
              {
                question: "How long until we receive our photos?",
                answer: "Standard turnaround is 2-3 weeks for most sessions, 3-4 weeks for weddings. You'll receive a sneak peek preview gallery within 48 hours. If you need photos rushed for a specific reason, expedited editing is available for an additional fee."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-2 rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
            Your story deserves to be told with artistry, emotion, and timeless elegance.
            Book your session today and let's capture memories that will last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 min-w-[200px] text-lg">
                Book Your Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[200px] text-lg">
                View My Work
                <Camera className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-white/70 text-sm">
            Limited availability • Booking now for 2025 • Flexible payment plans available
          </p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 border-t bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-serif font-medium mb-3">Stay Inspired</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to receive photography tips, latest work, and special offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
