export interface IDisposable {
	/**
	 * Removes the event listener
	 */
	dispose: () => void;
}

export declare class Disposable implements IDisposable {
	private disposer;
	constructor(disposer: (...args: any[]) => void);
	dispose(): void;
	dispose(...args: any[]): void;
}

export declare class DisposablesComposite {
	private disposables;
	add(disposable: IDisposable): IDisposable;
	dispose(): void;
	dispose(...args: any[]): void;
}

export declare class Notificar<T> {
	private listeners;
	private onceListeners;
	dispatch(event: T, ...args: any[]): void;
	add(event: T, cb: (...args: any[]) => any): Disposable;
	once(event: T, cb: (...args: any[]) => any): Disposable;
	dispatchWithReturn<RetType>(event: T, ...args: any[]): RetType[];
	clear(event?: T): void;
}
