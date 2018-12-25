# Notificar - A Cooler Event Library

Features include:

 - Unlike `on`, `off`, `addListener`, `removeListener` etc. `Notificar` event subscriptions return a `Disposable` object with `dispose()` method to unsubscribe from event.
 - Above feature allows you to group event subscriptions using `DisposablesComposite` and dispose them all with one call, i.e `DisposableComposite#dispose()`
 - Listeners voice matters!! You can now dispatch an event using `Notificar#dispatchWithReturn` where each listener's return value can be accessed from returned array.

 The Last feature can come in handy like in example below:

```javascript

// Here some listeners are subscribed to `onWillCommit` event, but we can allow listeners to disagree if they deem so
commitChange(change) {
    // ...

    // here we'll notify all `will-commit` listeners, but if one of them returns false, we'll abort the `commit` operation
    if (this.notificar.dispatchWithReturn('will-commit', this.currentValue).some((canCommit) => canCommit === false)) {
        return
    }

    // Proceed with commit opertaion

    // ...
}
```

## Usage

```bash
npm i notificar
```

```typescript
// Textbuffer.ts (I highly recommend TypeScript as you can get a huge performance boost by using `enum`s instead of strings as event identifiers)

import { Notificar } from 'notificar'
// ...

enum TextBufferEvent {
    WillSave,
    WillPaste,
}

class TextBuffer implements IDisposable {
    private notificar = new Notificar<TextBufferEvent>()
    // ...

    public onWillPaste(callback: (textFragment: TextFragment, pos: Position) => void): IDiposable {
        return this.notificar.add(TextBufferEvent.Will, callback)
    }

    public onWillSave(callback: () => void): IDiposable {
        return this.notificar.add(TextBufferEvent.WillSave, callback)
    }

    // ...

    private _pasteTextFragment(textFragment: TextFragment, pos: Position): boolean {
        // ...
        this.notificar.dispatch(TextBufferEvent.WillPaste, textFragment, pos) // dispatch with args
        // ...
    }

    private _trySave(): boolean {
        // ...
        this.notificar.dispatch(TextBufferEvent.WillSave) // dispatch without args
        // ...
    }
}

```

Full API can be found in `index.d.ts`

## License

MIT © 2018 Neek Sandhu
