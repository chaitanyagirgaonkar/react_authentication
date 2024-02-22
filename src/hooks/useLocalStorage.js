import { useState, useEffect } from 'react'

const getLocalValue = (key, initValue) => {
    // ssr next js
    if (typeof window === 'undefined') return initValue

    const localValue = JSON.parse(localStorage.getItem(key))

    if (localValue) return localValue

    if (initValue instanceof Function) return initValue()

    return initValue
}

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])
    return [value, setValue]
}

export default useLocalStorage