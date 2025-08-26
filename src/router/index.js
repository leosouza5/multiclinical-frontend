import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";

const Login = () => import("../pages/auth/Login.vue");
const Forgot = () => import("../pages/auth/Forgot.vue");
const AppLayout = () => import("../layouts/AppLayout.vue");
const Dashboard = () => import("../pages/Dashboard.vue");
const UsersList = () => import("../pages/users/UsersList.vue");
const UserNew = () => import("../pages/users/UserForm.vue");
const ResetPassword = () => import("../pages/auth/ResetPassword.vue");
const ClinicsList = () => import("../pages/clinics/ClinicsList.vue");
const ClinicForm = () => import("../pages/clinics/ClinicForm.vue");
const ProceduresList = () => import('../pages/procedures/ProceduresList.vue');
const ProcedureForm = () => import('../pages/procedures/ProcedureForm.vue');



const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: Login, name: "login", meta: { public: true } },
    { path: "/forgot", component: Forgot, name: "forgot", meta: { public: true } },
    { path: "/reset", name: "reset", component: ResetPassword, meta: { public: true } },
    {
      path: "/",
      component: AppLayout,
      children: [
        { path: "", name: "dashboard", component: Dashboard },
        { path: "appointments", name: "appointments", component: () => null },
        { path: "users", name: "users", component: UsersList },
        { path: "users/new", name: "users.new", component: UserNew },
        { path: "users/:id/edit", name: "users.edit", component: UserNew },
        { path: "clinics", name: "clinics", component: ClinicsList },
        { path: "clinics/new", name: "clinics.new", component: ClinicForm },
        { path: "clinics/:id/edit", name: "clinics.edit", component: ClinicForm },
        { path: "procedures", name: "procedures", component: ProceduresList },
        { path: "procedures/new", name: "procedures.new", component: ProcedureForm },
        { path: "procedures/:id/edit", name: "procedures.edit", component: ProcedureForm },
        { path: "convenios", name: "convenios", component: () => import("../pages/convenios/ConveniosList.vue") },
        { path: "convenios/new", name: "convenios.new", component: () => import("../pages/convenios/ConveniosForm.vue") },
        { path: "convenios/:id/edit", name: "convenios.edit", component: () => import("../pages/convenios/ConveniosForm.vue") },
        { path: "tipos-atendimento", name: "tiposAtendimento", component: () => import("../pages/tiposAtendimento/TiposAtendimentoList.vue") },
        { path: "tipos-atendimento/new", name: "tiposAtendimento.new", component: () => import("../pages/tiposAtendimento/TipoAtendimentoForm.vue") },
        { path: "tipos-atendimento/:id/edit", name: "tiposAtendimento.edit", component: () => import("../pages/tiposAtendimento/TipoAtendimentoForm.vue") },

      ],
    },
  ],
});

router.beforeEach(authGuard);
export default router;
