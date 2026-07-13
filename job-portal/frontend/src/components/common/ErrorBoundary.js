import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import {
    BRAND, GRAD, SHADOW, FONT, btnPrimary, injectBrandStyles,
} from '../brand/brandTheme';

injectBrandStyles();

/**
 * App-level error boundary. Catches render/lifecycle errors in the tree
 * below it and shows a clean, brand-styled fallback instead of a white
 * screen or a raw stack trace. Wrap the app with this.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log for developers; never surfaced to end users.
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: GRAD.hero,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    fontFamily: FONT,
                    color: BRAND.ink,
                    boxSizing: 'border-box',
                }}
            >
                <div
                    style={{
                        background: BRAND.surface,
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 16,
                        boxShadow: SHADOW.lg,
                        padding: '40px 36px',
                        maxWidth: 440,
                        width: '100%',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: `${BRAND.crimson}14`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 22px',
                        }}
                    >
                        <AlertTriangle size={34} color={BRAND.crimson} strokeWidth={1.75} />
                    </div>

                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: BRAND.ink,
                            margin: '0 0 10px',
                            letterSpacing: '-0.4px',
                            fontFamily: FONT,
                        }}
                    >
                        Something went wrong
                    </h1>

                    <p
                        style={{
                            fontSize: 15,
                            color: BRAND.slate,
                            lineHeight: 1.7,
                            margin: '0 0 28px',
                        }}
                    >
                        Sorry about that an unexpected error occurred. Try reloading the
                        page, and if the problem keeps happening, head back home.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            alignItems: 'stretch',
                        }}
                    >
                        <button
                            className="brand-btn-primary"
                            onClick={this.handleReload}
                            style={{ ...btnPrimary, width: '100%' }}
                        >
                            <RefreshCw size={17} strokeWidth={2} /> Try again
                        </button>
                        <a
                            href="/"
                            className="brand-link"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 7,
                                color: BRAND.slate,
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: 'none',
                                padding: '8px 0',
                                fontFamily: FONT,
                            }}
                        >
                            <Home size={15} strokeWidth={2} /> Back to home
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
