import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wibl | Simply connected AI Agents",
    description: "Build AI agents through conversation. No code required. Deploy to Web, WhatsApp, Slack, and more in minutes.",
    openGraph: {
        title: "Wibl | Build AI Agents Without Code",
        description: "The world's first conversational agent builder. Effortless AI creation.",
        images: ["/brand/og-image.png"],
    },
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
