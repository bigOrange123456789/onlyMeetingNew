if (typeof module !== 'undefined' && module.exports) {
  // node
  module.exports = PublicApi;
} else if (typeof window !== 'undefined') {
  // browser
  window.random = PublicApi;
} else {
  return PublicApi;
}
