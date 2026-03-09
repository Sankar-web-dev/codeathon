import { useMutation } from '@tanstack/react-query';
import { authService } from '@/service/auth.service';

type LoginParams = {
  email: string;
  password: string;
};

type SignupParams = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginParams) => authService.logInWithEmailAndPassword(email, password),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: ({ email, password }: SignupParams) => authService.signUpWithEmailAndPassword(email, password),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
};