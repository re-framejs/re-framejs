## 1.0.3 (2017.05) 
- Added deref function into core

## 1.0.3 (2017.05) 
- Adding ui and uix functions for react components. `ui` is replacement for viewSP and `uix` is replacement for viewSP usable in jsx components.

## 1.0 (2017.04)

- Rewritten from scratch using interceptor pattern
- [Effects](https://github.com/Day8/re-frame/blob/master/docs/Effects.md) and [Coeffects](https://github.com/Day8/re-frame/blob/master/docs/Coeffects.md) should be used instead of middleware
- State machine is used internally to improve performance and error handling.
- Custom observable supporting atom, cursor, reaction
- subscriptions are cached and can be chained

### Deprecation
- pause$ was replaced with togglePause, will be removed soon

#### Breaking
- subscribe no longer returns RX stream. Custom observable is used instead

