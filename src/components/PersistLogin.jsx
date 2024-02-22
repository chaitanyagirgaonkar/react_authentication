import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import useLocalStorage from '../hooks/useLocalStorage'


function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth } = useAuth()
    const [persist] = useLocalStorage('persist', false)
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }

        if (!auth?.accessToken) {
            verifyRefreshToken()
        } else {
            setIsLoading(false)
        }
    }, [])
    useEffect(() => {
        console.log(`isLoading = ${isLoading}`)
        console.log(`accessToken = ${auth?.accessToken}`)
    }, [isLoading])
    return (
        <div>
            {!persist
                ? <Outlet />
                :
                isLoading
                    ? <p>LOADING...</p>
                    : <Outlet />
            }
        </div>
    )
}

export default PersistLogin
