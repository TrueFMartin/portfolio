"use client";

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/routing';
import { routes, protectedRoutes } from '@/app/resources';
import { Flex, Spinner, Input, Button, Heading } from '@/once-ui/components';
import NotFound from "@/app/[locale]/not-found";

interface RouteGuardProps {
    children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const pathname = usePathname();
    const [isRouteEnabled, setIsRouteEnabled] = useState(false);
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [userError, setUserError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performChecks = async () => {
            setLoading(true);
            setIsRouteEnabled(false);
            setIsPasswordRequired(false);
            setIsAuthenticated(false);

            const checkRouteEnabled = () => {
                if (!pathname) return false;

                if (pathname in routes) {
                    return routes[pathname as keyof typeof routes];
                }

                const dynamicRoutes = ['/blog', '/work', '/family'] as const;
                for (const route of dynamicRoutes) {
                    if (pathname?.startsWith(route) && routes[route]) {
                        return true;
                    }
                }

                return false;
            };

            const routeEnabled = checkRouteEnabled();
            setIsRouteEnabled(routeEnabled);

            if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
                setIsPasswordRequired(true);

                const response = await fetch('/api/check-auth');
                if (response.ok) {
                    setIsAuthenticated(true);
                }
            }

            setLoading(false);
        };

        performChecks();
    }, [pathname]);


    const handlePasswordSubmit = async () => {
        if (user.length < 5 || user.indexOf('@') === -1) {
            setUserError('Usernames must be a valid email address');
            setIsAuthenticated(false);
            return;
        }
        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            setPasswordError(undefined);
        } else {
            setPasswordError('Incorrect user or password');
        }
    };

    if (loading) {
        return (
        <Flex fillWidth paddingY="128" justifyContent="center">
            <Spinner />
        </Flex>
        );
    }

    if (!isRouteEnabled) {
        return (
            <NotFound></NotFound>
        );
    }

    if (isPasswordRequired && !isAuthenticated) {
        return (
        <Flex
            fillWidth paddingY="128" maxWidth={24} gap="24"
            justifyContent="center" direction="column" alignItems="center">
            <Heading align="center" wrap="balance">
                This page is password protected
            </Heading>
            <Input
                id={"user"}
                label={"Enter username"}
                type={"email"}
                onLoad={() => setUserError(undefined)}
                onChange={(e) => {
                    setUser(e.target.value);
                    setUserError(undefined);
                }}
                error={userError}
            >

            </Input>
            <Input
                id="password"
                type="password"
                label="Enter password"
                onLoad={() => setPasswordError(undefined)}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(undefined);
                }}
                onKeyUp={(event => {
                    if (event.key === 'Enter') {
                        handlePasswordSubmit();
                    }
                })}
                error={passwordError}/>
            <Button onClick={handlePasswordSubmit} size="l">
                Submit
            </Button>
        </Flex>
        );
    }

    return <>{children}</>;
};

export { RouteGuard };