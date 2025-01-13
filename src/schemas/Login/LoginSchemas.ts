import { z } from 'zod';

export const SignUpSchema = z
  .object({
    userName: z.string().min(2, "Deve ter pelo menos 4 caracteres").max(35, "Deve ter no máximo 35 caracteres"),
    password: z.string().min(4, "Deve ter pelo menos 4 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword, 
  {
    path: ['confirmPassword'], 
    message: "As senhas devem ser iguais",
  })


export type SignUpObject = z.infer<typeof SignUpSchema>;

export const SignInSchema = z
  .object({
    userName: z.string(),
    password: z.string()
  })


export type SignInObject = z.infer<typeof SignInSchema>;