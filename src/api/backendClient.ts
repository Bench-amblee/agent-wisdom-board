// Simple helper to call our local backend proxy for third-party APIs.
export async function callOpenAI(payload: any) {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function callLinkUp(payload: any) {
  const res = await fetch("/api/linkup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function callAiria(payload: any) {
  const res = await fetch("/api/airia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
