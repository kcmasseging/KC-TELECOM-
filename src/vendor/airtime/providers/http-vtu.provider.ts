import { VtuPurchaseParams, VtuPurchaseResult, VtuProvider } from './vtu.provider';
import * as https from 'https';
import { URL } from 'url';

export interface HttpVtuProviderOptions {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
  name?: string;
}

export class HttpVtuProvider implements VtuProvider {
  name: string;
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(opts: HttpVtuProviderOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
    this.apiKey = opts.apiKey;
    this.timeoutMs = opts.timeoutMs ?? 10000;
    this.name = opts.name ?? 'HTTP';
  }

  private providerSlug(network: string): string {
    const value = String(network).toUpperCase();
    if (value === 'NINE_MOBILE') return '9mobile';
    return value.toLowerCase();
  }

  async purchaseAirtime(params: VtuPurchaseParams): Promise<VtuPurchaseResult> {
    return this._post('/airtime/purchase', {
      provider_id: this.providerSlug(params.network),
      amount: params.amount,
      recipient: params.phone,
      reference: params.reference,
    });
  }

  async purchaseData(params: VtuPurchaseParams & { plan?: string }): Promise<VtuPurchaseResult> {
    if (!params.plan) return { success: false, message: 'Data plan ID is required' };
    return this._post('/data/purchase', {
      provider_id: this.providerSlug(params.network),
      plan_id: params.plan,
      recipient: params.phone,
      reference: params.reference,
    });
  }

  private async _post(path: string, params: any): Promise<VtuPurchaseResult> {
    if (!this.baseUrl) return { success: false, message: 'VTU_BASE_URL not configured' };
    if (!this.apiKey) return { success: false, message: 'VTU_API_KEY not configured' };

    try {
      const url = new URL(`${this.baseUrl}${path}`);
      const body = JSON.stringify(params);
      const requestOptions: https.RequestOptions = {
        method: 'POST',
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: this.timeoutMs,
      };

      const { statusCode, raw } = await new Promise<{ statusCode: number; raw: string }>((resolve, reject) => {
        const req = https.request(requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, raw: data }));
        });
        req.on('error', reject);
        req.on('timeout', () => req.destroy(new Error('VTU request timed out')));
        req.write(body);
        req.end();
      });

      let parsed: any;
      try { parsed = JSON.parse(raw); } catch { parsed = { message: raw }; }

      const success = statusCode >= 200 && statusCode < 300 && parsed?.status === 'success';
      const providerReference = parsed?.data?.reference_code ?? parsed?.reference_code ?? undefined;
      const message = parsed?.message ?? parsed?.data?.message;
      return { success, providerReference, rawResponse: parsed, message };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
  }
}
