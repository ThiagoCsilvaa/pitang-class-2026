import { createFileRoute, Outlet, useLocation, redirect, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Fragment } from 'react/jsx-runtime'
import { checkAuth, useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { SessionExpiringModal } from "../../components/session-expiring-modal"

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        if (!checkAuth()){
            throw redirect({
                to: '/login',
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean)
    
    const navigate = useNavigate();
    const { isLoading, loggedUser } = useAuth();

    useEffect(() => {
        if (!isLoading && !loggedUser) {
        navigate({ to: '/login' });
        }
    }, [isLoading, loggedUser, navigate]);


    if (!loggedUser) return null;

    return (
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
                />
            <Breadcrumb>
                <BreadcrumbList>
                    {paths.map((path, index) => {
                        const lastPath = index + 1 === paths.length
                        return (
                            <Fragment key={index}>
                                <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbPage className={lastPath ? "font-bold capitalize" : ""}> {path} </BreadcrumbPage>
                                </BreadcrumbItem>

                                {!lastPath && (
                                    <BreadcrumbSeparator className="hidden md:block" />
                                )}
                            </Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
            </div>
            </header>
            <Outlet />
        </SidebarInset>
        <SessionExpiringModal />
        </SidebarProvider>
    )
}