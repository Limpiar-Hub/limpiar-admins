import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PersonalInfo {
  fullName?: string
  email?: string
  phoneNumber?: string
  password?: string
  role?: string
}

interface OnboardingState {
  personalInfo: PersonalInfo | null
  isOtpVerified: boolean
  currentStep: number
}

const initialState: OnboardingState = {
  personalInfo: null,
  isOtpVerified: false,
  currentStep: 1,
}

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setPersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personalInfo = action.payload
    },
    verifyOtp: (state, action: PayloadAction<boolean>) => {
      state.isOtpVerified = action.payload
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    resetOnboarding: (state) => {
      state.personalInfo = null
      state.isOtpVerified = false
      state.currentStep = 1
    },
  },
})

export const { setPersonalInfo, verifyOtp, setCurrentStep, resetOnboarding } = onboardingSlice.actions
export default onboardingSlice.reducer

