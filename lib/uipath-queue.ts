export async function addToUiPathQueue(
  token: string,
  data: {
    caseId: string
    patientName: string
    diagnosis: string
    service: string
    score: number
    approved: boolean
  },
) {
  const url = `${process.env.UIPATH_BASE_URL}/${process.env.UIPATH_ORGANIZATION_NAME}/${process.env.UIPATH_TENANT_NAME}/orchestrator_/odata/Queues/UiPathODataSvc.AddQueueItem`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-UIPATH-OrganizationUnitId": process.env.UIPATH_FOLDER_ID || "",
    },
    body: JSON.stringify({
      itemData: {
        Name: process.env.UIPATH_QUEUE_NAME,
        Priority: data.approved ? "Normal" : "High",
        Reference: data.caseId,
        SpecificContent: { ...data },
      },
    }),
  })
  if (!response.ok) {
    throw new Error(`Queue error ${response.status}: ${await response.text()}`)
  }
  return response.json()
}
