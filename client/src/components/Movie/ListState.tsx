import { Flex, Spinner } from '@radix-ui/themes'
import { Children, type ReactNode } from 'react'

type ListStateProps = {
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  children: ReactNode
}

export default function ListState({
  loading = false,
  error = null,
  emptyMessage = 'Nenhum item encontrado',
  children,
}: ListStateProps) {
  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '70vh' }}>
        <Spinner />
        <span style={{ marginLeft: 8 }}>Carregando...</span>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '70vh', color: 'red' }}>
        {error}
      </Flex>
    )
  }

  if (Children.count(children) === 0) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '70vh', color: '#666' }}>
        {emptyMessage}
      </Flex>
    )
  }

  return <>{children}</>
}
