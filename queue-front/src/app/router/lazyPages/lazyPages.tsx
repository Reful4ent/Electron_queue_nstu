import {lazy} from "react";

export const ErrorPage = lazy(() => import('../../../pages/ErrorPage/ErrorPage').then(m => ({default: m.ErrorPage})));

export const HomePage = lazy(() => import('../../../pages/HomePage/HomePage').then(m => ({default: m.HomePage})))

export const SignInPage = lazy(() => import('../../../pages/SignInPage/SignInPage').then(m => ({default: m.SignInPage})))
export const RegistrationPage = lazy(() => import('../../../pages/RegistrationPage/RegistrationPage').then(m => ({default: m.RegistrationPage})))
export const DeansConsultationsPage = lazy(() => import('../../../pages/DeansConsultationsPage/DeansConsultationsPage').then(m => ({default: m.DeansConsultationsPage})))
export const EmployeesConsultationsPage = lazy(() => import('../../../pages/EmployeesConsultationsPage/EmployeesConsultationsPage').then(m => ({default: m.EmployeesConsultationsPage})))
export const ConsultationCreatePage = lazy(() => import('../../../pages/ConsultationCreatePage/ConsultationCreatePage').then(m => ({default: m.ConsultationCreatePage})))
export const EmployeeMeConsultationPage = lazy(() => import('../../../pages/EmployeeMeConsultationsPage/EmployeeMeConsultationsPage').then(m => ({default: m.EmployeeMeConsultationsPage})))
export const MyProfilePage = lazy(() => import('../../../pages/MyProfilePage/MyProfilePage').then(m => ({default: m.MyProfilePage})))