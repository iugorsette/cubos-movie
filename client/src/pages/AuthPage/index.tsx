import { useState } from 'react'
import { Card, Flex } from '@radix-ui/themes'
import MyButton from '../../components/Button'
import MyInput from '../../components/Input'
import {
  forgotPassword,
  loginService,
  register,
} from '../../services/auth.service'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type Mode = 'login' | 'register' | 'forgot'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login: loginContext } = useAuth()
  const navigate = useNavigate()

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const data = await loginService({
          email: form.email,
          password: form.password,
        })

        console.log('loginService return', data)
        loginContext(data.user, data.token)
        navigate('/filmes')
      }

      if (mode === 'register') {
        const data = await register({
          name: form.name,
          email: form.email,
          password: form.password,
        })
        loginContext(data.user, data.token) 
        navigate('/filmes')
      }

      if (mode === 'forgot') {
        await forgotPassword(form.email)
        alert('Link de recuperação enviado para seu email (simulado)')
        setMode('login')
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      align='center'
      justify='center'
      style={{ minHeight: '90vh', padding: 24 }}>
      <Card size='4' style={{ width: 420 }}>
        <form onSubmit={handleSubmit}>
          <Flex direction='column' gap='3'>
            <h2 style={{ margin: 0, textAlign: 'center' }}>
              {mode === 'login' && 'Entrar'}
              {mode === 'register' && 'Cadastrar'}
              {mode === 'forgot' && 'Recuperar senha'}
            </h2>

            {mode === 'register' && (
              <MyInput
                label='Nome'
                placeholder='Digite seu nome completo'
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            )}

            <MyInput
              label='Email'
              placeholder='Digite seu email'
              type='email'
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            {mode !== 'forgot' && (
              <MyInput
                label='Senha'
                placeholder='Digite sua senha'
                type='password'
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            )}

            {mode === 'register' && (
              <MyInput
                label='Confirmação de senha'
                placeholder='Repita sua senha'
                type='password'
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
              />
            )}

            {error && (
              <div style={{ color: '#E11D48', fontSize: 13 }}>{error}</div>
            )}

            <Flex align='center' justify='between'>
              {mode === 'login' && (
                <>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setMode('forgot')
                    }}
                    style={{ fontSize: 14 }}>
                    Esqueci minha senha
                  </a>
                  <MyButton type='submit' disabled={loading}>
                    {loading ? 'Carregando...' : 'Entrar'}
                  </MyButton>
                </>
              )}

              {mode === 'register' && (
                <>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setMode('login')
                    }}
                    style={{ fontSize: 14 }}>
                    Já tenho conta
                  </a>
                  <MyButton type='submit' disabled={loading}>
                    {loading ? 'Carregando...' : 'Cadastrar'}
                  </MyButton>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setMode('login')
                    }}
                    style={{ fontSize: 14 }}>
                    Voltar
                  </a>
                  <MyButton type='submit' disabled={loading}>
                    {loading ? 'Carregando...' : 'Recuperar'}
                  </MyButton>
                </>
              )}
            </Flex>

            {mode === 'login' && (
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  setMode('register')
                }}
                style={{ fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                Criar conta
              </a>
            )}
          </Flex>
        </form>
      </Card>
    </Flex>
  )
}
