import { useMemo, useReducer } from 'react'

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

function createActionsDispatchers(actions, dispatch) {
  return Object.keys(actions).reduce(
    (accumulator, type) => ({
      ...accumulator,
      [type]: (payload) => dispatch({ payload, type }),
    }),
    {},
  )
}

export function useActionsReducer(actions, initialArg, initializer) {
  const reducer = useMemo(() => createActionsReducer(actions), [actions])

  const [state, dispatch] = useReducer(reducer, initialArg, initializer)

  const dispatchers = useMemo(
    () => createActionsDispatchers(actions, dispatch),
    [actions, dispatch],
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
