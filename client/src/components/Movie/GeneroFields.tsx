import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import MyInput from '../Input'
import MyButton from '../Button'

type GenerosFieldProps = {
  generos: string[]
  setGeneros: (generos: string[]) => void
  maxGeneros?: number
}

export default function GenerosField({
  generos,
  setGeneros,
  maxGeneros = 10,
}: GenerosFieldProps) {
  const [newGenero, setNewGenero] = useState('')

  function addGenero() {
    const g = newGenero.trim()
    if (!g || generos.includes(g) || generos.length >= maxGeneros) return
    const updated = [...generos, g]
    setGeneros(updated)
    setNewGenero('')
  }

  function removeGenero(g: string) {
    const updated = generos.filter((x) => x !== g)
    setGeneros(updated)
  }

  return (
    <div style={{ width: '100%' }}>
      <strong>Gêneros</strong>
      <Flex wrap="wrap" style={{ gap: '4px', marginTop: 4 }}>
        {generos.map((g) => (
          <div
            key={g}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              borderRadius: 4,
              backgroundColor: '#8E4EC6',
              color: '#fff',
              gap: '4px',
            }}>
            {g}
            <MyButton type="button" onClick={() => removeGenero(g)}>
              ×
            </MyButton>
          </div>
        ))}
        {generos.length < maxGeneros && (
          <div style={{ display: 'flex', gap: 4 }}>
            <MyInput
              value={newGenero}
              onChange={(e) => setNewGenero(e.target.value)}
              placeholder="Novo gênero"
            />
            <MyButton
              colorVariant="primary"
              type="button"
              onClick={addGenero}
              iconButton
              icon={<PlusIcon />}
            />
          </div>
        )}
      </Flex>
    </div>
  )
}
