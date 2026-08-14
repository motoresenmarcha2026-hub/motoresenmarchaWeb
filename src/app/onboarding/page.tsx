import { redirect } from "next/navigation";
import { getUser, getPerfil } from "@/lib/auth/dal";
import { OnboardingForm } from "@/features/usuarios/components/OnboardingForm";

export const metadata = { title: "Completa tu cuenta — Motores en Marcha" };

export default async function OnboardingPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Si el perfil ya existe, no hay nada que completar.
  const perfil = await getPerfil();
  if (perfil) redirect(perfil.rol === "taller" ? "/panel/solicitudes" : "/");

  const meta = user.user_metadata ?? {};
  const nombreSugerido = (meta.full_name || meta.name || "") as string;

  return <OnboardingForm nombreSugerido={nombreSugerido} />;
}
