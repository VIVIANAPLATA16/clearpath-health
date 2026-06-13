import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, patientAge, diagnosis, service, eps } = body

    // Simular latencia de procesamiento de red (Orquestación de UiPath Maestro)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Lógica de Negocio Avanzada: Análisis de Pertinencia Clínica (Mocking Gemini 2.5 Flash)
    let baseScore = 65
    
    // Penalizar o bonificar según criterios del sistema de salud colombiano
    const textToAnalyze = `${diagnosis} ${service}`.toLowerCase()
    
    if (textToAnalyze.includes("urgente") || textToAnalyze.includes("prioritario")) baseScore += 15
    if (textToAnalyze.includes("terapia") || textToAnalyze.includes("ambulatorio")) baseScore += 10
    if (textToAnalyze.includes("no pos") || textToAnalyze.includes("comité")) baseScore -= 20
    if (parseInt(patientAge) > 60) baseScore += 5 // Prioridad adulto mayor

    // Limitar score entre 40 y 100
    const score = Math.max(40, Math.min(100, baseScore))
    const approved = score >= 70

    // Generación de justificación estructurada
    const reasoning = approved
      ? `[UiPath Maestro - AutoApproved] La solicitud de "${service}" coincide plenamente con los protocolos clínicos para el diagnóstico "${diagnosis}". Se valida cobertura activa en ${eps}. El agente inteligente determinó un índice de pertinencia del ${score}%, cumpliendo con la meta de oportunidad médica y mitigando el riesgo de tutelas contra el asegurador.`
      : `[UiPath Maestro - Escalated] La solicitud de "${service}" presenta inconsistencias normativas o requiere validación de junta médica para el diagnóstico "${diagnosis}". Se detectaron criterios de exclusión o falta de soportes obligatorios exigidos por ${eps}. El caso ha sido pausado en UiPath Action Center y escalado al Dashboard de Auditoría Humana.`

    return NextResponse.json({
      success: true,
      caseId: `UPM-${Math.floor(100000 + Math.random() * 900000)}`,
      score,
      approved,
      reasoning,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error interno procesando el payload del caso" },
      { status: 500 }
    )
  }
}
