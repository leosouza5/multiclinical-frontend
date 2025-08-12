import { useAuthStore } from "../stores/auth";

export async function authGuard(to) {
    if (to.meta?.public) return true;
    const auth = useAuthStore();
    console.log(auth.token);
    
    if (!auth.token) return { name: "login", query: { redirect: to.fullPath } };
    return true;
}
