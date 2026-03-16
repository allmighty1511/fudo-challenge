import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';

interface OptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
}

export function OptionsMenu({
  onEdit,
  onDelete,
  align = 'right',
  size = 'md',
}: OptionsMenuProps) {
  const isCompact = size === 'sm';

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          className={
            isCompact
              ? 'p-1 rounded hover:bg-gray-100 text-[var(--color-text-muted)] text-xs'
              : 'p-2 rounded hover:bg-gray-100 text-[var(--color-text-muted)]'
          }
          aria-label="Opciones"
        >
          {isCompact ? (
            '···'
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          )}
        </button>
      }
      align={align}
    >
      <DropdownItem onClick={onEdit}>Editar</DropdownItem>
      <DropdownItem variant="danger" onClick={onDelete}>
        Eliminar
      </DropdownItem>
    </Dropdown>
  );
}
