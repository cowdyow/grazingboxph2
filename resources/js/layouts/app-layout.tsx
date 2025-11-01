import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
}

interface PageProps {
    flash?: FlashMessages;
    [key: string]: any;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { props: pageProps } = usePage<PageProps>();
    const { flash } = pageProps;
    
    useEffect(() => {
        if (!flash) return;

        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.warning) toast.error(flash.warning);
    }, [flash]);

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <div className="p-4">{children}</div>
            </AppLayoutTemplate>

            
            <Toaster position="bottom-right" richColors />
        </>
    );
}
