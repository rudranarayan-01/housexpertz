const isDev = __DEV__;

export const apiLogger = {
  request(method?: string, url?: string) {
    if (!isDev) return;
    console.log(`🟦 [API REQUEST] ${method?.toUpperCase()} ${url}`);
  },

  success(method?: string, url?: string, status?: number) {
    if (!isDev) return;
    console.log(`🟩 [API SUCCESS] ${method?.toUpperCase()} ${url} - ${status}`);
  },

  error(method?: string, url?: string, status?: number, message?: string) {
    if (!isDev) return;
    console.log(
      `🟥 [API ERROR] ${method?.toUpperCase()} ${url} - ${status || "NO_STATUS"}`,
    );
    console.log(`🔻 ${message}`);
  },
};
