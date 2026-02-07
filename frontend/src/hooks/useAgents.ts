"use client";

import { useState, useEffect, useCallback } from "react";

export interface Agent {
    id: string;
    name: string;
    icon: string;
    description: string;
    capabilities: string[];
}

// Default agents in case API fails
const defaultAgents: Agent[] = [
    {
        id: "auto",
        name: "Auto",
        icon: "✨",
        description: "Let AI choose the best agent",
        capabilities: [],
    },
    {
        id: "twitter",
        name: "Twitter/X",
        icon: "🐦",
        description: "Create Twitter threads and posts",
        capabilities: [],
    },
];

export function useAgents() {
    const [agents, setAgents] = useState<Agent[]>(defaultAgents);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgents = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/agents");

            if (!response.ok) {
                throw new Error("Failed to fetch agents");
            }

            const data = await response.json();

            // Add "auto" option at the beginning
            const agentsWithAuto: Agent[] = [
                {
                    id: "auto",
                    name: "Auto",
                    icon: "✨",
                    description: "Let AI choose the best agent for your request",
                    capabilities: ["Automatic routing", "Intent detection"],
                },
                ...data.agents,
            ];

            setAgents(agentsWithAuto);
            setError(null);
        } catch (err) {
            console.error("Error fetching agents:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            // Keep default agents on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    return {
        agents,
        isLoading,
        error,
        refetch: fetchAgents,
    };
}
