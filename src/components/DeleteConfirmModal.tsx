import { Button } from './Button'
import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type DeleteConfirmModalProps = {
  title: string
  description: string
}

export function DeleteConfirmModal({ title, description }: DeleteConfirmModalProps) {
  return (
    <section className="bg-white p-6" style={{ ...surfaceConfig.card }}>
      <div className="mx-auto max-w-md bg-white p-6" style={{ ...surfaceConfig.card }}>
        <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h2>
        <p className="mt-2 text-sm leading-6" style={{ color: tokens.colors.slate[600] }}>{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>
    </section>
  )
}
