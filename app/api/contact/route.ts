import { NextResponse } from "next/server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim();
  const message = body.message?.trim();
  const name = body.name?.trim() || null;
  const subject = body.subject?.trim() || "Contact form";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      {
        error: `Messaging is temporarily unavailable. Email us at ${SITE.contactEmail}.`,
      },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    console.error("[contact]", error.message);
    return NextResponse.json(
      {
        error:
          "Could not send your message. Run supabase/contact_messages.sql in your project, or email us directly.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
