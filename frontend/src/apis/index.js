// api
// import axios from "axios";
import { toast } from 'react-toastify'
import { API_ROOT } from '../utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

//---------verificationAPI----------------------------------

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Your account has been verified successfully!', { theme:'colored' })
  return response.data
}

export const forgotPassAPI = async(data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/forgot-password`, data)
  return res.data
}

export const resetPasswordAPI = async(data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/reset-password`, data)
  // toast.success('Your password has been reset successfully!', { theme:'colored' })
  return res.data
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Your account has been registered successfully! Please check your email to verify your account!', { theme:'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}
