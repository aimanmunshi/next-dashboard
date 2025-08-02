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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { deleteAllTasksForUser } from "@/lib/firestore-tasks";
import { CircleEllipsis } from "lucide-react";
import { Input } from "@/components/ui/input";

export type Task = {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
  uid: string;
  createdAt?: Date; // Optional: Firestore timestamp (or use `Timestamp` from `firebase/firestore`)
};

export default function Page() {
  const [userName, setUserName] = useState<string>("User");
  const [authProvider, setAuthProvider] = useState<string>("Unknown");
  const [accountCreated, setAccountCreated] = useState<string>("—");
  const [lastLogin, setLastLogin] = useState<string>("—");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const auth = getAuth();
  const user = getAuth().currentUser;
  const [newTaskStatus, setNewTaskStatus] = useState<
    "Pending" | "In Progress" | "Completed"
  >("Pending");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedTasks = await getTasks(user.uid);
        setTasks(fetchedTasks);
      } else {
        setTasks([]); // Clear tasks when user logs out
      }
    });

    return () => unsubscribe();
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
      const taskId = await addTask(user.uid, newTaskTitle, newTaskStatus); // ✅ pass status here
      setTasks((prev) => [
        ...prev,
        {
          id: taskId,
          uid: user.uid,
          title: newTaskTitle,
          status: newTaskStatus, // ✅ use selected value
        },
      ]);
      setNewTaskTitle("");
      setNewTaskStatus("Pending"); // optional reset
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
            Welcome back, {userName}
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
                <h3 className="text-lg font-semibold">Tasks</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="text-sm rounded-md border px-3 py-1 bg-background text-foreground w-25"
                  placeholder="New task"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-25 h-9 justify-between"
                    >
                      {newTaskStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setNewTaskStatus("Pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setNewTaskStatus("In Progress")}
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setNewTaskStatus("Completed")}
                    >
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={handleAddTask}
                  className="px-2 py-1 text-sm h-9"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="py-2 px-3 text-left w-24">Status</th>
                    <th className="py-2 px-3 text-left w-64">Task</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/20">
                      <td className="py-2 px-3 w-24 max-w-[6rem] whitespace-nowrap overflow-hidden text-ellipsis text-right">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            handleToggleStatus(task.id, task.status)
                          }
                          className="text-xs font-medium w-full truncate"
                        >
                          {task.status}
                        </Button>
                      </td>

                      <td className="py-2 px-3 w-64 max-w-[16rem] whitespace-nowrap overflow-hidden text-ellipsis">
                        {task.title}
                      </td>

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

            <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
              <span>{tasks.length} task(s) listed.</span>
              <Button
                className="w-35 h-9"
                variant="destructive"
                size="sm"
                onClick={async () => {
                  const user = getAuth().currentUser;
                  if (!user) return;
                  const confirmed = confirm(
                    "Are you sure you want to delete all tasks?"
                  );
                  if (!confirmed) return;

                  try {
                    await deleteAllTasksForUser(user.uid);
                    setTasks([]); // clear local state
                  } catch (err) {
                    console.error("Error deleting all tasks:", err);
                  }
                }}
              >
                Delete All Tasks
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
