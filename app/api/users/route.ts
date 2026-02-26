// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

// Dummy data - hardcoded users
const users = [
  {
    id: "1",
    uid: "firebase-uid-001",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2024-01-15T08:00:00Z",
    lastLogin: "2024-06-01T10:30:00Z",
  },
  {
    id: "2",
    uid: "firebase-uid-002",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    createdAt: "2024-02-20T09:00:00Z",
    lastLogin: "2024-06-02T14:20:00Z",
  },
  {
    id: "3",
    uid: "firebase-uid-003",
    name: "Carol White",
    email: "carol@example.com",
    role: "user",
    createdAt: "2024-03-10T11:00:00Z",
    lastLogin: "2024-05-30T09:45:00Z",
  },
];

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users (dummy data)
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response with list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: users,
    total: users.length,
  });
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user record after Firebase registration
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - name
 *               - email
 *             properties:
 *               uid:
 *                 type: string
 *                 example: firebase-uid-999
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, name, email, role = "user" } = body;

  if (!uid || !name || !email) {
    return NextResponse.json(
      { success: false, message: "uid, name, and email are required" },
      { status: 400 }
    );
  }

  const newUser = {
    id: String(users.length + 1),
    uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // In real app: save to DB. Here we just return the created user.
  return NextResponse.json(
    { success: true, message: "User created successfully", data: newUser },
    { status: 201 }
  );
}