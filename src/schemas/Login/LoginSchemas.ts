import { z } from 'zod';

export const SignUpSchema = z
  .object({
    privateName: z.string().min(2, "Deve ter pelo menos 2 caracteres").max(50, "Deve ter no máximo 50 caracteres"),
    displayName: z.string().min(2, "Deve ter pelo menos 2 caracteres").max(35, "Deve ter no máximo 35 caracteres"),
    password: z.string().min(4, "Deve ter pelo menos 4 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword, 
  {
    path: ['confirmPassword'], 
    message: "As senhas devem ser iguais",
  });


export type SignUpObject = z.infer<typeof SignUpSchema>;

export const SignInSchema = z
  .object({
    privateName: z.string().min(1, "Informe o nome de usuário"),
    password: z.string().min(1, "Informe a senha")
  })


export type SignInObject = z.infer<typeof SignInSchema>;