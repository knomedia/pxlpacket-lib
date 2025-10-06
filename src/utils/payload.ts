import { TemplateBodyZ } from '../schemas';
import type { PxlPacketPayload } from '../types';

type VerifyResult = {
  success: boolean;
  errors?: string[];
};

/**
 * take in a job payload and verify that all templates and data are valid
 *
 * returns { success: true } if valid, or { success: false, errors: [...] } if not
 */
export function verifyJobPayload(payload: PxlPacketPayload): VerifyResult {
  const errors: string[] = [];
  if (payload.video) {
    if (payload.video.mezzanine) {
      const ok = TemplateBodyZ.safeParse(payload.video.mezzanine);
      if (!ok.success) {
        errors.push('Invalid mezzanine template');
      }
    }
    if (payload.video.mp4) {
      for (const [name, template] of Object.entries(payload.video.mp4)) {
        const ok = TemplateBodyZ.safeParse(template);
        if (!ok.success) {
          errors.push(`Invalid mp4 template: ${name}`);
        }
      }
    }
    if (payload.video.hls) {
      for (const [name, template] of Object.entries(payload.video.hls)) {
        const ok = TemplateBodyZ.safeParse(template);
        if (!ok.success) {
          errors.push(`Invalid hls template: ${name}`);
        }
      }
    }
    if (payload.video.thumbnail) {
      for (const [name, template] of Object.entries(payload.video.thumbnail)) {
        const ok = TemplateBodyZ.safeParse(template);
        if (!ok.success) {
          errors.push(`Invalid thumbnail template: ${name}`);
        }
      }
    }
    if (payload.video.poster) {
      for (const [name, template] of Object.entries(payload.video.poster)) {
        const ok = TemplateBodyZ.safeParse(template);
        if (!ok.success) {
          errors.push(`Invalid poster template: ${name}`);
        }
      }
    }
    if (payload.video.hover) {
      for (const [name, template] of Object.entries(payload.video.hover)) {
        const ok = TemplateBodyZ.safeParse(template);
        if (!ok.success) {
          errors.push(`Invalid hover template: ${name}`);
        }
      }
    }
  }
  if (errors.length > 0) {
    return { success: false, errors };
  } else {
    return { success: true };
  }
}
