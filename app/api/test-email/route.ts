import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log("Testing email to:", email);
    console.log("Using API key:", process.env.RESEND_API_KEY ? "Present" : "Missing");
    console.log("Using from address:", process.env.RESEND_FROM);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Test Email from AI College Essay Reviewer",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Test Email</h2>
          <p>This is a test email to verify Resend is working.</p>
          <p>If you receive this, your email setup is working correctly!</p>
        </div>
      `,
    });

    console.log("Test email result:", result);

    return NextResponse.json({
      success: true,
      message: "Test email sent",
      result,
    });
  } catch (error) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
