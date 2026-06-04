import Footer from "@/components/layout/Footer";
import styles from "./globals.module.css";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
	<html lang="en">
		<body>
			<div className={styles.layout}>
				<header><Header/></header>
				<main>{children}</main>
			</div>
			<footer><Footer/></footer>
		</body>
	</html>
	);
}
