// components/app-sidebar.tsx
"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, Plus, MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConversationsContext } from "@/contexts/conversations-context";
import { useState } from "react";
import { ProductContextModal } from "@/components/product-context-modal";
import { useProductContext } from "@/hooks/useProductContext";

export function AppSidebar() {
    const pathname = usePathname();
    const { groupedConversations, navigateToNewChat, isLoaded } = useConversationsContext();
    const [productModalOpen, setProductModalOpen] = useState(false);
    const { activeProduct, saveProduct, isSaving } = useProductContext();

    const groups = groupedConversations();

    // Extract current chatId from pathname
    const currentChatId = pathname?.startsWith("/session/")
        ? pathname.split("/session/")[1]
        : null;

    return (
        <>
            <Sidebar variant="inset">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-2">
                        <h1 className="text-xl font-semibold " style={{ fontWeight: 900 }}>ForkReach</h1>
                    </div>

                    <div className="my-2 h-px w-full bg-sidebar-border" />

                    <Button className="w-full justify-center" onClick={navigateToNewChat}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start border-none"
                        onClick={() => setProductModalOpen(true)}
                    >
                        <Package className="h-4 w-4 mr-2" />
                        {activeProduct ? activeProduct.name : "Brand Setup"}
                    </Button>

                    <Button variant="outline" className="w-full justify-start border-none">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                        <kbd className="ml-auto inline-flex h-5 items-center rounded border bg-muted px-1.5 text-xs">
                            ⌘K
                        </kbd>
                    </Button>
                </SidebarHeader>

                <SidebarContent>
                    {!isLoaded ? (
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <div className="px-2 py-4 text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ) : groups.length === 0 ? (
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <div className="px-2 py-4 text-sm text-muted-foreground">
                                    No conversations yet. Click &quot;New Chat&quot; to start.
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ) : (
                        groups.map((group) => (
                            <SidebarGroup key={group.label}>
                                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.conversations.map((conversation) => (
                                            <SidebarMenuItem key={conversation.id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={currentChatId === conversation.id}
                                                >
                                                    <Link href={`/session/${conversation.id}`}>
                                                        <MessageSquare className="h-4 w-4" />
                                                        <span
                                                            style={{ fontWeight: 800 }}
                                                            className="truncate"
                                                        >
                                                            {conversation.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))
                    )}
                </SidebarContent>

                <SidebarRail />
            </Sidebar>

            <ProductContextModal
                open={productModalOpen}
                onOpenChange={setProductModalOpen}
                onSave={saveProduct}
                initialData={activeProduct}
                isSaving={isSaving}
            />
        </>
    );
}