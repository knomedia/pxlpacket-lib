import type { z } from 'zod';

import type {
  ContainersZ,
  HardwareZ,
  AudioCodecZ,
  PixelFormatZ,
  VideoFourCCZ,
  FilterSpecZ,
  TemplateInputZ,
} from '../schemas';

/** ----------------------------------
 * From Compiler Zod schema
 * ----------------------------------- */

export type Container = z.infer<typeof ContainersZ>;
export type Hardware = z.infer<typeof HardwareZ>;
export type AudioCodec = z.infer<typeof AudioCodecZ>;
export type PixelFormat = z.infer<typeof PixelFormatZ>;
export type VideoFourCC = z.infer<typeof VideoFourCCZ>;
export type FilterSpec = z.infer<typeof FilterSpecZ>;
export type TemplateInput = z.infer<typeof TemplateInputZ>;
export type TemplateBody = Omit<TemplateInput, 'inputId' | 'outputId'>;

/**
 * String name with a presigned URL value. Represents a file needed to perform
 * one or more tasks in a job
 */
export type PxlPacketFiles = {
  [key: string]: string;
};

/**
 * a string name, with a TemplateBody value. Represents a task to be performed
 *
 */
export type NamedEncodings = {
  [key: string]: TemplateBody;
};

export type PxlPacketVideosConfig = {
  mezzanine?: TemplateBody;
  mp4?: NamedEncodings;
  hls?: NamedEncodings;
  thumbnail?: NamedEncodings;
  poster?: NamedEncodings;
  hover?: NamedEncodings;
};

export type PxlPacketEvents = {
  jobStartedUrl?: string; // https://ridfm.pxltape.com/api/pxlpacket/video/[id]/job-started
  jobCompletedUrl?: string; // https://ridfm.pxltape.com/api/pxlpacket/video/[id]/job-completed
  jobErroredUrl?: string;
  taskStartedUrl?: string;
  taskCompletedUrl?: string;
  taskErroredUrl?: string;
};

export type PxlPacketPassbackData = {
  [key: string]: string | number | boolean;
};

export type PxlPacketPayload = {
  version: string;
  files: PxlPacketFiles;
  calcAudioHeadroom?: boolean; // default false
  video?: PxlPacketVideosConfig;
  // data will be passed back with any event callbacks
  data?: PxlPacketPassbackData;
  // subscribe to pxlpacket events for job status updates
  events?: PxlPacketEvents;
};
