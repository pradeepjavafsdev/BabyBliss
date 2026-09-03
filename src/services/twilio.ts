/**
 * Twilio integration stub for SMS invites & share notifications.
 * In production, call a secure Cloud Function / backend that holds Twilio credentials.
 * Never ship Twilio Auth Token in the mobile client.
 */

export interface SmsInvitePayload {
  to: string;
  babyName: string;
  shareUrl: string;
  inviterName: string;
}

export interface TwilioResult {
  success: boolean;
  sid?: string;
  message: string;
}

const BACKEND_SMS_URL =
  process.env.EXPO_PUBLIC_TWILIO_PROXY_URL ?? 'https://your-cloud-function.example.com/sendInviteSms';

export async function sendShareInviteSms(payload: SmsInvitePayload): Promise<TwilioResult> {
  // Demo mode — simulate Twilio delivery when backend is not configured
  if (BACKEND_SMS_URL.includes('example.com')) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      sid: `SM_demo_${Date.now()}`,
      message: `Demo SMS queued to ${payload.to} with BabyBliss invite for ${payload.babyName}.`,
    };
  }

  try {
    const res = await fetch(BACKEND_SMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`SMS failed (${res.status})`);
    const data = await res.json();
    return { success: true, sid: data.sid, message: 'Invite sent via SMS' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

export async function sendEmailInvite(params: {
  to: string;
  babyName: string;
  shareUrl: string;
  inviterName: string;
}): Promise<TwilioResult> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    success: true,
    message: `Demo email invite prepared for ${params.to}`,
  };
}
