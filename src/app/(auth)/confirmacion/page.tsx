import { Suspense } from "react";
import { ConfirmacionContenido } from "@/features/usuarios/components/ConfirmacionContenido";

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacionContenido />
    </Suspense>
  );
}
