import { PxlPacketPayloadZ } from '../schemas';
import type { PxlPacketPayload } from '../types';

type VerifyResult = {
  success: boolean;
  errors?: string[];
};

/**
 * Deprecated. Use PxlPacketPayloadZ.safeParse instead
 * take in a job payload and verify that all templates and data are valid
 *
 * returns { success: true } if valid, or { success: false, errors: [...] } if not
 */
export function verifyJobPayload(payload: PxlPacketPayload): VerifyResult {
  const ok = PxlPacketPayloadZ.safeParse(payload);
  return ok as VerifyResult;
}
