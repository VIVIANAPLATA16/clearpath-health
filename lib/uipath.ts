/**
 * Servicio de Integración para UiPath Automation Cloud (OAuth2 Confidential Client)
 */

interface UiPathTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Solicita un token de acceso dinámico a UiPath Identity Server usando las credenciales de la App Externa
 */
export async function getUiPathToken(): Promise<string | null> {
  const clientId = process.env.UIPATH_CLIENT_ID;
  const clientSecret = process.env.UIPATH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[UiPath Auth] Error: Faltan las credenciales en .env.local");
    return null;
  }

  try {
    // Configurar el payload x-www-form-urlencoded requerido por OAuth2 para aplicaciones confidenciales
    const details: Record<string, string> = {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "OR.Queues OR.Queues.Read OR.Assets OR.Assets.Read OR.Execution OR.Jobs",
    };

    const formBody = Object.keys(details)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(details[key]))
      .join("&");

    const response = await fetch(`https://staging.uipath.com/${process.env.UIPATH_ORGANIZATION_NAME}/identity_/connect/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: formBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`UiPath Auth falló con estado ${response.status}: ${errorText}`);
    }

    const data: UiPathTokenResponse = await response.json();
    return data.access_token;

  } catch (error) {
    console.error("[UiPath Auth Exception]:", error);
    return null;
  }
}
