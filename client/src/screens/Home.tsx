"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ZapIcon,
  PuzzleIcon,
  PlayIcon,
  Slack,
  Mail,
  Calendar,
  FileText,
  Github,
  Trello,
  Instagram,
  Twitter,
  Linkedin,
  Database,
  BarChart4,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  };

  // Define popular app logos for integration section
  const popularApps = [
    { name: "Slack", icon: <Slack className="h-6 w-6" /> },
    { name: "Gmail", icon: <Mail className="h-6 w-6" /> },
    { name: "Calendar", icon: <Calendar className="h-6 w-6" /> },
    { name: "Docs", icon: <FileText className="h-6 w-6" /> },
    { name: "GitHub", icon: <Github className="h-6 w-6" /> },
    { name: "Trello", icon: <Trello className="h-6 w-6" /> },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" /> },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" /> },
    { name: "Database", icon: <Database className="h-6 w-6" /> },
    { name: "Analytics", icon: <BarChart4 className="h-6 w-6" /> },
    { name: "Chat", icon: <MessageSquare className="h-6 w-6" /> },
  ];

  // Define productivity apps
  const productivityApps = [
    { name: "Slack", icon: <Slack className="h-6 w-6" /> },
    { name: "Trello", icon: <Trello className="h-6 w-6" /> },
    { name: "Github", icon: <Github className="h-6 w-6" /> },
    { name: "Docs", icon: <FileText className="h-6 w-6" /> },
    { name: "Calendar", icon: <Calendar className="h-6 w-6" /> },
    { name: "Mail", icon: <Mail className="h-6 w-6" /> },
    { name: "Database", icon: <Database className="h-6 w-6" /> },
    { name: "Analytics", icon: <BarChart4 className="h-6 w-6" /> },
    { name: "Chat", icon: <MessageSquare className="h-6 w-6" /> },
    { name: "Files", icon: <FileText className="h-6 w-6" /> },
    { name: "Projects", icon: <PuzzleIcon className="h-6 w-6" /> },
    { name: "Tasks", icon: <CheckCircle className="h-6 w-6" /> },
  ];

  // Define marketing apps
  const marketingApps = [
    { name: "Instagram", icon: <Instagram className="h-6 w-6" /> },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" /> },
    { name: "Mail", icon: <Mail className="h-6 w-6" /> },
    { name: "Analytics", icon: <BarChart4 className="h-6 w-6" /> },
    { name: "Chat", icon: <MessageSquare className="h-6 w-6" /> },
    { name: "Content", icon: <FileText className="h-6 w-6" /> },
    { name: "Calendar", icon: <Calendar className="h-6 w-6" /> },
    { name: "Projects", icon: <PuzzleIcon className="h-6 w-6" /> },
    { name: "Tasks", icon: <CheckCircle className="h-6 w-6" /> },
    { name: "Database", icon: <Database className="h-6 w-6" /> },
    { name: "Files", icon: <FileText className="h-6 w-6" /> },
  ];

  // Define sales apps
  const salesApps = [
    { name: "Mail", icon: <Mail className="h-6 w-6" /> },
    { name: "Calendar", icon: <Calendar className="h-6 w-6" /> },
    { name: "Chat", icon: <MessageSquare className="h-6 w-6" /> },
    { name: "Documents", icon: <FileText className="h-6 w-6" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" /> },
    { name: "Analytics", icon: <BarChart4 className="h-6 w-6" /> },
    { name: "Tasks", icon: <CheckCircle className="h-6 w-6" /> },
    { name: "Projects", icon: <PuzzleIcon className="h-6 w-6" /> },
    { name: "Database", icon: <Database className="h-6 w-6" /> },
    { name: "Files", icon: <FileText className="h-6 w-6" /> },
    { name: "Trello", icon: <Trello className="h-6 w-6" /> },
    { name: "Github", icon: <Github className="h-6 w-6" /> },
  ];

  // How it works steps with icons
  const howItWorksSteps = [
    {
      title: "1. Choose your trigger",
      description:
        "Select the event that starts your automation workflow, like receiving an email or a new form submission.",
      icon: <ZapIcon className="h-12 w-12 text-primary" />,
      image: "/placeholder.svg?height=200&width=300&text=Step 1",
    },
    {
      title: "2. Add actions",
      description:
        "Define what happens when your trigger is activated. Add multiple steps to create powerful workflows.",
      icon: <PuzzleIcon className="h-12 w-12 text-primary" />,
      image: "/placeholder.svg?height=200&width=300&text=Step 2",
    },
    {
      title: "3. Go live",
      description:
        "Activate your workflow and let FlowConnect handle the rest. Monitor performance in real-time.",
      icon: <PlayIcon className="h-12 w-12 text-primary" />,
      image: "/placeholder.svg?height=200&width=300&text=Step 3",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">
                  F
                </span>
              </div>
            </motion.div>
            <span className="text-xl font-bold">FlowConnect</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Integrations
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Templates
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Resources
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:text-primary">
              Log in
            </a>
            <Button onClick={() => navigate("/signup")}>Start for free</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center rounded-md p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="container pb-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-sm font-medium hover:text-primary">
                Features
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Integrations
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Pricing
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Templates
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Resources
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <a href="#" className="text-sm font-medium hover:text-primary">
                  Log in
                </a>
                <Button onClick={() => navigate("/signup")}>
                  Start for free
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </motion.div>

          <div className="container">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-8 lg:w-full"
              >
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  >
                    Automate your workflow{" "}
                    <span className="text-primary">without code</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    Connect your apps and automate workflows in minutes. No
                    coding required. FlowConnect makes it easy to connect the
                    tools you use every day.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col gap-4 sm:flex-row lg:w-full"
                >
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => navigate("/workflow")}
                  >
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Watch demo
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Free plan available</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Cancel anytime</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative flex items-center justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-xl">
                  <div className="flex h-12 items-center border-b bg-muted/50 px-4">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <img
                      src="/hero-flow-image.png"
                      width={600}
                      height={400}
                      alt="FlowConnect Dashboard"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="border-y bg-muted/40 py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-8"
            >
              <h2 className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Trusted by 10,000+ businesses
              </h2>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                {[
                  <Slack className="h-8 w-8" />,
                  <Github className="h-8 w-8" />,
                  <Trello className="h-8 w-8" />,
                  <Mail className="h-8 w-8" />,
                  <Calendar className="h-8 w-8" />,
                  <FileText className="h-8 w-8" />,
                ].map((logo, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                      {logo}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                variants={item}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                Features
              </motion.div>
              <motion.h2
                variants={item}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Everything you need to automate your work
              </motion.h2>
              <motion.p
                variants={item}
                className="max-w-[800px] text-muted-foreground md:text-xl"
              >
                FlowConnect helps you connect your favorite apps and automate
                workflows in minutes. No coding required.
              </motion.p>
            </motion.div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Easy Automation",
                  description:
                    "Create workflows that connect your apps and services without writing a single line of code.",
                  icon: "🔄",
                },
                {
                  title: "1,000+ Integrations",
                  description:
                    "Connect with all your favorite tools and apps, from Google and Microsoft to Slack and Trello.",
                  icon: "🔌",
                },
                {
                  title: "Custom Workflows",
                  description:
                    "Build custom workflows tailored to your specific needs with our intuitive drag-and-drop editor.",
                  icon: "✨",
                },
                {
                  title: "Powerful Logic",
                  description:
                    "Add conditional logic, filters, and formatters to create sophisticated automation workflows.",
                  icon: "🧠",
                },
                {
                  title: "Templates Library",
                  description:
                    "Get started quickly with pre-built templates for common business processes and workflows.",
                  icon: "📚",
                },
                {
                  title: "Real-time Monitoring",
                  description:
                    "Track the performance of your automations with detailed logs and real-time notifications.",
                  icon: "📊",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-y bg-muted/30 py-20 md:py-32">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                variants={item}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                How It Works
              </motion.div>
              <motion.h2
                variants={item}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Automate in three simple steps
              </motion.h2>
              <motion.p
                variants={item}
                className="max-w-[800px] text-muted-foreground md:text-xl"
              >
                Get started with FlowConnect in minutes. No technical skills
                required.
              </motion.p>
            </motion.div>

            <div className="mt-16">
              <div className="grid gap-8 md:grid-cols-3">
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-6">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        viewport={{ once: true }}
                        className="absolute -inset-4 -z-10 rounded-full bg-primary/5"
                      ></motion.div>
                      <div className="flex flex-col items-center">
                        {step.icon}
                        {/* <img
                          src={step.image || "/placeholder.svg"}
                          width={300}
                          height={200}
                          alt={step.title}
                          className="mt-4 rounded-lg"
                        /> */}
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                variants={item}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                Integrations
              </motion.div>
              <motion.h2
                variants={item}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Connect with your favorite apps
              </motion.h2>
              <motion.p
                variants={item}
                className="max-w-[800px] text-muted-foreground md:text-xl"
              >
                FlowConnect integrates with 1,000+ apps and services, so you can
                automate your entire tech stack.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Tabs defaultValue="popular" className="w-full">
                <div className="flex justify-center">
                  <TabsList>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="productivity">Productivity</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="popular" className="mt-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {popularApps.map((app, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          {app.icon}
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="productivity" className="mt-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {productivityApps.map((app, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          {app.icon}
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="marketing" className="mt-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {marketingApps.map((app, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          {app.icon}
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="sales" className="mt-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {salesApps.map((app, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          {app.icon}
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg" className="gap-2">
                View all integrations <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="border-y bg-muted/30 py-20 md:py-32">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                variants={item}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                Pricing
              </motion.div>
              <motion.h2
                variants={item}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Simple, transparent pricing
              </motion.h2>
              <motion.p
                variants={item}
                className="max-w-[800px] text-muted-foreground md:text-xl"
              >
                Choose the plan that's right for you and start automating your
                workflows today.
              </motion.p>
            </motion.div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Free",
                  price: "$0",
                  description:
                    "Perfect for individuals just getting started with automation.",
                  features: [
                    "5 active workflows",
                    "100 tasks per month",
                    "Standard integrations",
                    "Basic support",
                  ],
                  cta: "Get started",
                  popular: false,
                },
                {
                  title: "Pro",
                  price: "$29",
                  description:
                    "Ideal for professionals and small teams with advanced needs.",
                  features: [
                    "Unlimited workflows",
                    "2,000 tasks per month",
                    "Premium integrations",
                    "Priority support",
                    "Advanced logic",
                    "Team collaboration",
                  ],
                  cta: "Start free trial",
                  popular: true,
                },
                {
                  title: "Business",
                  price: "$99",
                  description:
                    "For organizations that need enterprise-grade automation.",
                  features: [
                    "Unlimited workflows",
                    "10,000 tasks per month",
                    "All integrations",
                    "24/7 support",
                    "Advanced security",
                    "Custom integrations",
                    "Dedicated account manager",
                  ],
                  cta: "Contact sales",
                  popular: false,
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative rounded-xl border ${
                    plan.popular ? "border-primary shadow-lg" : "shadow-sm"
                  } bg-background`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">{plan.title}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                variants={item}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                Testimonials
              </motion.div>
              <motion.h2
                variants={item}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Loved by businesses worldwide
              </motion.h2>
              <motion.p
                variants={item}
                className="max-w-[800px] text-muted-foreground md:text-xl"
              >
                See what our customers have to say about how FlowConnect has
                transformed their workflows.
              </motion.p>
            </motion.div>

            <div className="mt-16">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote:
                      "FlowConnect has saved our team countless hours of manual work. We've automated our entire customer onboarding process and it's been a game-changer.",
                    author: "Sarah Johnson",
                    role: "Operations Manager",
                    company: "TechCorp Inc.",
                    avatar: "/placeholder.svg?height=60&width=60",
                  },
                  {
                    quote:
                      "The ease of use is what sets FlowConnect apart. I was able to set up complex workflows without any technical knowledge. Their support team is also incredibly helpful.",
                    author: "Michael Chen",
                    role: "Marketing Director",
                    company: "GrowthLabs",
                    avatar: "/placeholder.svg?height=60&width=60",
                  },
                  {
                    quote:
                      "We've reduced our manual data entry by 85% since implementing FlowConnect. The ROI has been incredible, and we're just getting started with automation.",
                    author: "Emily Rodriguez",
                    role: "CTO",
                    company: "Innovate Solutions",
                    avatar: "/placeholder.svg?height=60&width=60",
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="rounded-xl border bg-background p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <span className="absolute -left-2 -top-2 text-4xl text-primary">
                          "
                        </span>
                        <p className="pt-4 text-muted-foreground">
                          {testimonial.quote}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          width={60}
                          height={60}
                          alt={testimonial.author}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-bold">{testimonial.author}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-20 md:py-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Ready to automate your workflows?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of businesses that use FlowConnect to save
                  time, reduce errors, and focus on what matters most.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Start your free trial <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule a demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40 py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">
                    F
                  </span>
                </div>
                <span className="text-xl font-bold">FlowConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Automate your workflows without code. Connect your favorite apps
                and services in minutes.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Legal
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FlowConnect. All rights
                reserved.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
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
