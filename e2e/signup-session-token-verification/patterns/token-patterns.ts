export interface TestPattern {
  title: string;
  timeout?: number,
  step1: {
    through: boolean;
    _token?: string;
    signup_token?: string;
    errorContains?: string;
  };
  step2?: {
    through: boolean;
    _token?: string;
    signup_token?: string;
    errorContains?: string;
  };
  otp?: {
    through: boolean;
    _token?: string;
    signup_token?: string;
    errorContains?: string;
  };
}

export const positivePatterns: TestPattern[] = [
  {
    title: "トークンの検証に成功(otpはデタラメ)",
    timeout: 40000,
    step1: {
      through: true,
    },
    step2: {
      through: true,
    },
    otp: {
      through: true,
    },
  },
  // ==============================================
  {
    title: "STEP1で空のCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: false,
      _token: "",
    },
    step2: {
      through: true,
    },
    otp: {
      through: true,
    },
  },
  {
    title: "STEP2で空のCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: true,
    },
    step2: {
      through: false,
      _token: "",
    },
    otp: {
      through: true,
    },
  },
  {
    title: "OTP認証で空のCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: true,
    },
    step2: {
      through: true,
    },
    otp: {
      through: false,
      _token: "",
    },
  },
  // ==============================================
  {
    title: "STEP1でダミーのCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: false,
      _token: Date.now().toString(16),
    },
    step2: {
      through: true,
    },
    otp: {
      through: true,
    },
  },
  {
    title: "STEP2でダミーのCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: true,
    },
    step2: {
      through: false,
      _token: Date.now().toString(16),
    },
    otp: {
      through: true,
    },
  },
  {
    title: "OTP認証でダミーのCSRFトークンを送信",
    timeout: 40000,
    step1: {
      through: true,
    },
    step2: {
      through: true,
    },
    otp: {
      through: false,
      _token: Date.now().toString(16),
    },
  },
];

export const negativePatterns: TestPattern[] = [
  // ==============================================
  {
    title: "STEP1で空のトークンを送信",
    step1: {
      through: false,
      signup_token: "",
      errorContains: "signup_token mismatch",
    },
  },
  {
    title: "STEP2で空のトークンを送信",
    step1: {
      through: true,
    },
    step2: {
      through: false,
      signup_token: "",
      errorContains: "signup_token mismatch",
    },
  },
  {
    title: "OTP認証で空のトークンを送信",
    step1: {
      through: true,
    },
    step2: {
      through: true,
    },
    otp: {
      through: false,
      signup_token: "",
      errorContains: "signup_token mismatch",
    },
  },
  // ==============================================
  {
    title: "STEP1でダミーのトークンを送信",
    step1: {
      through: false,
      signup_token: Date.now().toString(16),
      errorContains: "signup_token mismatch",
    },
  },
  {
    title: "STEP2でダミーのトークンを送信",
    step1: {
      through: true,
    },
    step2: {
      through: false,
      signup_token: Date.now().toString(16),
      errorContains: "signup_token mismatch",
    },
  },
  {
    title: "OTP認証でダミーのトークンを送信",
    step1: {
      through: true,
    },
    step2: {
      through: true,
    },
    otp: {
      through: false,
      signup_token: Date.now().toString(16),
      errorContains: "signup_token mismatch",
    },
  },
  // ==============================================
];
