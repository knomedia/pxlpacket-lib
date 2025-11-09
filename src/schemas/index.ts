import { z } from 'zod';

/** ----------------------------------
 * FFMPEG Template / compiler schema
 * ----------------------------------- */
export const ContainersZ = z.enum(['mp4', 'mkv', 'webm', 'hls', 'image2']);
export const HardwareZ = z.enum(['cpu', 'nvidia', 'intel', 'amd']);

/** Video codecs per hardware target */
export const VideoCodecCPUZ = z.enum([
  'libx264',
  'libx265',
  'libvpx-vp9',
  'mjpeg',
  'png',
  'libwebp',
]);
export const VideoCodecNVIDIAZ = z.enum(['h264_nvenc', 'hevc_nvenc']);
export const VideoCodecINTELZ = z.enum([
  'h264_qsv',
  'hevc_qsv',
  'h264_vaapi',
  'hevc_vaapi',
]);
export const VideoCodecAMDZ = z.enum(['h264_amf', 'hevc_amf']);
export const AudioCodecZ = z.enum(['aac', 'libopus', 'libmp3lame', 'copy']);

/** Presets (subset + normalized) */
export const PresetH264Z = z.enum([
  'ultrafast',
  'superfast',
  'veryfast',
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow',
]);
export const PresetNVENCZ = z.enum(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']);
export const PixelFormatZ = z.enum([
  'yuv420p',
  'yuv420p10le',
  'yuv422p10le',
  'yuv444p',
]);
export const ColorSpaceFlagZ = z.enum([
  'bt709',
  'bt470bg',
  'smpte170m',
  'smpte240m',
  'bt2020ncl',
  'bt2020cl',
]);
export const ColorPrimariesFlagZ = z.enum([
  'bt709',
  'bt470m',
  'bt470bg',
  'smpte170m',
  'smpte240m',
  'film',
  'bt2020',
  'smpte428',
  'smpte431',
  'smpte432',
  'jedec-p22',
]);
export const ColorTrcFlagZ = z.enum([
  'bt709',
  'gamma22',
  'gamma28',
  'smpte170m',
  'smpte240m',
  'linear',
  'log',
  'log_sqrt',
  'iec61966-2-4',
  'iec61966-2-1',
  'bt1361',
  'bt2020-10',
  'bt2020-12',
  'smpte2084',
  'arib-std-b67', // HLG
]);
export const VideoFourCCZ = z.enum(['hvc1', 'hev1', 'avc1', 'avc3']);
export const FilterSpecZ = z.union([
  z.object({
    kind: z.literal('format'),
    fmt: z.enum([
      'yuv420p',
      'yuv420p10le',
      'yuv422p10le',
      'yuv444p',
      'gbrpf32le',
    ]),
  }),
  z.object({ kind: z.literal('fps'), value: z.number().min(1).max(1000) }),
  z.object({
    kind: z.literal('fpsr'),
    num: z.number().min(1).max(100000),
    den: z.number().min(1).max(100000),
  }),
  z.object({
    kind: z.literal('scale'),
    w: z.number().int().min(-2).max(7680),
    h: z.number().int().min(16).max(4320),
    forceOriginalAspectRatio: z.enum(['decrease', 'increase']).optional(),
  }),
  z.object({
    kind: z.literal('pad'),
    w: z.number().int().min(16).max(7680),
    h: z.number().int().min(16).max(4320),
    align: z
      .enum([
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ])
      .default('center'),
  }),
  z.object({
    kind: z.literal('crop'),
    w: z.number().int().min(16).max(7680),
    h: z.number().int().min(16).max(4320),
    x: z.number().int().min(0).max(10000).default(0),
    y: z.number().int().min(0).max(10000).default(0),
  }),
  z
    .object({
      kind: z.literal('eq'),
      brightness: z.number().min(-1).max(1).optional(),
      contrast: z.number().min(0).max(2).optional(),
      saturation: z.number().min(0).max(3).optional(),
      gamma: z.number().min(0.1).max(10).optional(),
    })
    .refine(
      (v) =>
        v.brightness !== undefined ||
        v.contrast !== undefined ||
        v.saturation !== undefined ||
        v.gamma !== undefined,
      { message: 'eq requires at least one field' },
    ),
  z.object({
    kind: z.literal('colorspace'),
    all: z.enum(['bt709', 'smpte170m']),
  }),
  z.object({ kind: z.literal('lut3d'), lutId: z.string().min(1) }),
  z.object({
    kind: z.literal('tile'),
    cols: z.number().int().min(1).max(50),
    rows: z.number().int().min(1).max(50),
  }),
  z.object({
    kind: z.literal('unsharp'),
    luma_msize_x: z.number().int().min(3).max(11).optional(),
    luma_msize_y: z.number().int().min(3).max(11).optional(),
    luma_amount: z.number().min(-2).max(2).optional(),
  }),
]);
export const VideoRateControlZ = z
  .object({
    cq: z.number().int().min(0).max(51).optional(),
    crf: z.number().int().min(0).max(51).optional(),
    vbitrate: z
      .string()
      .regex(/^\d+(k|M)$/)
      .optional(),
    maxrate: z
      .string()
      .regex(/^\d+(k|M)$/)
      .optional(),
    bufsize: z
      .string()
      .regex(/^\d+(k|M)$/)
      .optional(),
  })
  .refine((v) => !(v.cq && v.vbitrate), {
    message: 'Choose either cq or vbitrate, not both',
    path: ['cq'],
  });
export const X265ParamsZ = z.object({
  keyint: z.number().int().min(1).max(1000).optional(),
  minKeyint: z.number().int().min(1).max(1000).optional(),
  scenecut: z.number().int().min(0).max(100).optional(),
  bframes: z.number().int().min(0).max(16).optional(),
  ref: z.number().int().min(1).max(4).optional(),
  openGop: z.enum(['0', '1']).optional(),
  rcLookahead: z.number().int().min(0).max(250).optional(),
  repeatHeaders: z.enum(['0', '1']).optional(),
  highTier: z.enum(['0', '1']).optional(),
  levelIdc: z.number().int().min(10).max(62).optional(),
  strongIntraSmoothing: z.enum(['0', '1']).optional(),
  sao: z.enum(['0', '1']).optional(),
  aqMode: z.number().int().min(0).max(3).optional(),
  aqStrength: z.number().min(0).max(3).optional(),
  psyRd: z.number().min(0).max(3).optional(),
  psyRdoq: z.number().min(0).max(3).optional(),
});
export const AudioSettingsZ = z.object({
  acodec: AudioCodecZ.default('aac'),
  abitrate: z
    .string()
    .regex(/^\d+(k|M)$/)
    .default('128k'),
  channels: z.number().int().min(1).max(8).default(2),
  sampleRate: z.number().int().min(8000).max(192000).optional(),
});

/** HLS options (VOD single-file enforced in compiler) */
export const HLSOptionsZ = z.object({
  segmentTime: z.number().min(0.1).max(30).default(4),
  flags: z
    .array(
      z.enum([
        'delete_segments',
        'append_list',
        'independent_segments',
        'temp_file',
        'single_file',
      ]),
    )
    .default(['independent_segments']),
  segmentFileId: z.string().optional(),
});
export const ImageOptionsZ = z.object({
  pattern: z.string().default('%04d.jpg'),
  vframes: z.number().int().min(1).max(100000).optional(),
});
export const TemplateInputZ = z.object({
  inputId: z.string().min(1),
  outputId: z.string().min(1),
  container: ContainersZ.default('mp4'),
  hardware: HardwareZ.default('cpu'),
  vcodec: z.string(),
  preset: z.string().optional(),
  profile: z
    .enum(['baseline', 'main', 'high', 'high10', 'main422-10'])
    .optional(),
  level: z
    .string()
    .regex(/^\d(\.[0-9])?$/)
    .optional(), // e.g., 5.2
  pix_fmt: PixelFormatZ.optional(),
  colorTags: z
    .object({
      colorspace: ColorSpaceFlagZ.optional(),
      colorPrimaries: ColorPrimariesFlagZ.optional(),
      colorTrc: ColorTrcFlagZ.optional(),
    })
    .optional(),
  videoTag: VideoFourCCZ.optional(),
  width: z.number().int().min(16).max(7680).optional(),
  height: z.number().int().min(16).max(4320).optional(),
  fps: z.number().min(1).max(1000).optional(),
  fpsr: z
    .tuple([z.number().min(1).max(100000), z.number().min(1).max(100000)])
    .optional(),
  ss: z.number().min(0).optional(),
  t: z.number().min(0).optional(),
  filters: z.array(FilterSpecZ).default([]),
  rc: VideoRateControlZ.default({}),
  gop: z.number().int().min(0).max(300).optional(),
  keyintMin: z.number().int().min(0).max(300).optional(),
  scThreshold: z.number().int().min(-1).max(100).optional(),
  x265: X265ParamsZ.optional(),
  vframes: z.number().int().min(1).max(100000).optional(),
  mute: z.boolean().default(false),
  audio: AudioSettingsZ.default({
    acodec: 'aac',
    abitrate: '128k',
    channels: 2,
  }),
  hls: HLSOptionsZ.optional(),
  image: ImageOptionsZ.optional(),
  restrictProtocols: z.boolean().default(true),
  movflagsFaststart: z.boolean().default(true),
});
export const TemplateBodyZ = TemplateInputZ.omit({
  inputId: true,
  outputId: true,
});

/** ----------------------------------
 * Job Payload schema
 * ----------------------------------- */
export const PxlPacketFilesZ = z.record(z.string().min(1), z.url());
export const NamedEncodingsZ = z.record(z.string().min(1), TemplateBodyZ);
export const PxlPacketVideosConfigZ = z.object({
  mezzanine: TemplateBodyZ.optional(),
  mp4: NamedEncodingsZ.optional(),
  hls: NamedEncodingsZ.optional(),
  thumbnail: NamedEncodingsZ.optional(),
  thumbnailSprite: NamedEncodingsZ.optional(),
  poster: NamedEncodingsZ.optional(),
  hover: NamedEncodingsZ.optional(),
});
export const PxlPacketEventsZ = z.object({
  jobStartedUrl: z.url().optional(),
  jobUpdatedUrl: z.url().optional(),
  jobCompletedUrl: z.url().optional(),
});
export const PxlPacketPassbackDataZ = z.record(
  z.string().min(1),
  z.union([z.string(), z.number(), z.boolean()]),
);
export const PxlPacketPayloadZ = z.object({
  version: z.string().min(1),
  files: PxlPacketFilesZ,
  originalId: z.string().min(1),
  calcAudioHeadroom: z.boolean().default(false),
  video: PxlPacketVideosConfigZ.optional(),
  events: PxlPacketEventsZ.optional(),
  passbackData: PxlPacketPassbackDataZ.optional(),
});

/** ----------------------------------
 * Webhook Payload schema
 * ----------------------------------- */

const JsonPrimitiveZ = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonPrimitive = z.infer<typeof JsonPrimitiveZ>;

export type JsonValue =
  | JsonPrimitive
  | { [k: string]: JsonValue }
  | JsonValue[];

export const JsonValueZ: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    JsonPrimitiveZ,
    z.array(JsonValueZ),
    z.record(z.string(), JsonValueZ),
  ]),
);

export const FfprobeInspectZ = z.object({
  durationSeconds: z.number().nonnegative().optional(),
  width: z.number().int().nonnegative().optional(),
  height: z.number().int().nonnegative().optional(),
  bitrateKbps: z.number().nonnegative().optional(),
  framerate: z.number().nonnegative().optional(),
  videoStreamCount: z.number().int().nonnegative().optional(),
  codec: z.string().min(1).optional(),
  audioChannels: z.number().int().nonnegative().optional(),
  bytes: z.number().int().nonnegative().optional(),
  raw: JsonValueZ.optional(),
});

export const PxlPacketWebhookPayloadZ = z.object({
  event: z.enum(['job.start', 'job.update', 'job.complete']),
  eventType: z.enum(['start', 'update', 'complete']),
  emittedAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  job: z.object({
    id: z.string().min(1),
    serviceAccountId: z.string().min(1),
    status: z.enum([
      'waiting',
      'pending',
      'in_progress',
      'completed',
      'error',
      'failed',
    ]),
    lastErrorMessage: z.string().min(1).nullable().optional(),
    startedAt: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .nullable()
      .optional(),
    completedAt: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .nullable()
      .optional(),
    createdAt: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .nullable()
      .optional(),
    updatedAt: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .nullable()
      .optional(),
  }),
  files: z.array(
    z.object({
      id: z.uuid(),
      taskId: z.uuid().nullable().optional(),
      jobId: z.uuid(),
      s3key: z.string().min(1),
      fingerprint: z.string().min(1).nullable().optional(),
      filename: z.string().min(1),
      inspect: FfprobeInspectZ.optional(),
      primaryOutput: z.boolean().optional().default(false),
      key: z.string().min(1),
      quality: z.string().min(1),
      createdAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
      updatedAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
      presignedGet: z.url(),
    }),
  ),
  passbackData: z.record(z.string(), z.any()).optional(),
});
