declare module "whois-json" {
  interface WhoisRecord {
    creationDate?: string;
    registrar?: string;
    [key: string]: unknown;
  }

  export default function whois(domain: string, options?: Record<string, unknown>): Promise<WhoisRecord>;
}

