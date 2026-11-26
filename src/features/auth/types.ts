export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthRedirectResult {
  redirectTo: string;
  requiresEmailConfirmation?: boolean;
}
