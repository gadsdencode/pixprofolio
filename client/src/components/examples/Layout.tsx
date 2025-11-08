import { Layout } from "../Layout";

export default function LayoutExample() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold">Example Content</h1>
        <p className="mt-4 text-muted-foreground">
          This is example content to demonstrate the layout component.
        </p>
      </div>
    </Layout>
  );
}
