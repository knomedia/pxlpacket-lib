import type { z } from 'zod';

import type {
  ContainersZ,
  HardwareZ,
  AudioCodecZ,
  PixelFormatZ,
  VideoFourCCZ,
  FilterSpecZ,
  TemplateInputZ,
  PxlPacketFilesZ,
  NamedEncodingsZ,
  PxlPacketVideosConfigZ,
  PxlPacketEventsZ,
  PxlPacketPassbackDataZ,
  PxlPacketPayloadZ,
} from '../schemas';

/** ----------------------------------
 * FFMPEG Template / compiler types
 * ----------------------------------- */

export type Container = z.infer<typeof ContainersZ>;
export type Hardware = z.infer<typeof HardwareZ>;
export type AudioCodec = z.infer<typeof AudioCodecZ>;
export type PixelFormat = z.infer<typeof PixelFormatZ>;
export type VideoFourCC = z.infer<typeof VideoFourCCZ>;
export type FilterSpec = z.infer<typeof FilterSpecZ>;
export type TemplateInput = z.infer<typeof TemplateInputZ>;
export type TemplateBody = Omit<TemplateInput, 'inputId' | 'outputId'>;

/** ----------------------------------
 * Job Payload types
 * ----------------------------------- */
export type PxlPacketFiles = z.infer<typeof PxlPacketFilesZ>;
export type NamedEncodings = z.infer<typeof NamedEncodingsZ>;
export type PxlPacketVideosConfig = z.infer<typeof PxlPacketVideosConfigZ>;
export type PxlPacketEvents = z.infer<typeof PxlPacketEventsZ>;
export type PxlPacketPassbackData = z.infer<typeof PxlPacketPassbackDataZ>;
export type PxlPacketPayload = z.infer<typeof PxlPacketPayloadZ>;
