import * as path from 'node:path';
import type { Container } from '../types';
import type { PathResolver } from './path-resolver';

export class DefaultPathResolver implements PathResolver {
  constructor(public roots: PathResolver['roots']) {}

  sanitizeId(id: string): string {
    // keep it boring: letters/numbers/_/-/./
    return id.replace(/[^a-zA-Z0-9_\-.]/g, '_');
  }

  ensureBase(base: string, p: string): string {
    const abs = path.resolve(base, p);
    const rel = path.relative(base, abs);
    if (rel.startsWith('..')) {
      throw new Error(`Path escaped base: ${abs}`);
    }
    return abs;
  }

  resolveInput(id: string): string {
    const safe = this.sanitizeId(id);
    return this.ensureBase(this.roots.uploadsDir, safe);
  }

  resolveOutput(id: string, container: Container): string {
    const safe = this.sanitizeId(id);
    const ext =
      container === 'mp4'
        ? '.mp4'
        : container === 'webm'
          ? '.webm'
          : container === 'mkv'
            ? '.mkv'
            : container === 'hls'
              ? '.m3u8'
              : container === 'image2'
                ? '.jpg'
                : '';
    const fileName = safe.endsWith(ext) ? safe : `${safe}${ext}`;
    return this.ensureBase(this.roots.outputsDir, fileName);
  }

  resolveHLSSegment(id: string): string {
    const safe = this.sanitizeId(id);
    return this.ensureBase(this.roots.outputsDir, `${safe}.ts`);
  }
}
