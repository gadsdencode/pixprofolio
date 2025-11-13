import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  featured: number;
  displayOrder: number;
  createdAt: Date | null;
}

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch all portfolio items for category extraction
  const { data: allPortfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio", "all"],
    queryFn: () => fetch("/api/portfolio").then((res) => res.json()),
  });

  // Fetch filtered portfolio items from API based on selected category
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio", selectedCategory],
    queryFn: () => {
      const url =
        selectedCategory === "All"
          ? "/api/portfolio"
          : `/api/portfolio?category=${selectedCategory}`;
      return fetch(url).then((res) => res.json());
    },
  });

  // Extract unique categories from all portfolio items
  const categories = ["All", ...Array.from(new Set(allPortfolioItems.map((item) => item.category)))];

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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No portfolio items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                  data-testid={`card-portfolio-${item.id}`}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.imageUrl}
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
          )}
        </div>
      </div>
    </Layout>
  );
}
