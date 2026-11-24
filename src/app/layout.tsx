import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWTodos - Lista de tarefas",
  description:
    "Organize suas tarefas em uma lista simples, salva neste navegador.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
