import { Injectable } from '@nestjs/common';

export interface DomainMetricSnapshot {
  readonly event: string;
  readonly count: number;
}

@Injectable()
export class DomainMetricsService {
  private readonly counters = new Map<string, number>();

  increment(event: string): void {
    const current = this.counters.get(event) ?? 0;
    this.counters.set(event, current + 1);
  }

  getCount(event: string): number {
    return this.counters.get(event) ?? 0;
  }

  toSnapshot(): DomainMetricSnapshot[] {
    return Array.from(this.counters.entries()).map(([event, count]) => ({
      event,
      count,
    }));
  }
}
