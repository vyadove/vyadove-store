"use client";

import * as React from "react";
import { useState } from "react";

import { Check, Copy, Moon, Sun } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ColorToken = {
  name: string;
  cssVar: string;
  className: string;
  type: "bg" | "text" | "border";
  hex?: string;
  oklch?: string;
};

const COLORS: ColorToken[] = [
  {
    name: "Primary",
    cssVar: "--primary",
    className: "bg-primary text-primary-foreground",
    type: "bg",
    hex: "#225532",
    oklch: "oklch(0.42 0.08 160)",
  },
  {
    name: "Secondary",
    cssVar: "--secondary",
    className: "bg-secondary text-secondary-foreground",
    type: "bg",
    hex: "#F7F7F7",
    oklch: "oklch(0.97 0.01 260)",
  },
  {
    name: "Accent",
    cssVar: "--accent",
    className: "bg-accent text-accent-foreground",
    type: "bg",
    hex: "#FFB737",
    oklch: "oklch(0.82 0.16 77)",
  },
  {
    name: "Background",
    cssVar: "--background",
    className: "bg-background text-foreground",
    type: "bg",
    hex: "#F5F5F5 (approx)",
    oklch: "oklch(0.97 0.01 260)",
  },
  {
    name: "Card",
    cssVar: "--card",
    className: "bg-card text-card-foreground",
    type: "bg",
    hex: "#FFFFFF",
    oklch: "oklch(1 0 0)",
  },
  {
    name: "Muted",
    cssVar: "--muted",
    className: "bg-muted text-muted-foreground",
    type: "bg",
    hex: "#6F6F6F (fg approx)",
    oklch: "oklch(0.60 0.02 260)",
  },
];

const BG_SCALES = [
  {
    label: "Primary BG scale",
    prefix: "--primary-bg-",
    classPrefix: "bg-[color:var(--primary-bg-",
    hueLabel: "primary",
    tokens: [1, 2, 3, 4, 5],
  },
  {
    label: "Secondary BG scale",
    prefix: "--secondary-bg-",
    classPrefix: "bg-[color:var(--secondary-bg-",
    hueLabel: "secondary",
    tokens: [1, 2, 3, 4, 5],
  },
  {
    label: "Accent BG scale",
    prefix: "--accent-bg-",
    classPrefix: "bg-[color:var(--accent-bg-",
    hueLabel: "accent",
    tokens: [1, 2, 3, 4, 5],
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <Button
      className="h-7 w-7 rounded-full"
      onClick={handleCopy}
      size="icon"
      type="button"
      variant="ghost"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function ColorSwatch({ token }: { token: ColorToken }) {
  const { name, cssVar, className, hex, oklch } = token;
  const displayClass =
    token.type === "bg"
      ? className
      : token.type === "text"
        ? `text-[color:var(${cssVar})]`
        : `border-[color:var(${cssVar})]`;

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className={`h-16 ${displayClass}`} />
      <CardContent className="space-y-1 p-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{name}</span>
          <CopyButton value={cssVar} />
        </div>
        <div className="text-muted-foreground flex justify-between gap-2 text-[11px]">
          <span>{cssVar}</span>
        </div>
        {hex && (
          <div className="text-muted-foreground flex justify-between gap-2 text-[11px]">
            <span>HEX: {hex}</span>
          </div>
        )}
        {oklch && (
          <div className="text-muted-foreground flex justify-between gap-2 text-[11px]">
            <span>OKLCH: {oklch}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BackgroundScaleRow({
  label,
  prefix,
  tokens,
}: {
  label: string;
  prefix: string;
  tokens: number[];
}) {
  return (
    <Card>
      <CardHeader className="px-3 py-3">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-3">
        <div className="grid grid-cols-5 gap-2">
          {tokens.map((t) => {
            const style = { backgroundColor: `var(${prefix}${t})` };

            return (
              <div
                className="border-border/40 flex h-14 flex-col items-center justify-center rounded-md border text-[10px]"
                key={t}
                style={style}
              >
                <span className="font-semibold">{t}</span>
                <span className="text-muted-foreground text-[10px]">
                  {prefix}
                  {t}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ThemePreviewPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-background text-foreground min-h-screen transition-colors">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Vyadove Theme Preview
              </h1>
              <p className="text-muted-foreground text-sm">
                Live preview of your OKLCH-based color system and shadcn UI
                components (light & dark).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs">
                {dark ? "Dark mode" : "Light mode"}
              </span>
              <Button
                className="rounded-full"
                onClick={() => setDark((p) => !p)}
                size="icon"
                type="button"
                variant="outline"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>

          <Separator />

          {/* Tabs for Colors / Components */}
          <Tabs className="space-y-8" defaultValue="colors">
            <TabsList>
              <TabsTrigger value="colors">Colors & Tokens</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="layouts">Layout Samples</TabsTrigger>
            </TabsList>

            {/* COLORS TAB */}
            <TabsContent className="space-y-8" value="colors">
              {/* Core palette */}
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Core palette</h2>
                <p className="text-muted-foreground text-sm">
                  Primary, secondary, accent, background and card surfaces based
                  on your Behance furniture e-commerce design.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {COLORS.map((c) => (
                    <ColorSwatch key={c.name} token={c} />
                  ))}
                </div>
              </section>

              {/* Background scales */}
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">
                  Background scales (OKLCH tints)
                </h2>
                <p className="text-muted-foreground text-sm">
                  Soft background tints derived from primary, secondary and
                  accent for sections, strips, and subtle brand areas.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {BG_SCALES.map((s) => (
                    <BackgroundScaleRow
                      key={s.label}
                      label={s.label}
                      prefix={s.prefix}
                      tokens={s.tokens}
                    />
                  ))}
                </div>
              </section>

              {/* Light vs Dark note */}
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Light vs Dark</h2>
                <p className="text-muted-foreground text-sm">
                  Flip the theme toggle above to verify your tokens in both
                  modes. Values are driven by CSS variables, so Tailwind classes
                  like{" "}
                  <code className="bg-muted rounded px-1 py-0.5 text-xs">
                    bg-primary
                  </code>{" "}
                  automatically adapt.
                </p>
              </section>
            </TabsContent>

            {/* COMPONENTS TAB */}
            <TabsContent className="space-y-10" value="components">
              {/* Buttons & Badges */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Buttons & stateful styles
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Primary, secondary, accent and destructive variants using
                    your theme tokens.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/80">
                    Accent
                  </Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge className="bg-accent text-accent-foreground">
                    Accent
                  </Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </section>

              {/* Form controls */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Form controls</h2>
                  <p className="text-muted-foreground text-sm">
                    Inputs, switches, checkboxes and radios with themed borders,
                    focus rings and text.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Text inputs & select
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          className="w-full"
                          id="email"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                          className="w-full"
                          id="search"
                          placeholder="Search products..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select defaultValue="furniture">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="decor">Decor</SelectItem>
                            <SelectItem value="lighting">Lighting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Switches, checkboxes & radios
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Newsletter</Label>
                          <p className="text-muted-foreground text-xs">
                            Get updates about new arrivals.
                          </p>
                        </div>
                        {/*<Switch defaultChecked />*/}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox defaultChecked id="stock" />
                        <Label className="text-sm" htmlFor="stock">
                          Only show items in stock
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Sort by</Label>
                        <RadioGroup defaultValue="popular">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id="popular" value="popular" />
                            <Label className="text-sm" htmlFor="popular">
                              Popular
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id="price" value="price" />
                            <Label className="text-sm" htmlFor="price">
                              Price
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Alerts & Feedback */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Alerts & feedback</h2>
                  <p className="text-muted-foreground text-sm">
                    Quick visual check of how your theme handles status states.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Alert className="border-primary/60">
                    <AlertTitle>Primary alert</AlertTitle>
                    <AlertDescription>
                      Uses primary border and subtle text.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-accent/10 border-accent/50 text-accent-foreground">
                    <AlertTitle>Accent alert</AlertTitle>
                    <AlertDescription>
                      Great for promotions or info messages.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertTitle>Error alert</AlertTitle>
                    <AlertDescription>
                      Destructive styles for error states.
                    </AlertDescription>
                  </Alert>
                </div>
              </section>

              {/* Dialog, Avatar, Table */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Dialog, avatar & data table
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Common components using your card, border and background
                    tokens.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Dialog & avatar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        {/*<Avatar>
                          <AvatarImage alt="Vyadove user" src="" />
                          <AvatarFallback>VD</AvatarFallback>
                        </Avatar>*/}
                        <div>
                          <p className="text-sm font-medium">Henok Getachew</p>
                          <p className="text-muted-foreground text-xs">
                            Premium customer
                          </p>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Open dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dialog preview</DialogTitle>
                            <DialogDescription>
                              Check that cards, backgrounds and borders feel
                              right with your theme.
                            </DialogDescription>
                          </DialogHeader>
                          <p className="text-muted-foreground text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Phasellus aliquet mollis lorem.
                          </p>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Table (products snapshot)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="w-[70px]">Stock</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Cozy Chair</TableCell>
                            <TableCell>
                              <Badge variant="secondary">24</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              $149.00
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Wooden Desk</TableCell>
                            <TableCell>
                              <Badge className="bg-accent text-accent-foreground">
                                8
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              $329.00
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Floor Lamp</TableCell>
                            <TableCell>
                              <Badge variant="outline">Out</Badge>
                            </TableCell>
                            <TableCell className="text-right">$89.00</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </TabsContent>

            {/* LAYOUTS TAB */}
            <TabsContent className="space-y-8" value="layouts">
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    E-commerce layout preview
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    A simple landing layout using primary, secondary and accent
                    backgrounds inspired by your Behance furniture concept.
                  </p>
                </div>

                <Card className="border-border/60 overflow-hidden">
                  <div className="bg-primary-bg-2 border-border/50 border-b px-6 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                          Vyadove / Furniture
                        </p>
                        <h3 className="text-lg font-semibold sm:text-xl">
                          Modern comfort, timeless design
                        </h3>
                      </div>
                      <Button
                        className="bg-accent text-accent-foreground hover:bg-accent/80"
                        size="sm"
                      >
                        Shop collection
                      </Button>
                    </div>
                  </div>

                  <CardContent className="bg-secondary-bg-2 space-y-6 p-6">
                    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                      {/* Main product card */}
                      <Card className="bg-card shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">
                            Highlighted product
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="bg-secondary-bg-3 h-40 rounded-lg" />
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold">
                                Cozy Lounge Chair
                              </p>
                              <p className="text-muted-foreground text-xs">
                                Forest green / oak
                              </p>
                            </div>
                            <p className="text-sm font-semibold">$229.00</p>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <Button className="flex-1" size="sm">
                              Add to cart
                            </Button>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant="outline"
                            >
                              View details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Sidebar summary */}
                      <div className="space-y-4">
                        <Card className="bg-primary-bg-1 border-primary/30">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">
                              Free interior styling
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-muted-foreground space-y-2 text-xs">
                            <p>
                              Book a quick call with our stylists to match your
                              furniture with your space.
                            </p>
                            <Button
                              className="w-full"
                              size="sm"
                              variant="outline"
                            >
                              Book a call
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-accent-bg-1 border-accent/30">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">
                              Limited-time offer
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-muted-foreground space-y-2 text-xs">
                            <p>
                              10% off green & wood collections this week only.
                            </p>
                            <Badge className="bg-accent text-accent-foreground">
                              SAVE10
                            </Badge>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
