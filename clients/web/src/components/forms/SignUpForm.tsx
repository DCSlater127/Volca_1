import React, { useEffect } from 'react';
import { useState } from 'react';
import { FormControl, FormLabel, Input, Button, VStack, FormErrorMessage, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

import { PasswordStrengthIndicator } from '../PasswordStrength';
import { useLoadingContext } from '../../providers';

interface SignUpFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormComponentProps {
  onSubmit: (data: Omit<SignUpFormProps, 'confirmPassword'>) => void;
}

export const SignUpForm: React.FC<SignUpFormComponentProps> = ({ onSubmit }) => {
  const [strengthCheck, setStrengthCheck] = useState<null | ZXCVBNResult>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormProps>();

  const { loading } = useLoadingContext();

  const password = watch('password');
  useEffect(() => {
    const result = password ? zxcvbn(password) : null;
    setStrengthCheck(result);
  }, [password]);

  const _onSubmit = ({ firstName, lastName, email, password }: SignUpFormProps) => {
    onSubmit({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <VStack spacing={4} alignItems="flex-start">
        <HStack alignSelf="stretch">
          <FormControl isInvalid={!!errors.firstName} minW={100}>
            <FormLabel htmlFor="firstName" fontSize="sm">
              First name
            </FormLabel>
            <Input
              id="firstName"
              type="text"
              fontSize="sm"
              {...register('firstName', { required: 'Enter your first name' })}
            />
            {errors.firstName && <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.lastName} minW={100}>
            <FormLabel htmlFor="lastName" fontSize="sm">
              Last name
            </FormLabel>
            <Input
              id="lastName"
              type="text"
              fontSize="sm"
              {...register('lastName', { required: 'Enter your last name' })}
            />
            {errors.lastName && <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>}
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            Email address
          </FormLabel>
          <Input id="email" type="email" fontSize="sm" {...register('email', { required: 'Enter your email' })} />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="Password" fontSize="sm">
            Password
          </FormLabel>
          <Input
            id="password"
            type="password"
            fontSize="sm"
            {...register('password', {
              required: 'Enter your password',
              validate: () => {
                if ((strengthCheck?.score || 0) < 2) {
                  return `Choose a stronger password. ${strengthCheck?.feedback.warning}`;
                }
              },
            })}
          />
          <PasswordStrengthIndicator strength={strengthCheck?.score} />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="Password" fontSize="sm">
            Confirm password
          </FormLabel>
          <Input
            id="conformPassword"
            type="password"
            fontSize="sm"
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (val: string) => {
                if (watch('password') !== val) {
                  return 'Your passwords does not match';
                }
              },
            })}
          />
          {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
        </FormControl>
        <Button fontSize="10px" type="submit" w="100%" h="45" mb="20px" mt="20px" isLoading={loading}>
          REGISTER
        </Button>
      </VStack>
    </form>
  );
};
