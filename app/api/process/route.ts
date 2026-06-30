import { NextResponse } from "next/server"
import { getUiPathToken } from "@/lib/uipath"
import { addToUiPathQueue } from "@/lib/uipath-queue"
import {
  computeAuthorizationScore,
  validateAuthorizationInput,
  type AuthorizationInput,
} from "@/lib/scoring-engine"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input: AuthorizationInput = {
      patientName: body.patientName ?? "",
      patientAge: body.patientAge ?? "",
      diagnosis: body.diagnosis ?? "",
      service: body.service ?? "",
      doctor: body.doctor ?? "",
      eps: body.eps ?? "",
    }

    const validationError = validateAuthorizationInput(input)
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError.message, field: validationError.field },
        { status: 400 },
      )
    }

    const { score, approved, reasoning, caseId } = computeAuthorizationScore(input)

    let uipathSync: {
      synced: boolean
      mode: "live" | "fail-safe"
      queueItemId?: number
    } = { synced: false, mode: "fail-safe" }

    console.log("[API Process] Intentando autenticación con UiPath Cloud...")
    const uiPathToken = await getUiPathToken()

    if (uiPathToken) {
      console.log("[API Process] ✅ Autenticación exitosa con UiPath. Token generado.")
      try {
        const queueResult = await addToUiPathQueue(uiPathToken, {
          caseId,
          patientName: input.patientName,
          diagnosis: input.diagnosis,
          service: input.service,
          score,
          approved,
        })
        console.log("[API Process] ✅ QueueItem creado en Orchestrator:", queueResult)
        uipathSync = {
          synced: true,
          mode: "live",
          queueItemId: (queueResult as { Id?: number }).Id,
        }
      } catch (queueError) {
        console.error("[API Process] ⚠️ Fail-Safe: no se pudo crear QueueItem:", queueError)
      }
    } else {
      console.warn("[API Process] ⚠️ No se pudo obtener el token de UiPath. Usando modo de respaldo local.")
    }

    return NextResponse.json({
      success: true,
      caseId,
      score,
      approved,
      reasoning,
      timestamp: new Date().toISOString(),
      uipathSync,
    })
  } catch (error) {
    console.error("[API Process Exception]:", error)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
