import { defineValibotSchema } from 'nitro-rpc-definition/imports';
import * as v from 'valibot';

// Define Valibot schemas
const CreateUserSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  email: v.pipe(v.string(), v.email()),
  age: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(150))),
});

const UserResponseSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  age: v.optional(v.number()),
  createdAt: v.string()
});

export const schema = defineValibotSchema({
  body: CreateUserSchema,
  response: UserResponseSchema
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validate the body using Valibot
  const userData = v.parse(CreateUserSchema, body);
  
  // Simulate user creation
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  return user;
});