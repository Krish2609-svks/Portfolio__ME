import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSessionToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }
    
    const { email, password } = result.data;

    // Check if any admin exists. If not, auto-seed the default administrator.
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0) {
      const defaultEmail = "admin@nambi.dev";
      const defaultPassword = "adminpassword";
      
      await prisma.adminUser.create({
        data: {
          email: defaultEmail,
          passwordHash: hashPassword(defaultPassword),
        },
      });
      
      // If logging in with the newly seeded default admin
      if (email === defaultEmail && password === defaultPassword) {
        const token = await createSessionToken({ email });
        const response = NextResponse.json({ success: true, message: "Default administrator account seeded and logged in." });
        
        response.cookies.set("admin-session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        return response;
      }
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken({ email: admin.email });
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
