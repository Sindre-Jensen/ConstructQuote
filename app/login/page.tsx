'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Check your email for confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">{isSignUp ? 'Sign Up' : 'Login'}</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-900 hover:underline ml-1 font-medium"
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
