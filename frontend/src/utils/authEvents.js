class AuthEventBus extends EventTarget {
  emitUnauthorized() {
    this.dispatchEvent(new Event('unauthorized'));
  }

  onUnauthorized(callback) {
    this.addEventListener('unauthorized', callback);
  }

  offUnauthorized(callback) {
    this.removeEventListener('unauthorized', callback);
  }

  emitForbidden() {
    this.dispatchEvent(new Event('forbidden'));
  }

  onForbidden(callback) {
    this.addEventListener('forbidden', callback);
  }

  offForbidden(callback) {
    this.removeEventListener('forbidden', callback);
  }
}

export const authEvents = new AuthEventBus();
