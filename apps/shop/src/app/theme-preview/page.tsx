"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon } from "lucide-react";

export default function ThemePreviewPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground p-10 space-y-10 transition-colors">

        {/* Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        {/* Colors Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🎨 Color Tokens</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { name: "Primary", class: "bg-primary text-primary-foreground" },
              { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
              { name: "Accent", class: "bg-accent text-accent-foreground" },
              { name: "Muted", class: "bg-muted text-muted-foreground" },
              { name: "Card", class: "bg-card text-card-foreground" },
              { name: "Background", class: "bg-background text-foreground border" },
              { name: "Border", class: "bg-border" },
            ].map((c) => (
              <div
                key={c.name}
                className={`p-6 rounded-lg border shadow-sm flex items-center justify-center text-center text-sm font-medium ${c.class}`}
              >
                {c.name}
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">🟩 Buttons</h2>

          <div className="flex gap-4 flex-wrap">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/80">
              Accent
            </Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">🗂 Cards</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a card component showing your theme colors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-32 rounded bg-secondary" />
                <Button className="w-full">Add to Cart</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accent Card</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  NEW
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">⌨ Inputs</h2>

          <div className="space-y-4 max-w-sm">
            <Input placeholder="Input field" />
            <Input placeholder="Search…" className="border-primary" />
          </div>
        </section>

        {/* Alerts */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">⚠ Alerts</h2>

          <Alert className="border border-primary/50">
            <AlertTitle>Primary Alert</AlertTitle>
            <AlertDescription>
              This uses your primary color variables.
            </AlertDescription>
          </Alert>

          <Alert className="bg-accent/10 border-accent/40">
            <AlertTitle>Accent Alert</AlertTitle>
            <AlertDescription>
              Accent colors appear here.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>
              Something went wrong.
            </AlertDescription>
          </Alert>
        </section>

        {/* Sidebar Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-4">📚 Sidebar</h2>

          <div className="border rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-4">
            <aside className="bg-sidebar text-sidebar-foreground p-4 space-y-3 sm:col-span-1">
              <div className="text-lg font-semibold">Navigation</div>
              <div className="p-2 rounded bg-sidebar-primary text-sidebar-primary-foreground">
                Dashboard
              </div>
              <div className="p-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                Settings
              </div>
              <div className="p-2 rounded">Reports</div>
            </aside>

            <div className="p-6 sm:col-span-3">
              <h3 className="text-xl font-semibold mb-2">Content Area</h3>
              <p className="text-muted-foreground">
                This simulates how your sidebar & content area work together.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
