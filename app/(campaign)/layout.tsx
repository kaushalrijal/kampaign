import PaginationFooter from "@/components/shared/footer/footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        { children }
        <PaginationFooter />
    </>
  );
}