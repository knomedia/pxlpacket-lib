import { z } from 'zod';

export const ContainersZ = z.enum(['mp4', 'mkv', 'webm', 'hls', 'image2']);

export const HardwareZ = z.enum(['cpu', 'nvidia', 'intel', 'amd']);

/** Video codecs per hardware target (whitelisted) */
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
export const PresetNVENCZ = z.enum(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']); // nvenc perf levels

/** Pixel formats users can set directly on the encoder */
export const PixelFormatZ = z.enum([
  'yuv420p',
  'yuv420p10le',
  'yuv422p10le',
  'yuv444p',
]);

/** Color metadata flags (annotate stream; do not transform pixels) */
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

/** MP4/H.264/H.265 FourCC video tags */
export const VideoFourCCZ = z.enum(['hvc1', 'hev1', 'avc1', 'avc3']);

/** Filters */
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

/** Video rate control (software encoders etc.) */
export const VideoRateControlZ = z
  .object({
    // Constant quality for hardware encoders (e.g., NVENC)
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

/** x265 allow-listed params */
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

/** Audio settings */
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

/** Image sequence options (image2 muxer) */
export const ImageOptionsZ = z.object({
  pattern: z.string().default('%04d.jpg'),
  vframes: z.number().int().min(1).max(100000).optional(),
});

/** Main TemplateInput schema */
export const TemplateInputZ = z.object({
  inputId: z.string().min(1),
  outputId: z.string().min(1),
  container: ContainersZ.default('mp4'),

  hardware: HardwareZ.default('cpu'),

  /** Codec name (allowed lists depend on hardware/container) */
  vcodec: z.string(),

  // Optional encoder knobs
  preset: z.string().optional(),
  profile: z
    .enum(['baseline', 'main', 'high', 'high10', 'main422-10'])
    .optional(),
  level: z
    .string()
    .regex(/^\d(\.[0-9])?$/)
    .optional(), // e.g., 5.2
  pix_fmt: PixelFormatZ.optional(),

  // Stream/container color metadata (flags)
  colorTags: z
    .object({
      colorspace: ColorSpaceFlagZ.optional(),
      colorPrimaries: ColorPrimariesFlagZ.optional(),
      colorTrc: ColorTrcFlagZ.optional(),
    })
    .optional(),

  // MP4 FourCC video tag
  videoTag: VideoFourCCZ.optional(),

  // Convenience dimensions/fps (compiled into filters)
  width: z.number().int().min(16).max(7680).optional(),
  height: z.number().int().min(16).max(4320).optional(),
  fps: z.number().min(1).max(1000).optional(),
  fpsr: z
    .tuple([z.number().min(1).max(100000), z.number().min(1).max(100000)])
    .optional(),

  // Timing (input-side)
  ss: z.number().min(0).optional(),
  t: z.number().min(0).optional(),

  // Filters
  filters: z.array(FilterSpecZ).default([]),

  // Rate control
  rc: VideoRateControlZ.default({}),

  // GOP controls
  gop: z.number().int().min(0).max(300).optional(),
  keyintMin: z.number().int().min(0).max(300).optional(),
  scThreshold: z.number().int().min(-1).max(100).optional(),

  // x265 params
  x265: X265ParamsZ.optional(),

  // Frames (for images or limited outputs)
  vframes: z.number().int().min(1).max(100000).optional(),

  // Mute
  mute: z.boolean().default(false),

  // Audio
  audio: AudioSettingsZ.default({
    acodec: 'aac',
    abitrate: '128k',
    channels: 2,
  }),

  // HLS
  hls: HLSOptionsZ.optional(),

  // Images
  image: ImageOptionsZ.optional(),

  // Safety toggles
  restrictProtocols: z.boolean().default(true),
  movflagsFaststart: z.boolean().default(true),
});

export const TemplateBodyZ = TemplateInputZ.omit({
  inputId: true,
  outputId: true,
});
