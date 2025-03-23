import {lazy} from "react";

export const ErrorPage = lazy(() => import('../../../pages/ErrorPage/ErrorPage').then(m => ({default: m.ErrorPage})));

export const HomePage = lazy(() => import('../../../pages/HomePage/HomePage').then(m => ({default: m.HomePage})))

export const SignInPage = lazy(() => import('../../../pages/SignInPage/SignInPage').then(m => ({default: m.SignInPage})))
export const RegistrationPage = lazy(() => import('../../../pages/RegistrationPage/RegistrationPage').then(m => ({default: m.RegistrationPage})))