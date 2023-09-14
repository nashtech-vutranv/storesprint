import {useEffect, useRef} from 'react'
import {Location} from 'react-router-dom'

export default function usePersistLocationState(location: Location) {
  const stateRef = useRef<any>(null)
  useEffect(() => {
    if (location.state !== null) {
        stateRef.current = {...location.state}
    }
  }, [location.state])
  return {
    state: stateRef.current
  }
}
