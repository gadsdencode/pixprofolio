import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import weddingImage from "@assets/generated_images/Wedding_ceremony_sunset_silhouette_ba914041.png";
import portraitImage from "@assets/generated_images/Professional_portrait_headshot_woman_7f0f9989.png";
import landscapeImage from "@assets/generated_images/Mountain_lake_reflection_dawn_85a793e7.png";
import eventImage from "@assets/generated_images/Elegant_gala_dinner_event_528eb786.png";
import commercialImage from "@assets/generated_images/Luxury_watch_product_photography_8a6651e0.png";
import realtorImage from "@assets/generated_images/Modern_luxury_home_exterior_d6469a58.png";

const portfolioItems = [
  {
    id: 1,
    title: "Golden Hour Wedding",
    category: "Weddings",
    description: "Romantic outdoor ceremony at sunset",
    image: weddingImage,
  },
  {
    id: 2,
    title: "Natural Portrait",
    category: "Portraits",
    description: "Contemporary portrait session",
    image: portraitImage,
  },
  {
    id: 3,
    title: "Mountain Serenity",
    category: "Landscape",
    description: "Dawn reflection at alpine lake",
    image: landscapeImage,
  },
  {
    id: 4,
    title: "Elegant Gala",
    category: "Events",
    description: "Corporate event photography",
    image: eventImage,
  },
  {
    id: 5,
    title: "Luxury Timepiece",
    category: "Commercial",
    description: "Product photography for premium brand",
    image: commercialImage,
  },
  {
    id: 6,
    title: "Sunset Vows",
    category: "Weddings",
    description: "Beach wedding ceremony",
    image: weddingImage,
  },
  {
    id: 7,
    title: "Modern Dream Home",
    category: "Realtor/Home Photography",
    description: "Luxury residential property listing",
    image: realtorImage,
  },
  {
    id: 8,
    title: "Architectural Elegance",
    category: "Realtor/Home Photography",
    description: "Contemporary home exterior showcase",
    image: realtorImage,
  },
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  const categories = ["All", "Weddings", "Portraits", "Landscape", "Events", "Commercial", "Realtor/Home Photography"];

  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4" data-testid="text-page-title">
              Portfolio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of my recent work across various photography styles and projects.
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent" data-testid="tabs-category">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-accent"
                  data-testid={`tab-${category.toLowerCase()}`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                data-testid={`card-portfolio-${item.id}`}
              >
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
