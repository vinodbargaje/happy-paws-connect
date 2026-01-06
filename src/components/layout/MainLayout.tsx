import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "./PageTransition";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
                <ErrorBoundary>
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
