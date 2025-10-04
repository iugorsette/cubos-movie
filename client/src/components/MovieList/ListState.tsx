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
      <Flex justify="center" align="center" style={{ minHeight: 100 }}>
        <Spinner />
        <span style={{ marginLeft: 8 }}>Carregando...</span>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 100, color: 'red' }}>
        {error}
      </Flex>
    )
  }

  if (Children.count(children) === 0) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 100, color: '#666' }}>
        {emptyMessage}
      </Flex>
    )
  }

  return <>{children}</>
}
