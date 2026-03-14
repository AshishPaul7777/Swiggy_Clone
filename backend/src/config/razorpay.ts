import crypto from "crypto"
import Razorpay from "razorpay"

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keyId || !keySecret) {
  throw new Error("Missing Razorpay credentials in environment variables")
}

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
})

export const razorpayKeyId = keyId

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature
}: {
  orderId: string
  paymentId: string
  signature: string
}) => {
  const payload = `${orderId}|${paymentId}`

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex")

  return expectedSignature === signature
}
