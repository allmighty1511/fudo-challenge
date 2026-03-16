import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownItem } from '..';

describe('Dropdown', () => {
  it('shows trigger and hides menu initially', () => {
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('shows menu when trigger clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('calls onClick on DropdownItem', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem onClick={onClick}>Item 1</DropdownItem>
      </Dropdown>
    );
    await user.click(screen.getByText('Open'));
    await user.click(screen.getByText('Item 1'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies danger variant to DropdownItem', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem variant="danger">Delete</DropdownItem>
      </Dropdown>
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Delete')).toHaveClass('text-[var(--color-error)]');
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Dropdown trigger={<button>Open</button>}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
        <div data-testid="outside">Outside</div>
      </div>
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });
});
