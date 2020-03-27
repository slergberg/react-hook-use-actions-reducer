import { useMemo, useReducer, useRef } from 'react'

function createActionsReducer(actions) {
  return function actionsReducer(state, action) {
    const reducerAction = actions[action.type]
    const reducerActionResult = reducerAction(
      state,
      action.payload,
      action.dispatch,
      action.type,
    )

    return reducerActionResult
  }
}

function createActionsDispatchers(actions, dispatchRef) {
  function actionDispatch(payload) {
    return dispatchRef.current({ dispatch: dispatchRef.current, ...payload })
  }

  return Object.keys(actions).reduce(
    (accumulator, type) => ({
      ...accumulator,
      [type]: (payload) =>
        dispatchRef.current({ dispatch: actionDispatch, payload, type }),
    }),
    {},
  )
}

export function useActionsReducer(actions, initialArg, initializer) {
  const reducer = useMemo(() => createActionsReducer(actions), [actions])

  const [state, dispatch] = useReducer(reducer, initialArg, initializer)

  const dispatchRef = useRef(dispatch)

  const dispatchers = useMemo(
    () => createActionsDispatchers(actions, dispatchRef),
    [actions, dispatchRef],
  )

  const stateWithDispatchers = useMemo(
    () => ({
      ...dispatchers,
      ...state,
    }),
    [dispatchers, state],
  )

  return [stateWithDispatchers, dispatch]
}
