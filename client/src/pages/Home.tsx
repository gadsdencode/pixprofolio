import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_landscape_sunset_mountains_d1b75bde.png";

export default function Home() {
  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6" data-testid="text-hero-title">
            Capturing Moments,
            <br />
            Creating Art
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Professional photography services for weddings, portraits, events, and commercial projects.
            Let's create something beautiful together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[160px]"
                data-testid="button-view-portfolio"
              >
                View Portfolio
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[160px]"
                data-testid="button-book-now"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </div>
    </Layout>
  );
}
