import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import photographerImage from "@assets/generated_images/Photographer_professional_portrait_f1a699a2.png";

export default function About() {
  const { user } = useAuth();
  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={photographerImage}
                alt={user ? `${user.name} - Photographer` : "Professional Photographer"}
                className="w-full max-w-md mx-auto rounded-2xl"
                data-testid="img-photographer"
              />
            </div>

            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6" data-testid="text-about-title">
                About {user ? "Me" : "Us"}
              </h1>
              
              <div className="space-y-6 text-base md:text-lg leading-relaxed text-foreground">
                <p>
                  {user ? (
                    <>Hi, I'm {user.name}, a passionate photographer based in the heart of California's scenic coastline.
                    For over a decade, I've been capturing life's most precious moments and transforming them into
                    timeless works of art.</>
                  ) : (
                    <>Welcome! We are passionate photographers based in the heart of California's scenic coastline.
                    For over a decade, we've been capturing life's most precious moments and transforming them into
                    timeless works of art.</>
                  )}
                </p>

                <p>
                  {user ? (
                    <>My journey into photography began with a simple camera and a love for storytelling. What started
                    as a hobby quickly evolved into a calling. I specialize in wedding photography, portraits, landscape,
                    and commercial work, always striving to find the perfect balance between technical excellence and
                    emotional resonance.</>
                  ) : (
                    <>Our journey into photography began with a simple camera and a love for storytelling. What started
                    as a hobby quickly evolved into a calling. We specialize in wedding photography, portraits, landscape,
                    and commercial work, always striving to find the perfect balance between technical excellence and
                    emotional resonance.</>
                  )}
                </p>

                <p className="text-muted-foreground">
                  {user ? (
                    <>Every photograph tells a story, and I believe in creating images that speak to the heart. Whether
                    it's the intimate glance between newlyweds, the quiet beauty of a mountain sunrise, or the
                    polished elegance of a product shoot, I approach each project with dedication, creativity, and an
                    eye for detail.</>
                  ) : (
                    <>Every photograph tells a story, and we believe in creating images that speak to the heart. Whether
                    it's the intimate glance between newlyweds, the quiet beauty of a mountain sunrise, or the
                    polished elegance of a product shoot, we approach each project with dedication, creativity, and an
                    eye for detail.</>
                  )}
                </p>

                <p>
                  {user ? (
                    <>When I'm not behind the camera, you'll find me exploring new hiking trails, experimenting with
                    film photography, or sharing my knowledge through workshops and online tutorials. I'm honored to
                    have worked with clients from around the world, and I look forward to helping you preserve your
                    special moments for generations to come.</>
                  ) : (
                    <>When we're not behind the camera, you'll find us exploring new hiking trails, experimenting with
                    film photography, or sharing our knowledge through workshops and online tutorials. We're honored to
                    have worked with clients from around the world, and we look forward to helping you preserve your
                    special moments for generations to come.</>
                  )}
                </p>

                <p className="text-muted-foreground italic">
                  "Photography is the art of frozen time... the ability to store emotion and feelings within a frame."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
