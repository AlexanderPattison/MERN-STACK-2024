import { Providers } from './providers'
import '../src/globals.css'

export const metadata = {
    title: 'Your E-commerce App',
    description: 'An amazing e-commerce experience',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}