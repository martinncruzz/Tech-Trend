declare interface Env {
  readonly NG_APP_BACKEND_URL: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
