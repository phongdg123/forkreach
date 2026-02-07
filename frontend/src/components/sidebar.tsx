"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FolderOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listDesigns, ProjectResponse } from "@/lib/api";
import { SidebarSkeleton } from "@/components/skeleton";

interface SidebarProps {
    onClose?: () => void;
}

interface ProjectSectionProps {
    title: string;
    projects: ProjectResponse[];
    onProjectClick: (projectId: string) => void;
}

// Generate a color based on design type
function getProjectColor(designType: string): string {
    return designType === "App" ? "#3b82f6" : "#8b5cf6";
}

// Get short title from prompt
function getShortTitle(prompt: string): string {
    const words = prompt.split(" ").slice(0, 4).join(" ");
    return words.length < prompt.length ? `${words}...` : words;
}

// Group projects by time period
function groupProjectsByTime(projects: ProjectResponse[]): {
    today: ProjectResponse[];
    last7Days: ProjectResponse[];
    last30Days: ProjectResponse[];
    older: ProjectResponse[];
} {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7DaysStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30DaysStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    const today: ProjectResponse[] = [];
    const last7Days: ProjectResponse[] = [];
    const last30Days: ProjectResponse[] = [];
    const older: ProjectResponse[] = [];

    projects.forEach((project) => {
        const createdAt = new Date(project.created_at);
        if (createdAt >= todayStart) {
            today.push(project);
        } else if (createdAt >= last7DaysStart) {
            last7Days.push(project);
        } else if (createdAt >= last30DaysStart) {
            last30Days.push(project);
        } else {
            older.push(project);
        }
    });

    return { today, last7Days, last30Days, older };
}

function ProjectSection({ title, projects, onProjectClick }: ProjectSectionProps) {
    if (projects.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-xs text-zinc-500 dark:text-zinc-500 mb-3 px-3">{title}</h3>
            <div className="space-y-1">
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() => onProjectClick(project.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left group"
                    >
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                            style={{ backgroundColor: getProjectColor(project.design_type) }}
                        >
                            <span className="text-white text-sm font-medium">
                                {project.prompt.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-zinc-700 dark:text-zinc-200 truncate group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                {getShortTitle(project.prompt)}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">{project.design_type}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <FolderOpen className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">No projects yet</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                Create your first design to see it here
            </p>
        </div>
    );
}

export function Sidebar({ onClose }: SidebarProps) {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Fetch projects from API
    useEffect(() => {
        async function fetchProjects() {
            try {
                setIsLoading(true);
                const data = await listDesigns();
                // Sort by created_at descending (newest first)
                const sortedProjects = data.projects.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setProjects(sortedProjects);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setError("Failed to load projects");
            } finally {
                setIsLoading(false);
            }
        }

        fetchProjects();

        // Refresh every 30 seconds
        const interval = setInterval(fetchProjects, 30000);
        return () => clearInterval(interval);
    }, []);

    // Filter projects by search query
    const filteredProjects = searchQuery.trim()
        ? projects.filter((project) =>
            project.prompt.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : projects;

    // Group projects by time
    const groupedProjects = groupProjectsByTime(filteredProjects);

    const handleProjectClick = (projectId: string) => {
        router.push(`/projects?id=${projectId}`);
        onClose?.();
    };

    return (
        <div className="w-64 md:w-72 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            {/* Header with close button on mobile */}
            <div className="flex items-center justify-between p-3 lg:hidden">
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">Projects</span>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 pt-0 lg:pt-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <Input
                        placeholder="Search projects"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-zinc-100 dark:bg-transparent border-0 text-zinc-700 dark:text-zinc-400 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
            </div>

            {/* Project List */}
            <ScrollArea className="flex-1 px-1">
                {isLoading ? (
                    <SidebarSkeleton />
                ) : error ? (
                    <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
                        {error}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <ProjectSection
                            title="Today"
                            projects={groupedProjects.today}
                            onProjectClick={handleProjectClick}
                        />
                        <ProjectSection
                            title="Last 7 days"
                            projects={groupedProjects.last7Days}
                            onProjectClick={handleProjectClick}
                        />
                        <ProjectSection
                            title="Last 30 days"
                            projects={groupedProjects.last30Days}
                            onProjectClick={handleProjectClick}
                        />
                        <ProjectSection
                            title="Older"
                            projects={groupedProjects.older}
                            onProjectClick={handleProjectClick}
                        />
                    </>
                )}
            </ScrollArea>
        </div>
    );
}
