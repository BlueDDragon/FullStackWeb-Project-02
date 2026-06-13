import Footer from "@/components/layout/Footer";
import styles from "./globals.module.css";
import Header from "@/components/layout/Header";
import ModalProvider from "@/context/ModalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
	<html lang="en">
		<body>
			<ModalProvider>
				<div className={styles.layout}>
					<header><Header/></header>
					<main>{children}</main>
				</div>
				<footer><Footer/></footer>
			</ModalProvider>
		</body>
	</html>
	);
}
