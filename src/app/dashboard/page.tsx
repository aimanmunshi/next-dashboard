"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import { KpiCard } from "@/components/ui/kpi-card";
import { Folder, Wrench, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ShieldCheck } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { LogIn } from "lucide-react";
import {
  getTasks,
  addTask,
  toggleTaskComplete,
  deleteTask,
} from "@/lib/firestore-tasks";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust path if needed

type Task = {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
};

export default function Page() {
  const [userName, setUserName] = useState<string>("User");
  const [authProvider, setAuthProvider] = useState<string>("Unknown");
  const [accountCreated, setAccountCreated] = useState<string>("—");
  const [lastLogin, setLastLogin] = useState<string>("—");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const auth = getAuth();
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchTasks = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const allTasks = await getTasks(user.uid);
        setTasks(allTasks);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "User");

        const providerId = user.providerData[0]?.providerId || "unknown";
        let readableProvider = providerId;
        if (providerId === "google.com") readableProvider = "Google";
        else if (providerId === "password") readableProvider = "Email";
        else if (providerId === "github.com") readableProvider = "GitHub";
        setAuthProvider(readableProvider);

        // ✅ Get creation date
        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const date = new Date(creationTime);
          const formatted = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          setAccountCreated(formatted);
        }
        const lastLoginTime = user.metadata?.lastSignInTime;
        if (lastLoginTime) {
          const date = new Date(lastLoginTime);
          const formatted = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          setLastLogin(formatted);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !user) return;

    try {
      const taskId = await addTask(user.uid, newTaskTitle);
      setTasks((prev) => [
        ...prev,
        { id: taskId, uid: user.uid, title: newTaskTitle, status: "Pending" },
      ]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleStatus = async (
    taskId: string,
    currentStatus: Task["status"]
  ) => {
    const newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : "Pending";
    await toggleTaskComplete(taskId, newStatus);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* Left: Sidebar + Breadcrumb */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right: Mode Toggle */}
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here’s a quick overview of your dashboard
          </p>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard
              title="Account Created"
              value={accountCreated}
              icon={<CalendarClock />}
              subtext="User registration date"
            />

            <KpiCard
              title="Auth Provider"
              value={authProvider}
              icon={<ShieldCheck />}
              subtext="via Firebase"
            />

            <KpiCard
              title="Last Login"
              value={lastLogin}
              icon={<LogIn />}
              subtext="Previous session timestamp"
            />
          </div>
          {/* Main Analytics Panel */}

          <div className="rounded-xl bg-muted/40 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">📝 Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Track your to-dos.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="text-sm rounded-md border px-3 py-1 bg-background text-foreground"
                  placeholder="New task title"
                />
                <button
                  onClick={handleAddTask}
                  className="bg-primary text-black px-3 py-1 text-sm rounded-md"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Task</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/20">
                      <td className="py-2 px-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(task.id, task.status)
                          }
                          className="text-xs font-medium"
                        >
                          {task.status}
                        </button>
                      </td>
                      <td className="py-2 px-3">{task.title}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-sm text-muted-foreground hover:text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-muted-foreground mt-3">
              {tasks.length} task(s) listed.
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
