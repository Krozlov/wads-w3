import { createSwaggerSpec } from "next-swagger-doc";

export const getSwaggerSpec = () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "WADS-W3 API",
        version: "1.0.0",
        description:
          "REST API for WADS Week 3 Assignment. Built with Next.js 14 App Router and Firebase Authentication.\n\n" +
          "### Auth Flow\n" +
          "1. Sign in via Firebase (email/password or Google)\n" +
          "2. Get ID token: `const idToken = await user.getIdToken()`\n" +
          "3. `POST /api/session` with `Authorization: Bearer <idToken>`\n" +
          "4. Server verifies via Firebase Admin SDK → sets HttpOnly `session` cookie\n" +
          "5. Logout: `POST /api/logout` → cookie is cleared with `expires: new Date(0)`",
        contact: {
          name: "WADS-W3",
          url: "https://github.com/Krozlov/wads-w3",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local Development",
        },
      ],
      tags: [
        {
          name: "Auth",
          description:
            "Session management — create and destroy server-side sessions backed by Firebase Auth",
        },
        {
          name: "Users",
          description:
            "User CRUD — full create/read/update/delete on user records (hardcoded dummy data)",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "Firebase ID Token",
            description:
              "Firebase ID token obtained via `await user.getIdToken()`. " +
              "Pass as `Authorization: Bearer <idToken>`.",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "1",
                description: "Internal auto-incremented record ID",
              },
              uid: {
                type: "string",
                example: "firebase-uid-001",
                description: "Firebase UID from Firebase Auth",
              },
              name: {
                type: "string",
                example: "Alice Johnson",
                description: "User display name",
              },
              email: {
                type: "string",
                format: "email",
                example: "alice@example.com",
              },
              role: {
                type: "string",
                enum: ["admin", "user"],
                example: "user",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-01-15T08:00:00Z",
              },
              lastLogin: {
                type: "string",
                format: "date-time",
                example: "2024-06-01T10:30:00Z",
              },
            },
          },
          CreateUserBody: {
            type: "object",
            required: ["uid", "name", "email"],
            properties: {
              uid: {
                type: "string",
                example: "firebase-uid-999",
                description: "Firebase UID — must match Firebase Auth",
              },
              name: {
                type: "string",
                example: "John Doe",
              },
              email: {
                type: "string",
                format: "email",
                example: "john@example.com",
              },
              role: {
                type: "string",
                enum: ["admin", "user"],
                default: "user",
                example: "user",
              },
            },
          },
          UpdateUserBody: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "Alice Updated",
              },
              email: {
                type: "string",
                format: "email",
                example: "alice.new@example.com",
              },
              role: {
                type: "string",
                enum: ["admin", "user"],
                example: "admin",
              },
            },
          },
          SuccessResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Operation completed successfully" },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Resource not found" },
            },
          },
          SessionSuccess: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
            },
          },
          LogoutSuccess: {
            type: "object",
            properties: {
              message: { type: "string", example: "Logged out" },
            },
          },
        },
      },
      paths: {
        // ── AUTH ───────────────────────────────────────────────────────────
        "/api/session": {
          post: {
            summary: "Create Session",
            description:
              "Verifies a Firebase ID Token using **`adminAuth.verifyIdToken(idToken, true)`** " +
              "(Firebase Admin SDK). On success, stores the token as an **HttpOnly + Secure** " +
              "cookie named `session`.\n\n" +
              "The `Authorization` header must be formatted as `Bearer <idToken>` (space required). " +
              "The `true` parameter enables Firebase token revocation checking.",
            tags: ["Auth"],
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                description:
                  "Firebase ID token in Bearer format: `Bearer <idToken>`",
                schema: {
                  type: "string",
                  example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",
                },
              },
            ],
            responses: {
              "200": {
                description:
                  "Token verified. `session` HttpOnly cookie set. Redirect to `/dashboard`.",
                headers: {
                  "Set-Cookie": {
                    schema: { type: "string" },
                    description:
                      "`session=<idToken>; Path=/; HttpOnly; Secure`",
                  },
                },
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SessionSuccess" },
                    example: { status: "success" },
                  },
                },
              },
              "401": {
                description:
                  "Missing `Authorization` header or does not start with `Bearer `.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string", example: "Unauthorized" },
                      },
                    },
                  },
                },
              },
              "500": {
                description:
                  "Firebase Admin SDK threw an error — token expired, revoked, or malformed.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                          example: "Firebase: Error (auth/id-token-expired).",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        "/api/logout": {
          post: {
            summary: "Logout",
            description:
              "Clears the `session` cookie by setting its value to `\"\"` with " +
              "`expires: new Date(0)` (Unix epoch — Jan 1 1970). " +
              "No request body or Authorization header needed.\n\n" +
              "After calling this, redirect the client to `/login`.",
            tags: ["Auth"],
            responses: {
              "200": {
                description:
                  "Session cookie cleared. Redirect client to `/login`.",
                headers: {
                  "Set-Cookie": {
                    schema: { type: "string" },
                    description:
                      "`session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure`",
                  },
                },
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LogoutSuccess" },
                    example: { message: "Logged out" },
                  },
                },
              },
            },
          },
        },

        // ── USERS ──────────────────────────────────────────────────────────
        "/api/users": {
          get: {
            summary: "Get All Users",
            description:
              "Returns all registered users as an array. " +
              "Currently uses hardcoded dummy data with 3 pre-seeded users. " +
              "In production this would be paginated and require admin role verification.",
            tags: ["Users"],
            responses: {
              "200": {
                description: "Array of all user records.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        total: { type: "integer", example: 3 },
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" },
                        },
                      },
                    },
                    example: {
                      success: true,
                      total: 3,
                      data: [
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
                      ],
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Create User",
            description:
              "Creates a new user profile record after a successful Firebase signup. " +
              "The `uid` must match the Firebase UID from Firebase Auth. " +
              "`id` and `uid` are protected fields and cannot be overwritten after creation.",
            tags: ["Users"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateUserBody" },
                },
              },
            },
            responses: {
              "201": {
                description: "User record created successfully.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        message: {
                          type: "string",
                          example: "User created successfully",
                        },
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
              "400": {
                description:
                  "Missing required fields: `uid`, `name`, or `email`.",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: {
                      success: false,
                      message: "uid, name, and email are required",
                    },
                  },
                },
              },
            },
          },
        },

        "/api/users/{id}": {
          get: {
            summary: "Get User by ID",
            description:
              "Retrieves a single user record by their internal numeric ID.",
            tags: ["Users"],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "Internal user record ID",
                schema: { type: "string", example: "1" },
              },
            ],
            responses: {
              "200": {
                description: "User found.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
              "404": {
                description: "No user found with the given ID.",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { success: false, message: "User not found" },
                  },
                },
              },
            },
          },
          put: {
            summary: "Update User",
            description:
              "Updates one or more fields of an existing user record. " +
              "`id` and `uid` are read-only — they will not be overwritten " +
              "even if included in the request body.",
            tags: ["Users"],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "Internal user record ID",
                schema: { type: "string", example: "1" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateUserBody" },
                },
              },
            },
            responses: {
              "200": {
                description: "User updated successfully.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        message: {
                          type: "string",
                          example: "User updated successfully",
                        },
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
              "404": {
                description: "No user found with the given ID.",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { success: false, message: "User not found" },
                  },
                },
              },
            },
          },
          delete: {
            summary: "Delete User",
            description:
              "Permanently removes a user record by ID. " +
              "Returns the deleted user object for confirmation. " +
              "In production, also call `adminAuth.revokeRefreshTokens(uid)` " +
              "to invalidate active Firebase sessions.",
            tags: ["Users"],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "Internal user record ID",
                schema: { type: "string", example: "2" },
              },
            ],
            responses: {
              "200": {
                description: "User deleted. Deleted user is returned for confirmation.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        message: {
                          type: "string",
                          example: "User with id 2 deleted successfully",
                        },
                        data: {
                          type: "object",
                          properties: {
                            deletedUser: {
                              $ref: "#/components/schemas/User",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              "404": {
                description: "No user found with the given ID.",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { success: false, message: "User not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return spec;
};