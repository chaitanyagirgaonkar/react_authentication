import React from 'react'
import { useRef, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useInput from '../hooks/useInput'
import useToggle from '../hooks/useToggle'



const LOGIN_URL = '/auth'

function Login() {
    const { setAuth } = useAuth()

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const userRef = useRef()
    const errRef = useRef()

    const [user, resetUser, userAttribs] = useInput('user', '')//useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [check, toggleCheck] = useToggle('persist', false)


    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }

            )
            console.log(JSON.stringify(response.data));
            const accessToken = response?.data?.accessToken;

            setAuth({ user, accessToken })
            // setUser('')
            resetUser()
            setPwd('')
            navigate(from, { replace: true })
        } catch (err) {
            if (!err?.response) {
                setErrMsg('no server response')
            } else if (err.response?.status === 400) {
                setErrMsg('missing username or password')
            } else if (err.response?.status === 401) {
                setErrMsg('Un authorized requeest')
            } else {
                setErrMsg('login failed')
            }
            errRef.current.focus()
        }
    }



    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>

            <h1>Sign In</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username :
                </label>
                <input
                    type="text"
                    id='username'
                    required
                    ref={userRef}
                    autoComplete="off"
                    {...userAttribs}


                />
                <label htmlFor="password">
                    Password :
                </label>
                <input
                    type="password"
                    id='password'
                    required
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                />

                <button>Sign In</button>
                <div className='persistCheck'>
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p>
                Need an Account? <br />
                <span className='line'>
                    <a href="#">Sign Up</a>
                </span>
            </p>
        </section>
    )
}

export default Login
