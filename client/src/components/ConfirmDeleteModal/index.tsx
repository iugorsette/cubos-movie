import { useTheme } from '../../hooks/useTheme'
import * as Dialog from '@radix-ui/react-dialog'
import MyButton from '../Button'

type ConfirmDeleteModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  movieTitle: string
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
}: ConfirmDeleteModalProps) {
  const { isDark } = useTheme()

  const overlayColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)'
  const backgroundColor = isDark ? '#222' : '#fff'
  const textColor = isDark ? '#f5f5f5' : '#111'

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: overlayColor,
            position: 'fixed',
            inset: 0,
          }}
        />
        <Dialog.Content
          style={{
            backgroundColor,
            color: textColor,
            padding: '24px',
            borderRadius: 8,
            width: '400px',
            maxWidth: '90%',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: isDark
              ? '0 10px 30px rgba(0,0,0,0.5)'
              : '0 10px 30px rgba(0,0,0,0.2)',
          }}>
          <Dialog.Title style={{ fontSize: 18, fontWeight: 600 }}>
            Confirmar exclusão
          </Dialog.Title>
          <p>
            Deseja realmente deletar o filme <strong>{movieTitle}</strong>?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Dialog.Close asChild>
              <MyButton colorVariant='secondary'>Cancelar</MyButton>
            </Dialog.Close>
            <MyButton
              colorVariant='primary'
              onClick={() => {
                onConfirm()
                onClose()
              }}>
              Deletar
            </MyButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
