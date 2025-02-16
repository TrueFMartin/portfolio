"use client";

import {Suspense, useEffect, useState} from 'react';
import {routes, protectedRoutes, roleRestrictedRoutes} from '@/app/resources';
import {Flex, Spinner, Input, Button, Heading} from '@/once-ui/components';
import NotFound from "@/app/[locale]/not-found";
import GoogleLoginButtons from "@/components/GoogleLoginButtons";
import {useSession} from '@/lib/auth-client';
import {redirect} from "next/navigation";
import {type PermissionType} from "@prisma/client";
import {usePathname} from "@/i18n/routing";
import {getRole} from "@/components/user/getRole";

interface RouteGuardProps {
    children: React.ReactNode;
    role: PermissionType;
    userId?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({children, role, userId}) => {
    const pathname = usePathname();
    const [isRouteEnabled, setIsRouteEnabled] = useState(false);
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const [roleStatus, setRoleStatus] = useState<'NOT_REQUIRED' | 'UNMET' | 'MET'>('NOT_REQUIRED');
    // const [password, setPassword] = useState('');
    // const [user, setUser] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    // const [userError, setUserError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    // const {
    //     data: session,
    //     isPending: isPending,
    // } = useSession();

    useEffect(() => {

        const requiredRoles: string[] = roleRestrictedRoutes[pathname as keyof typeof roleRestrictedRoutes] || [];

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
            setIsAuthenticated(!!userId);
            const requiresRole = requiredRoles.length > 0 && !requiredRoles.some(role => role === 'NONE');
            if (requiresRole) {
                if (requiredRoles.includes(role)) {
                    setRoleStatus('MET');
                } else {
                    setRoleStatus('UNMET');
                }
            } else {
                setRoleStatus('NOT_REQUIRED')
            }
        }
        setLoading(false);

    }, [pathname, role, userId]);

    // const handlePasswordSubmit = async () => {
    //     if (user.length < 5 || user.indexOf('@') === -1) {
    //         setUserError('Usernames must be a valid email address');
    //         setIsAuthenticated(false);
    //         return;
    //     }
    //     const response = await fetch('/api/authenticate', {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({password}),
    //     });
    //
    //     if (response.ok) {
    //         setIsAuthenticated(true);
    //         setPasswordError(undefined);
    //     } else {
    //         setPasswordError('Incorrect user or password');
    //     }
    // };

    if (loading) {
        return (
            <Flex fillWidth paddingY="128" justifyContent="center">
                <Spinner/>
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
                    This page is restricted to authorized users.
                </Heading>
                <GoogleLoginButtons/>
                {/*<Input*/}
                {/*    id={"user"}*/}
                {/*    label={"Enter username"}*/}
                {/*    type={"email"}*/}
                {/*    onLoad={() => setUserError(undefined)}*/}
                {/*    onChange={(e) => {*/}
                {/*        setUser(e.target.value);*/}
                {/*        setUserError(undefined);*/}
                {/*    }}*/}
                {/*    error={userError}*/}
                {/*>*/}

                {/*</Input>*/}
                {/*<Input*/}
                {/*    id="password"*/}
                {/*    type="password"*/}
                {/*    label="Enter password"*/}
                {/*    onLoad={() => setPasswordError(undefined)}*/}
                {/*    onChange={(e) => {*/}
                {/*        setPassword(e.target.value);*/}
                {/*        setPasswordError(undefined);*/}
                {/*    }}*/}
                {/*    onKeyUp={(event => {*/}
                {/*        if (event.key === 'Enter') {*/}
                {/*            handlePasswordSubmit();*/}
                {/*        }*/}
                {/*    })}*/}
                {/*    error={passwordError}/>*/}
                {/*<Button onClick={handlePasswordSubmit} size="l">*/}
                {/*    Submit*/}
                {/*</Button>*/}
            </Flex>
        );
    }

    if (roleStatus === 'UNMET') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.location.href = '/family/secure/user';
            }, 1000 * 5)
        })
        return <Flex>
            <Heading>You do not have the required permissions for this page, redirecting...</Heading>
            <Spinner/>
            <Button href={'/family/secure/user'}>Request Permission</Button>
        </Flex>
    }
    if (roleStatus === 'NOT_REQUIRED' || roleStatus === 'MET') {
        return <>{children}</>;
    }
};

export {RouteGuard};