import type { Container } from '../types';

export type PathResolver = {
  // where files are rooted — callers point these at safe dirs
  roots: {
    uploadsDir: string;
    outputsDir: string;
    hlsDir: string;
  };

  /** Resolve an input id to a file path */
  resolveInput(id: string): string;
  /** Resolve an output id + container to a file path */
  resolveOutput(id: string, container: Container): string;
  /** Resolve an HLS segment base path */
  resolveHLSSegment?(id: string): string;
};

export {};
