export default {
  /**
   * @mode
   * 1: autoSave
   * 2: noSave & use mock data
   * 3: noSave & use online data
   */
  mode: 2,
  apiListConfig: [{
    mode: 1,
    host: "127.0.0.1:5500",
    url: "/next",
    proxyHost: "",
    proxyUrl: "/service.config.ts",
    data: [],
    dataType: {}
  }],
  proxyHost: "",
  proxyUrl: "",
  host: "localhost:3000",
  port: 3000
}