import Footer from "@/components/layout/Footer";
import styles from "./globals.module.css";
import Header from "@/components/layout/Header";
import ModalProvider from "@/context/ModalContext";
import AuthProvider from "@/context/AuthContext";
import { fetchAuthMe } from "@/utils/api/fetchAuth";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const resAuthMe = await fetchAuthMe();

	return (
	<html lang="en">
		<body>
			<AuthProvider resAuthMe={resAuthMe}>
			<ModalProvider>
				<div className={styles.layout}>
					<header><Header/></header>
					<main>{children}</main>
				</div>
				<footer><Footer/></footer>
			</ModalProvider>
			</AuthProvider>
		</body>
	</html>
	);
}
