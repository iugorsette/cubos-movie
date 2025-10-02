import { Flex, Text } from '@radix-ui/themes'
import ThemeToggle from '../../theme/ThemeToggle'
import LogoLight from '../../assets/CubosLogo.png'
import LogoDark from '../../assets/CubosLogoDark.png'
import { useTheme } from '../../context/useTheme'
import MyButton from '../Button'
import { useAuth } from '../../context/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { isDark } = useTheme()
  const { user, logout } = useAuth()
  const isLoggedIn = !!user

  const navigate = useNavigate()
  return (
    <Flex
      align='center'
      justify='between'
      px='4'
      py='3'
      style={{ borderBottom: '1px solid var(--gray-a6)' }}>
      <Flex align='center' gap='2'>
        <img
          src={isDark ? LogoDark : LogoLight}
          alt='Logo'
          width={160}
          height={36}
        />
        <Text size='5' weight='bold'>
          Movies
        </Text>
      </Flex>

      <Flex align='center' gap='3'>
        <ThemeToggle />
        {isLoggedIn ? (
          <MyButton variant='primary' color='red' onClick={logout}>
            Logout
          </MyButton>
        ) : (
          <MyButton variant='primary' onClick={() => navigate('/auth')}>
            Login
          </MyButton>
        )}
      </Flex>
    </Flex>
  )
}
