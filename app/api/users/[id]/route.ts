// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Shared dummy data (in real app, this comes from DB)
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
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Updated
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const updatedUser = {
    ...user,
    ...body,
    id: user.id, // prevent id override
    uid: user.uid, // prevent uid override
  };

  return NextResponse.json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "2"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `User with id ${params.id} deleted successfully`,
    data: { deletedUser: user },
  });
}