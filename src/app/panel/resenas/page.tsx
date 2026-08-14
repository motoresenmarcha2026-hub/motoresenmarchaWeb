import { Star } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { ListaResenas } from "@/features/resenas/components/ListaResenas";
import { Rating } from "@/components/ui/Rating";
import { requirePerfil } from "@/lib/auth/dal";
import { getTallerDelUsuario } from "@/features/talleres/data";
import { getResenas } from "@/features/resenas/data";

export default async function PanelResenasPage() {
  const perfil = await requirePerfil();
  const taller = await getTallerDelUsuario();
  const resenas = taller ? await getResenas(taller.id) : [];

  return (
    <DashboardShell
      profile={{
        nombre: taller?.nombre ?? perfil.nombre ?? "Mi taller",
        subtitulo: taller?.ubicacion.ciudad ?? perfil.ciudad ?? "",
        avatarUrl: taller?.avatarUrl || undefined,
        badge: taller?.disponibilidad === "available" ? "Disponible" : "Ocupado",
      }}
      navKey="taller"
    >
      {!taller || resenas.length === 0 ? (
        <EstadoVacio
          icono={Star}
          titulo="Aún no tienes reseñas"
          descripcion="Cuando tus clientes califiquen sus servicios, sus reseñas aparecerán aquí y en tu perfil público."
        />
      ) : (
        <div className="flex flex-col gap-md">
          <div className="flex flex-wrap items-center justify-between gap-sm">
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground-primary">
                Reseñas de tu taller
              </h1>
              <p className="font-body text-foreground-secondary">
                Lo que tus clientes dicen de ti.
              </p>
            </div>
            <Rating valor={taller.rating} numResenas={taller.numResenas} />
          </div>
          <ListaResenas resenas={resenas} />
        </div>
      )}
    </DashboardShell>
  );
}
