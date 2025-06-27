import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "./globals.css";
import { Logo } from "@components/logo/Logo";

export const metadata = {
    title: {
        template: "%s | ShopNex",
        default: "ShopNex",
    },
    description: "ShopNex",
};

const navbar = (
    <Navbar
        logo={<Logo />}
        projectLink="https://github.com/shopnex-ai/shopnex"
    />
);
const footer = <Footer></Footer>;

export default async function RootLayout({ children }) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <body>
                <Layout
                    search={false}
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/shopnex-ai/shopnex"
                    footer={footer}
                    toc={{ backToTop: true }}
                    sidebar={{
                        toggleButton: true,
                        defaultMenuCollapseLevel: 1,
                    }}
                    feedback={{
                        content: "Question? Give us feedback →",
                        labels: "feedback",
                    }}
                    editLink={<>Edit this page on GitHub </>}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
}
