import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "./globals.css";
import { Logo } from "@components/logo/Logo";

export const metadata = {
    title: {
        template: "%s | Reactour",
        default: "Reactour",
    },
    description: "Tourist Guide into your React Components",
};

const navbar = (
    <Navbar
        logo={<Logo />}
        projectLink="https://github.com/elrumordelaluz/reactour"
    />
);
const footer = <Footer></Footer>;

export default async function RootLayout({ children }) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <body>
                <Layout
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/elrumordelaluz/reactour/tree/main/apps/docs"
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
