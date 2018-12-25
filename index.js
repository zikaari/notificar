"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

class Disposable {
	constructor(disposer) {
		this.disposer = disposer;
	}
	dispose(...args) {
		this.disposer.apply(this.disposer, args);
	}
}

exports.Disposable = Disposable;

class DisposablesComposite {
	constructor() {
		this.disposables = new Set();
	}
	add(disposable) {
		this.disposables.add(disposable);
		return disposable;
	}
	dispose(...args) {
		for (const disposable of this.disposables) {
			disposable.dispose.apply(disposable, args);
		}
	}
}

exports.DisposablesComposite = DisposablesComposite;

class Notificar {
	constructor() {
		this.listeners = new Map();
		this.onceListeners = new Map();
	}
	dispatch(event, ...args) {
		const callbacks = this.listeners.get(event);
		if (callbacks) {
			callbacks.forEach((cb) => cb(...args));
		}
		const onceCallbacks = this.onceListeners.get(event);
		if (onceCallbacks) {
			onceCallbacks.forEach((cb) => cb(...args));
			this.onceListeners.delete(event);
		}
	}
	add(event, cb) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		const existing = this.listeners.get(event);
		existing.add(cb);
		return new Disposable(() => {
			existing.delete(cb);
		});
	}
	once(event, cb) {
		if (!this.onceListeners.has(event)) {
			this.onceListeners.set(event, new Set());
		}
		const existing = this.onceListeners.get(event);
		existing.add(cb);
		return new Disposable(() => {
			existing.delete(cb);
		});
	}
	dispatchWithReturn(event, ...args) {
		const callbacks = Array.from(this.listeners.get(event) || []);
		return callbacks.map((cb) => cb(...args));
	}
	clear(event) {
		if (event) {
			this.listeners.delete(event);
			this.onceListeners.delete(event);
		}
		else {
			this.listeners.clear();
			this.onceListeners.clear();
		}
	}
}

exports.Notificar = Notificar;
