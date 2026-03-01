export interface FormSubmissionRequest {
  formType: string
  formData: Record<string, unknown>
}

export interface FormSubmission {
  id?: string
  form_type: string
  form_data: Record<string, unknown>
  created_at: string
  ip_address?: string
  user_agent?: string
}

export interface FormHandlerResponse {
  success: boolean
  message?: string
  data?: FormSubmission
  error?: string
}
