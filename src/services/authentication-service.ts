import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from '@/errors';
import { authenticationRepository, userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import axios from 'axios';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function signInGithub(code: string): Promise<SignInResult> {
  const response = await axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  });

  const tokenGithub = response.data.access_token;
  const userResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenGithub}`
    }
  });
  
  console.log(userResponse)
  // upsert do usuário no banco
  const user = {
    id: 1,
    email: 'teste@teste.com',
    password: 'teste',
    token: tokenGithub
  }
  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export const authenticationService = {
  signIn,
  signInGithub,

};
